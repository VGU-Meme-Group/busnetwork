# In your terminal run
# pip install gtfs_functions

# Import package
from gtfs_functions import Feed
import pandas as pd 
from pymongo import MongoClient

gtfs_path = 'data/miami_gtfs.zip'
feed = Feed(gtfs_path, time_windows=[0, 6, 10, 12, 16, 19, 24])
routes = feed.routes
trips = feed.trips
stops = feed.stops
stop_times = feed.stop_times
shapes = feed.shapes
stop_freq = feed.stops_freq
line_freq = feed.lines_freq
speeds = feed.avg_speeds

# print(stop_freq.head(4))
# print(speeds.head(2))

# extract the data
speeds.to_csv("speed.csv")
SPEEDS_CSV_FILE_PATH = "speed.csv"

# MongoDB connection settings
MONGO_HOST = 'localhost'
MONGO_PORT = 27017
DB_NAME = 'bus_network'
COLLECTION_NAME = 'speeds'

# Read the CSV file using pandas
data = pd.read_csv(SPEEDS_CSV_FILE_PATH)

# Establish a connection to MongoDB
client = MongoClient(MONGO_HOST, MONGO_PORT)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Convert the pandas DataFrame to a list of dictionaries (records)
records = data.to_dict(orient='records')

# Insert the data into MongoDB
collection.insert_many(records)

# Print success message
print(f'Data from {SPEEDS_CSV_FILE_PATH} imported to MongoDB collection {COLLECTION_NAME} successfully.')
