from pymongo.mongo_client import MongoClient
import pandas as pd
from zipfile import ZipFile

uri = "mongodb+srv://meme:meme123456789@cluster0.crykl7e.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)



with ZipFile('data/hanoi_gtfs_v2_am.zip', 'r') as data_file:
#extract in different directory
    data_file.extractall('data')
    

# Path to the CSV file
speed_data_path =       'data/speed.csv'
agency_data_path =      'data/agency.csv'
calendar_data_path =    'data/calendar.csv'
routes_data_path =      'data/routes.csv'
shapes_data_path =      'data/shapes.csv'
stop_times_data_path =  'data/stop_times.csv'
stops_data_path =       'data/stops.csv'
trips_data_path =       'data/trips.csv'


# Connect to MongoDB Atlas
db = client.bus_network  # Access the "bus_network" database

# # ================================= IMPORT EACH COLLECTION =================================
collection = db.speeds  # Access the "speeds" collection in the "bus_network" database

# Convert the pandas DataFrame to a list of dictionaries (records)
data = pd.read_csv(speed_data_path)
speed_records = data.to_dict(orient='records')

# Insert the data into MongoDB
collection.insert_many(speed_records)


# # ================================= IMPORT EACH COLLECTION =================================
collection = db.agency  # Access the "speeds" collection in the "bus_network" database

# Convert the pandas DataFrame to a list of dictionaries (records)
data = pd.read_csv(agency_data_path)
agency_records = data.to_dict(orient='records')

# Insert the data into MongoDB
collection.insert_many(agency_records)
