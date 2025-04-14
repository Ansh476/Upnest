from flask import Blueprint, request, jsonify, current_app, g
from middlewares.userauth import userauth
import os
import json

mycourse_routes = Blueprint("mycourse", __name__)

def load_courses():
    base_dir = os.path.dirname(os.path.dirname(__file__))  # This goes from /backend/routes to /backend
    file_path = os.path.join(base_dir, 'data', 'courses.json')  # Now points to /backend/data/courses.json
    with open(file_path, 'r') as f:
        return json.load(f)

@mycourse_routes.route('/add', methods=["POST"])
@userauth
def add_course_to_user():
    db = current_app.db
    data = request.json
    course_id = data.get("course_id")

    if not course_id:
        return jsonify({"message": "course_id is required"}), 400

    result = db.users.update_one(
        {"email": g.user_email},
        {"$addToSet": {"my_courses": course_id}}
    )

    if result.modified_count == 0:
        return jsonify({"message": "Course already in My Courses"}), 200

    return jsonify({"message": "Course added to My Courses"}), 200

@mycourse_routes.route('/remove', methods=["DELETE"])
@userauth
def remove_course_from_user():
    db = current_app.db
    data = request.json
    course_id = data.get("course_id")

    if not course_id:
        return jsonify({"message": "course_id is required"}), 400

    result = db.users.update_one(
        {"email": g.user_email},
        {"$pull": {"my_courses": course_id}}
    )

    if result.modified_count == 0:
        return jsonify({"message": "Course not found in My Courses"}), 404

    return jsonify({"message": "Course removed from My Courses"}), 200

@mycourse_routes.route('/get-courses', methods=["GET"])
@userauth
def get_user_courses():
    db = current_app.db
    user = db.users.find_one({"email": g.user_email})

    if not user or "my_courses" not in user:
        response = jsonify({"courses": []})
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 200

    course_ids = user.get("my_courses", [])
    all_courses = load_courses()

    # Flatten all courses
    flattened_courses = []
    for skill in all_courses:
        flattened_courses.extend(skill.get("courses", []))

    user_courses = [course for course in flattened_courses if course["_id"] in course_ids]

    response = jsonify({"courses": user_courses})
    response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    return response, 200


