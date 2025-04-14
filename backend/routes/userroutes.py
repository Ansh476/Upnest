from flask import Blueprint, request, jsonify, g, current_app

from models.user import get_user_collection, find_user_by_email
from middlewares.userauth import userauth
from pymongo import UpdateOne

user_routes = Blueprint('user_routes', __name__)

# Route to get user profile
@user_routes.route('/profile', methods=['GET'])
@userauth
def get_profile():
    user = find_user_by_email(current_app.db, g.user_email)
    if user:
        response = jsonify({
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "gender": user["gender"],
            "dob": user["dob"],
            "skills": ", ".join(user["skills"])  # Assuming skills is a list
        })
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 200
    else:
        response = jsonify({"message": "User not found"})
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 404

# Route to update user profile
@user_routes.route('/profile/update', methods=['PUT'])
@userauth
def update_profile():
    updated_data = request.get_json()
    user_collection = get_user_collection(current_app.db)

    update_query = {
        "$set": {
            "name": updated_data.get("name"),
            "phone": updated_data.get("phone"),
            "gender": updated_data.get("gender"),
            "dob": updated_data.get("dob"),
            "skills": updated_data.get("skills").split(",")  # Assuming skills is a comma-separated string
        }
    }

    result = user_collection.update_one({"email": g.user_email}, update_query)

    if result.modified_count > 0:
        response = jsonify({"message": "Profile updated successfully!"})
    else:
        response = jsonify({"message": "No changes made."})

    response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    return response, 200
