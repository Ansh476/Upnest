import hashlib
import os

def get_user_collection(db):
    return db.users

def hash_password(password, salt=None):
    if not salt:
        salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex(), password_hash.hex()

def verify_password(provided_password, stored_salt, stored_hash):
    salt_bytes = bytes.fromhex(stored_salt)
    _, new_hash = hash_password(provided_password, salt_bytes)
    return new_hash == stored_hash

def create_user(db, user_data):
    return get_user_collection(db).insert_one(user_data)


def find_user_by_email(db, email):
    user = get_user_collection(db).find_one({"email": email})
    if user and "my_courses" not in user:
        user["my_courses"] = []
    return user
