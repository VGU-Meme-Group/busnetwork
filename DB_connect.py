import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient

class MongoDB_Atlas_Connection:
    def __init__(self) -> None:
        pass
    
    def establish_connection():
        """establish the connection to the MongoDB Atlas Server

        Returns:
            client
        """
        load_dotenv()

        MONGODB_ATLAS_USER = os.getenv('MONGODB_ATLAS_USER')
        MONGODB_ATLAS_PASS = os.getenv('MONGODB_ATLAS_PASS')
        MONGODB_ATLAS_CLUSTER_ADDRESS = os.getenv('MONGODB_ATLAS_CLUSTER_ADDRESS')

        uri = f"mongodb+srv://{MONGODB_ATLAS_USER}:{MONGODB_ATLAS_PASS}@{MONGODB_ATLAS_CLUSTER_ADDRESS}/?retryWrites=true&w=majority"

        # Create a new client and connect to the server
        client = MongoClient(uri)

        # Send a ping to confirm a successful connection
        try:
            client.admin.command('ping')
            print("[MongoDB] Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
        
        return client
