from flask import Blueprint, jsonify
import json
import os

courses_routes = Blueprint("courses", __name__)

@courses_routes.route("/", methods=["GET"])
def get_courses():
    try:
        file_path = os.path.join(os.getcwd(), 'data/courses.json')
        with open(file_path, 'r') as f:
            skill_based_courses = json.load(f)

        flattened_courses = []
        for skill_group in skill_based_courses:
            flattened_courses.extend(skill_group["courses"])

        return jsonify(flattened_courses)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
