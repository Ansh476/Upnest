from flask import request, jsonify, current_app, Blueprint, g
import json
from middlewares.userauth import userauth

recommend_courses_routes = Blueprint("recommend_courses", __name__)

@recommend_courses_routes.route("/recommend-courses", methods=["GET"])
@userauth
def recommend_courses():
    db = current_app.db
    user_email = g.user_email

    # Fetch the user using email
    user = db.users.find_one({"email": user_email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_skills = user.get("skills", [])
    if not user_skills:
        return jsonify({"message": "User has no skills listed", "recommended_courses": []}), 200

    try:
        with open("data/courses.json", 'r') as f:
            skill_based_courses = json.load(f)

        flattened_courses = []
        for skill_group in skill_based_courses:
            flattened_courses.extend(skill_group["courses"])

        recommended_courses = []
        for course in flattened_courses:
            course_title = course.get("title", "").lower()
            for skill in user_skills:
                if skill.lower() in course_title:
                    recommended_courses.append(course)
                    break

        return jsonify({"recommended_courses": recommended_courses}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
