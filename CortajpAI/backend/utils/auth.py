from models.user import User
from utils.jwt_handler import create_access_token

def register_user(email, password):
    return User.create_user(email, password)

def login_user(email, password):
    user = User.authenticate_user(email, password)
    if user:
        access_token = create_access_token({"email": email})
        return {"user": {"email": user["email"], "credits": user["credits"]}, "access_token": access_token}
    return None