from flask import Blueprint, request, jsonify, current_app, make_response
from models.user import create_user, find_user_by_email, hash_password, verify_password
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import random
import jwt
import os
from middlewares.userauth import userauth

auth_routes = Blueprint("auth", __name__)

otp_storage = {}

def generate_jwt(email):
    secret_key = os.environ.get("JWT_SECRET_KEY", "your_default_secret_key")
    expiration = datetime.utcnow() + timedelta(days=7)

    payload = {
        "email": email,
        "exp": expiration
    }

    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token

def send_otp_email(recipient_email, otp):
    sender_email = os.environ["MAIL_USERNAME"]
    sender_password = os.environ["MAIL_PASSWORD"]

    message = MIMEMultipart("alternative")
    message["Subject"] = "Your OTP for Signup"
    message["From"] = sender_email
    message["To"] = recipient_email
    message.attach(MIMEText(f"Your OTP for signup is: {otp}", "plain"))

    try:
        server = smtplib.SMTP(os.environ["MAIL_SERVER"], int(os.environ["MAIL_PORT"]))
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()
        print(f"OTP sent to {recipient_email}")
    except Exception as e:
        print("Error sending email:", e)

@auth_routes.route('/signup', methods=["POST","OPTIONS"])
def signup():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200
    db = current_app.db
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"message": "Name, Email, and Password are required"}), 400

    if find_user_by_email(db, email):
        return jsonify({"message": "User already exists"}), 400

    otp = str(random.randint(100000, 999999))

    # Hash the password before storing it
    salt, password_hash = hash_password(password)

    otp_storage[email] = {
        "otp": otp,
        "password_hash": password_hash,  # Store hashed password
        "salt": salt,  # Store salt for future verification
        "temp_data": data
    }

    send_otp_email(email, otp)
    return jsonify({"message": "OTP sent"}), 200

@auth_routes.route('/verify-otp', methods=["POST","OPTIONS"])
def verify_otp():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    db = current_app.db
    data = request.json
    email = data.get("email")
    user_otp = data.get("otp")

    otp_record = otp_storage.get(email)
    if not otp_record or otp_record["otp"] != user_otp:
        return jsonify({"message": "Invalid OTP"}), 400

    temp_data = otp_record["temp_data"]
    password_hash = otp_record["password_hash"]
    salt = otp_record["salt"]

    # ✅ Safely convert skills whether it's a string or list
    raw_skills = temp_data.get("skills", "")
    if isinstance(raw_skills, str):
        skills_list = [skill.strip() for skill in raw_skills.split(",") if skill.strip()]
    elif isinstance(raw_skills, list):
        skills_list = [skill.strip() for skill in raw_skills if isinstance(skill, str) and skill.strip()]
    else:
        skills_list = []

    user_data = {
        "name": temp_data.get("name"),
        "email": email,
        "password_hash": password_hash,
        "salt": salt,
        "phone": temp_data.get("phone"),
        "gender": temp_data.get("gender"),
        "dob": temp_data.get("dob"),
        "skills": skills_list,
        "is_verified": True
    }

    create_user(db, user_data)
    otp_storage.pop(email, None)

    token = generate_jwt(email)

    response = make_response(jsonify({
        "message": "Signup successful",
        "user": {
            "name": user_data["name"],
            "email": user_data["email"],
            "skills": user_data["skills"]
        }
    }), 201)

    response.set_cookie(
        "token", token,
        httponly=True,
        secure=False,  # For localhost
        samesite='Lax',
        max_age=7 * 24 * 60 * 60
    )

    return response
@auth_routes.route('/login', methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        # Handle the preflight OPTIONS request
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    # Handle POST login request
    db = current_app.db
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and Password required"}), 400

    user = find_user_by_email(db, email)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Verify the password
    if not verify_password(password, user["salt"], user["password_hash"]):
        return jsonify({"message": "Incorrect password"}), 401

    # Generate JWT token
    token = generate_jwt(email)

    # Create response and set cookie
    response = make_response(jsonify({
        "message": "Login successful",
        "user": {
            "name": user.get("name"),
            "email": user.get("email"),
            "skills": user.get("skills")
        }
    }), 200)

    # ✅ Set HTTP-only cookie
    response.set_cookie(
        "token", token,
        httponly=True,
        secure=False,  # Fixed for localhost (set True for production)
        samesite='Lax',
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return response

@auth_routes.route('/logout', methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        # Handle the preflight OPTIONS request
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    # Handle POST logout request
    response = make_response(jsonify({"message": "Logout successful"}), 200)

    # Clear token cookie (set expires to 0)
    response.set_cookie(
        "token", "", 
        expires=0, 
        httponly=True,
        secure=False,  # Fixed for localhost (set True for production)
        samesite='Lax'
    )

    return response

from flask import Blueprint, jsonify, g
from middlewares.userauth import userauth

@auth_routes.route('/verify-token', methods=['GET'])
@userauth
def verify_token():
    token = request.cookies.get("token")
    if not token:
        return jsonify({"message": "No token"}), 401

    try:
        decoded = jwt.decode(token, os.environ['JWT_SECRET_KEY'], algorithms=["HS256"])
        return jsonify({"valid": True, "email": decoded['email']}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

