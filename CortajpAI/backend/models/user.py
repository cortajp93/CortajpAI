from bcrypt import hashpw, gensalt, checkpw
from config.db import db

class User:
    @staticmethod
    def create_user(email, password):
        if db.users.find_one({"email": email}):
            return None

        hashed_password = hashpw(password.encode("utf-8"), gensalt())
        user = {"email": email, "password": hashed_password, "credits": 0}
        db.users.insert_one(user)
        return user

    @staticmethod
    def authenticate_user(email, password):
        user = db.users.find_one({"email": email})
        if user and checkpw(password.encode("utf-8"), user["password"]):
            return user
        return None

    @staticmethod
    def get_user_by_email(email):
        return db.users.find_one({"email": email})

    @staticmethod
    def update_credits(email, amount):
        db.users.update_one({"email": email}, {"$inc": {"credits": amount}})