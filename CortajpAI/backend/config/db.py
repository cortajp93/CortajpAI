from pymongo import MongoClient

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client.cortajp_ai  # Nombre de la base de datos