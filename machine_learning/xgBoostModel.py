import json
import pandas as pd
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor, plot_tree
from sklearn.metrics import mean_squared_error
import math
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, r2_score

# Import data
json_data = open('training_data.json')

# Parse the JSON data
data = json.load(json_data)

# Use a set to store unique vehicle_id
unique_vehicle_ids = set()

for entry in data:
    unique_vehicle_ids.add(entry["vehicle"]["id"])

# print(f"Unique vehicle IDs: {unique_vehicle_ids}")

# Convert the set to a list
vehicle_ids_list = list(unique_vehicle_ids)

# Specify the route_id and trip_id
# vehicle_id = vehicle_ids_list[10]
vehicle_id = "3944"

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
df = df[df['speed'] != "0.0"]

# Extract features from the timestamp column
df['hour'] = df['timestamp'].apply(lambda x: x.hour)
df['minute'] = df['timestamp'].apply(lambda x: x.minute)
df['day_of_week'] = df['timestamp'].apply(lambda x: x.weekday())

# Prepare features and target variable
features = df[['latitude', 'longitude', 'hour', 'minute', 'day_of_week']]
target = df['speed']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Initialize and train the XGBoost model
model = XGBRegressor()
model.fit(X_train, y_train)

# Make predictions on the test data
predictions = model.predict(X_test)

# Calculate root mean squared error (RMSE) to evaluate the model performance
rmse = math.sqrt(mean_squared_error(y_test, predictions))
print(f"Root Mean Squared Error: {rmse}")

# Calculate Mean Absolute Error (MAE)
mae = mean_absolute_error(y_test, predictions)
print(f"Mean Absolute Error: {mae}")

# Calculate Mean Absolute Percentage Error (MAPE)
mape = (mae / df['speed'].mean()) * 100
print(f"Accuracy: {mape:.2f}%") # Mean Absolute Percentage Error (MAPE) in percentage

# Calculate R-squared (R²)
r2 = r2_score(y_test, predictions)
print(f"R-squared: {r2}")

# Example: Predict speed for a specific future timestamp
future_timestamp = datetime.now() + timedelta(minutes = 15)  # Predict after 15 mins
future_hour = future_timestamp.hour
future_minute = future_timestamp.minute
future_day_of_week = future_timestamp.weekday()

future_features = pd.DataFrame([[41.310557, -81.835203, future_hour, future_minute, future_day_of_week]],
                                columns=['latitude', 'longitude', 'hour', 'minute', 'day_of_week'])

# Predict speed for the specified future timestamp
predicted_speed = model.predict(future_features)
print(f"Predicted speed for {future_timestamp}: {predicted_speed[0]}")


# Convert timestamp to a format that can be plotted
df['timestamp'] = df['timestamp'].apply(lambda x: x.timestamp())

# Make predictions on the entire dataset
df['predicted_speed'] = model.predict(df[['latitude', 'longitude', 'hour', 'minute', 'day_of_week']])

# Create a scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(df['timestamp'], df['speed'], color='blue', label='Actual speed')
plt.scatter(df['timestamp'], df['predicted_speed'], color='red', label='Predicted speed')
plt.title('Actual vs Predicted Speed')
plt.xlabel('Timestamp')
plt.ylabel('Speed')
plt.legend()
plt.show()

# Plot actual vs predicted speeds
plt.figure(figsize=(10, 6))
plt.plot(y_test.values, label='Actual Speed', color='blue', marker='o')
plt.plot(predictions, label='Predicted Speed', color='orange', marker='x')
plt.title('Actual vs Predicted Speed')
plt.xlabel('Observation Index')
plt.ylabel('Speed')
plt.legend()
plt.show()