from Data_function import Data_function as data_handle
from DB_connect import MongoDB_Atlas_Connection as db_connect
from dotenv import load_dotenv
import os

data_handle.delete_files_by_extension('data/morning/', 'csv')
data_handle.delete_files_by_extension('data/morning/', 'txt')

data_handle.unzip('data/morning/hanoi_gtfs_v2_am.zip', 'data/morning/')
data_handle.rename_files_by_extension('data/morning/', 'data/morning/', 'txt', 'csv')
data_handle.calculate_avg_speed('data/morning/hanoi_gtfs_v2_am.zip', 'data/morning/', 'speeds.csv')


client = db_connect.establish_connection()

load_dotenv()
MONGODB_DATABASE_NAME = os.getenv('MONGODB_DATABASE_NAME')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'agency', 'data/morning/agency.csv')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'calendar', 'data/morning/stops.csv')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'routes', 'data/morning/routes.csv')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'shapes', 'data/morning/shapes.csv')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'speeds', 'data/morning/speeds.csv')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'stop_times', 'data/morning/stop_times.csv')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'stops', 'data/morning/stops.csv')
data_handle.import_collection(client, MONGODB_DATABASE_NAME, 'trips', 'data/morning/trips.csv')

