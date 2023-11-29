import json
import pandas as pd
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import math
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Import data
json_data = open('vehicle_positions_2.json')

# Parse the JSON data
data = json.load(json_data)

# Specify the route_id and trip_id
route_id = "22"

# Use list comprehension to filter data based on route_id
matching_positions = [
    {
        "latitude": entry["position"]["latitude"],
        "longitude": entry["position"]["longitude"],
        "speed": entry["position"]["speed"],
        "timestamp": entry["timestamp"]
    }
    for entry in data
    if entry["trip"]["route_id"] == route_id
]

# Convert timestamp to datetime
for entry in matching_positions:
    entry['timestamp'] = datetime.fromtimestamp(entry['timestamp'])

# Create a DataFrame from matching_positions
df = pd.DataFrame(matching_positions)

# Extract features from the timestamp column
df['hour'] = df['timestamp'].apply(lambda x: x.hour)
df['minute'] = df['timestamp'].apply(lambda x: x.minute)
df['day_of_week'] = df['timestamp'].apply(lambda x: x.weekday())

# Prepare features and target variable
features = df[['latitude', 'longitude', 'hour', 'minute', 'day_of_week']]
target = df['speed']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Initialize and train the RandomForestRegressor model
model_rf = RandomForestRegressor(n_estimators=100, random_state=42)
model_rf.fit(X_train, y_train)

# Make predictions on the test data
predictions_rf = model_rf.predict(X_test)

# Calculate root mean squared error (RMSE) to evaluate the model performance
rmse_rf = math.sqrt(mean_squared_error(y_test, predictions_rf))
print(f"Root Mean Squared Error: {rmse_rf}")

# Calculate the accuracy
def calculate_accuracy(y_true, y_pred, tolerance=1.0):
    # Calculate the absolute difference between the true and predicted values
    absolute_difference = abs(y_true - y_pred)
    
    # Calculate the percentage of predictions that fall within the tolerance range
    accuracy = sum(absolute_difference <= tolerance) / len(y_true)
    
    return accuracy

accuracy_rf = calculate_accuracy(y_test, predictions_rf)
print(f"Accuracy: {accuracy_rf}")

# Create a scatter plot with the actual test values on the x-axis and the predicted values on the y-axis
plt.scatter(y_test, predictions_rf)

# Fit a linear regression model to the data
model = LinearRegression()
model.fit(y_test.values.reshape(-1, 1), predictions_rf)

# Get the regression line
regression_line = model.predict(y_test.values.reshape(-1, 1))

# Plot the regression line
plt.plot(y_test, regression_line, color='red')

# Add labels to the axes and a title to the plot
plt.xlabel('Actual Speed')
plt.ylabel('Predicted Speed')
plt.title('Actual vs Predicted Speed')

# Display the plot
plt.show()

# Example: Predict speed for a specific future timestamp
future_timestamp = datetime.now() + timedelta(minutes = 15)  # Predict after 15 mins
future_hour = future_timestamp.hour
future_minute = future_timestamp.minute
future_day_of_week = future_timestamp.weekday()

future_features = pd.DataFrame([[41.45, -81.60, future_hour, future_minute, future_day_of_week]],
                                columns=['latitude', 'longitude', 'hour', 'minute', 'day_of_week'])

# Predict speed for the specified future timestamp
predicted_speed_rf = model_rf.predict(future_features)
print(f"Predicted speed for {future_timestamp}: {predicted_speed_rf[0]}")
