from pymongo.mongo_client import MongoClient
from Data_function import data_function
import pandas as pd
from zipfile import ZipFile
import os
import csv

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
    data_file.extractall('data/morning')
    

# Path to the CSV file
speed_data_path =       'data/morning/speed.txt'
agency_data_path =      'data/morning/agency.txt'
calendar_data_path =    'data/morning/calendar.txt'
routes_data_path =      'data/morning/routes.txt'
shapes_data_path =      'data/morning/shapes.txt'
stop_times_data_path =  'data/morning/stop_times.txt'
stops_data_path =       'data/morning/stops.txt'
trips_data_path =       'data/morning/trips.txt'





read_file = pd.read_csv (r'Path where the Text file is stored\File name.txt')
read_file.to_csv (r'Path where the CSV will be saved\File name.csv', index=None)


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
