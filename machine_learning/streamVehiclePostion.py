import requests
from google.transit import gtfs_realtime_pb2
import json
import time

while True:
    # URL of the GTFS-realtime .pb file
    pb_url = "https://gtfs-rt.gcrta.vontascloud.com/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb"

    # Make an HTTP request to get the .pb file
    response = requests.get(pb_url)

    if response.status_code == 200:
        # Parse the .pb file using gtfs_realtime_pb2
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)

        # List to store new vehicle position entities as dictionaries
        new_vehicle_positions_list = []

        # Iterate through the entities in the feed
        for entity in feed.entity:
            if entity.HasField("vehicle"):
                # Extract relevant information from vehicle object
                vehicle_data = {
                    "trip": {
                        "trip_id": entity.vehicle.trip.trip_id,
                        "route_id": entity.vehicle.trip.route_id,
                        "direction_id": entity.vehicle.trip.direction_id,
                        "start_date": entity.vehicle.trip.start_date
                    },
                    "vehicle": {
                        "id": entity.vehicle.vehicle.id,
                        "label": entity.vehicle.vehicle.label
                    },
                    "position": {
                        "latitude": entity.vehicle.position.latitude,
                        "longitude": entity.vehicle.position.longitude,
                        "bearing": entity.vehicle.position.bearing,
                        "speed": entity.vehicle.position.speed
                    },
                    "timestamp": entity.vehicle.timestamp
                }

                # Append the vehicle position dictionary to the new list
                new_vehicle_positions_list.append(vehicle_data)

        # Open the JSON file in append mode and add the new data
        with open("data/vehiclePositionStreaming.json", "a") as json_file:
            # Append the new vehicle position data to the existing file
            json.dump(new_vehicle_positions_list, json_file, indent=2)
            # Add a new line for readability
            json_file.write("\n")

        print("New vehicle positions appended to vehicle_positions.json")

    else:
        print(f"Failed to retrieve data. HTTP Status Code: {response.status_code}")

    # Wait for 60 seconds before making the next request
    time.sleep(30)
