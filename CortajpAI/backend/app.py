from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_routes

app = Flask(__name__)
CORS(app)  # Permitir solicitudes CORS

# Registrar rutas
app.register_blueprint(auth_routes, url_prefix="/api/auth")

# Manejador de errores global
@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({"error": "Ha ocurrido un error en el servidor"}), 500

if __name__ == "__main__":
    app.run(debug=True)