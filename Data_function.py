import os
import csv
import pandas as pd
from zipfile import ZipFile
from gtfs_functions import Feed

class Data_function:
    
    def __init__(self) -> None:
        pass
    

    def unzip(zip_file_path, dest_path):
        """Extract a .zip file to a destination folder

        Args:
            zip_file_path (str): The path of the .zip file
            dest_path (str): The destination folder path
        """
        try:
            with ZipFile(zip_file_path, 'r') as data_file:
                #extract in different directory
                data_file.extractall(dest_path)
            print(f"Unzip {zip_file_path} successfully" )
        except Exception as e:
            print(f"An error occurred: {e}")
        
    
    
    def rename_files_by_extension(source_path, dest_path, initial_ext, new_ext):
        try:
            # List all files in the source directory
            files = os.listdir(source_path)
            
            # Iterate through the files and rename files with the specified initial extension
            for file in files:
                if file.endswith(initial_ext):
                    # Construct the source and destination file paths
                    source_file_path = os.path.join(source_path, file)
                    new_file_name = os.path.splitext(file)[0] + '.' + new_ext
                    dest_file_path = os.path.join(dest_path, new_file_name)
                    
                    # Rename and move the file to the destination directory
                    os.rename(source_file_path, dest_file_path)
                    print(f"Renamed: {source_file_path} -> {dest_file_path}")
            
            print(f"All '{initial_ext}' files in '{source_path}' have been renamed to '{new_ext}' and moved to '{dest_path}'.")
            
        except Exception as e:
            print(f"An error occurred: {e}")
    
    
    def delete_files_by_extension(source_path, extension_name):
        try:
            # List all files in the source directory
            files = os.listdir(source_path)
            
            # Iterate through the files and delete files with the specified extension
            for file in files:
                if file.endswith(extension_name):
                    file_path = os.path.join(source_path, file)
                    os.remove(file_path)
                    print(f"Deleted: {file_path}")
            
            print(f"All {extension_name} files in '{source_path}' have been deleted.")
            
        except Exception as e:
            print(f"An error occurred: {e}")

    
    def calculate_avg_speed(gtfs_path, dest_folder_path, dest_file_name):
        try: 
            feed = Feed(gtfs_path, time_windows=[0, 6, 10, 12, 16, 19, 24])
            # routes = feed.routes
            # trips = feed.trips
            # stops = feed.stops
            # stop_times = feed.stop_times
            # shapes = feed.shapes
            # stop_freq = feed.stops_freq
            # line_freq = feed.lines_freq
            speeds = feed.avg_speeds

            # Create the destination folder if it doesn't exist
            if not os.path.exists(dest_folder_path):
                os.makedirs(dest_folder_path)
            
            # Create the destination file path
            dest_file_path = os.path.join(dest_folder_path, dest_file_name)
            
            # Export the DataFrame to CSV
            speeds.to_csv(dest_file_path, index=False)
            
            print(f"DataFrame exported to '{dest_file_path}'.")
        
        except Exception as e:
            print(f"An error occurred: {e}")
            
    
    
    def import_collection(client, database_name, collection_name, collection_data_path):
        try:
            # Access the specified database
            db = client[database_name]

            # Access or create the specified collection
            collection = db[collection_name]
            
            data = pd.read_csv(collection_data_path)
            collection_records = data.to_dict(orient='records')

            # Insert the collection data into the specified collection
            result = collection.insert_many(collection_records)

            # Print the result to indicate the number of documents inserted
            print(f"[MongoDB] Imported {len(result.inserted_ids)} documents into '{collection_name}' collection in '{database_name}' database.")

        except Exception as e:
            print(f"An error occurred: {e}")