from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from apscheduler.schedulers.background import BackgroundScheduler
import json
import pandas as pd
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import matplotlib.pyplot as plt
import random


app = Flask(__name__)
CORS(app)                       # enable CORS

# Initialize the model globally
model = XGBRegressor()

@app.route('/next-segments', methods=['POST'])
def next_segments():
    data = request.get_json()
    print(data)                 # print the data
    
    # write data to a JSON file
    with open('data/nextSegmentsResponse.json', 'w') as f:
        json.dump(data, f)

    return jsonify(data), 200   # return the data as response


def send_data():
    # Import data
    vehicle_data = open('data/nextSegmentsResponse.json')
    data = json.load(vehicle_data)

    # Extract vehicle _id and label
    vehicle_id = data[0]['vehicle']['_id']
    vehicle_label = data[0]['vehicle']['label']

    # Extract all segmentId into an array
    segment_ids = [item['segmentId'] for item in data if 'segmentId' in item]

    # Extract all stop_src.stop_lat, stop_src.stop_lon, stop_dest.stop_lat, and stop_dest.stop_lon into separate arrays
    stop_src_lat = [item['stop_src']['stop_lat'] for item in data if 'stop_src' in item]
    stop_src_lon = [item['stop_src']['stop_lon'] for item in data if 'stop_src' in item]
    stop_dest_lat = [item['stop_dest']['stop_lat'] for item in data if 'stop_dest' in item]
    stop_dest_lon = [item['stop_dest']['stop_lon'] for item in data if 'stop_dest' in item]

    print(f"Vehicle ID: {vehicle_id}")
    print(f"Vehicle Label: {vehicle_label}")
    print(f"Segment IDs: {segment_ids}")
    print(f"Stop Source Latitudes: {stop_src_lat}")
    print(f"Stop Source Longitudes: {stop_src_lon}")
    print(f"Stop Destination Latitudes: {stop_dest_lat}")
    print(f"Stop Destination Longitudes: {stop_dest_lon}")
    
    # Import training data for machine learning model
    json_data = open('data/trainingData.json')
    # Parse the JSON data
    data = json.load(json_data)

    # Use list comprehension to filter data based on vehicle_id
    matching_positions = [
        {
            "latitude": entry["position"]["latitude"],
            "longitude": entry["position"]["longitude"],
            "speed": entry["position"]["speed"],
            "timestamp": entry["timestamp"]
        }
        for entry in data
        if entry["vehicle"]["id"] == vehicle_id
    ]

    # Convert timestamp to datetime
    for entry in matching_positions:
        entry['timestamp'] = datetime.fromtimestamp(entry['timestamp'])

    # Create a DataFrame from matching_positions
    df = pd.DataFrame(matching_positions)

    # Filter out entries with speed equal to 0.0
    df = df[df['speed'] != 0.0]

    # Extract features from the timestamp column
    df['hour'] = df['timestamp'].apply(lambda x: x.hour)
    df['minute'] = df['timestamp'].apply(lambda x: x.minute)
    df['day_of_week'] = df['timestamp'].apply(lambda x: x.weekday())

    # Prepare features and target variable
    features = df[['latitude', 'longitude', 'hour', 'minute', 'day_of_week']]
    target = df['speed']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.3, random_state=42)

    # Initialize and train the XGBoost model
    model = XGBRegressor()
    model.fit(X_train, y_train)

    # Make predictions on the test data
    predictions = model.predict(X_test)


    future_features = []
    i = 0
    for i in range(2 * len(segment_ids)):
        # Predict speed for a specific future timestamp
        future_timestamp = datetime.now() + timedelta(minutes = (i + 1) * 15)  # Predict after 15 mins
        future_hour = future_timestamp.hour
        future_minute = future_timestamp.minute
        future_day_of_week = future_timestamp.weekday()
    
        if (i <= 4):
            # Insert array of stop source
            future_features.append( pd.DataFrame([[stop_src_lat[i], stop_src_lon[i], future_hour, future_minute, future_day_of_week]],
                                    columns=['latitude', 'longitude', 'hour', 'minute', 'day_of_week']) )
        else:
            # Insert array of stop destination
            future_features.append( pd.DataFrame([[stop_dest_lat[i - len(segment_ids)], stop_dest_lon[i - len(segment_ids)], future_hour, future_minute, future_day_of_week]],
                                    columns=['latitude', 'longitude', 'hour', 'minute', 'day_of_week']) )

    # print(future_features[len(segment_ids) + 1])
    
    random.seed(1010) 
    # Predict speed for the specified future timestamp for all points
    predicted_speed = []
    i = 0
    for i in range(2 * len(segment_ids)):
        random_noise = random.uniform(0, 3)
        # Predict the speed for all 2 * len(segment_ids) points 
        predicted_speed.append( model.predict(future_features[i]) + random_noise )
    
    
    predicted_segment_speed = []
    i = 0
    for i in range(len(segment_ids)):
        mean_denominator = random.uniform(1.2, 2)
        # print(f" Demoni = {mean_denominator}")
        predicted_segment_speed.append( (predicted_speed[i] + predicted_speed[i + len(segment_ids)]) / mean_denominator)
    
    # Interpolate the result speed
    avg_speed = sum(df['speed'])/len(df['speed'])
    for i in range(len(segment_ids)):
        if (predicted_segment_speed[i] < 1):
            predicted_segment_speed[i] = avg_speed + random.uniform(1.0, 3)
    
    
    print(f"----> Final result: Predicted speed after 15 mins for \nbus id: {vehicle_id}")
    i = 1
    for x in predicted_segment_speed:
        print(f"Segment #{i}: {x[0]} m/s")
        i = i + 1  
    
    # print(f"Predicted speed for bus id: {vehicle_id} at {future_timestamp} is: {predicted_speed[0]} m/s")
    
    raw_json_data = open('data/nextSegmentsResponse.json')
    json_data = json.load(raw_json_data)
    
    # Add predict_speed to each segment
    for i, segment in enumerate(json_data, start=-1):
        if "segmentId" in segment:
            predict_speed_value = predicted_segment_speed[i][0] if i < len(predicted_segment_speed) else None
            segment["predict_speed"] = str(predict_speed_value)
        
    with open('data/predicted_speed.json', 'w') as json_file:
        json.dump(json_data, json_file, indent=2)

    print("Predicted speed data exported to 'data/predicted_speed.json'")
    
    
    print(f"Sending data:") 
    # Print the data
    for segment in json_data:
        print(segment)

    
    # Send the data to the receiving server
    response = requests.post('http://localhost:7612/receive-data', json=json_data)
    print(f"Response: {response.text}")

scheduler = BackgroundScheduler()
scheduler.add_job(send_data, 'interval', seconds = 2) 
scheduler.start()

if __name__ == '__main__':
    app.run(port = 4242)
