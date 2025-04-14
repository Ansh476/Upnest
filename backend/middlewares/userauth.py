from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
import os

def userauth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get("token")

        if not token:
            return jsonify({"message": "Authentication token is missing"}), 401

        try:
            secret_key = os.environ.get("JWT_SECRET_KEY", "your_default_secret_key")
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            g.user_email = payload["email"]  # Attach user email to `g` (Flask global)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated_function
