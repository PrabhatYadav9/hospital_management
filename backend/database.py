from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import Config

_client = None
_db = None


def get_db():
    """Return the MongoDB database instance (singleton)."""
    global _client, _db
    if _db is None:
        try:
            _client = MongoClient(Config.MONGODB_URI, serverSelectionTimeoutMS=5000)
            # Verify connection
            _client.admin.command("ping")
            _db = _client[Config.DATABASE_NAME]
            print(f"[+] Connected to MongoDB Atlas -- database: '{Config.DATABASE_NAME}'")
        except ConnectionFailure as e:
            print(f"[!] MongoDB connection failed: {e}")
            raise
    return _db


def close_db():
    """Close the MongoDB connection."""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
