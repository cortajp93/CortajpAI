from flask import Blueprint, request, jsonify
from utils.auth import register_user, login_user
from utils.jwt_handler import decode_access_token

auth_routes = Blueprint("auth", __name__)

@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    user = register_user(email, password)
    if user:
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    else:
        return jsonify({"error": "El usuario ya existe"}), 400

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    result = login_user(email, password)
    if result:
        return jsonify({"message": "Inicio de sesión exitoso", "data": result}), 200
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401

@auth_routes.route("/logout", methods=["POST"])
def logout():
    # En un sistema real, invalidaríamos el token JWT aquí
    return jsonify({"message": "Sesión cerrada"}), 200