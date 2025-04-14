from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import os

from routes.auth import auth_routes
from routes.courses import courses_routes
from routes.recommend_courses import recommend_courses_routes
from routes.my_courses import mycourse_routes
from routes.userroutes import user_routes

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)


# MongoDB
client = MongoClient(os.environ["MONGO_URI"])
db = client.get_database()

app.config['SECRET_KEY'] = os.environ["SECRET_KEY"]
app.db = db

app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(courses_routes, url_prefix="/api/courses")
app.register_blueprint(recommend_courses_routes, url_prefix="/api/courses")
app.register_blueprint(mycourse_routes, url_prefix="/api/my-courses")
app.register_blueprint(user_routes, url_prefix="/api/user")

if __name__ == '__main__':
    app.run(debug=True)
