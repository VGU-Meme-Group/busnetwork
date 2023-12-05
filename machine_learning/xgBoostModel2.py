import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import numpy as np
import json

# Load the data
df = pd.read_json('data/new_training_data.json')

segmentIds = [item['minDistanceResult']['segmentId'] for item in df]

print(segmentIds)

# Flatten the nested columns in 'vehicleInfo'
df_vehicle_info = pd.json_normalize(df['vehicleInfo'])

# Convert timestamp to datetime
df_vehicle_info['timeStamp'] = pd.to_datetime(df_vehicle_info['timeStamp'], unit='s')

# Extract features
df_vehicle_info['hour'] = df_vehicle_info['timeStamp'].dt.hour
df_vehicle_info['day_of_week'] = df_vehicle_info['timeStamp'].dt.dayofweek
df_vehicle_info['vehicle_id'] = df_vehicle_info['vehicle.id']
df_vehicle_info['speed'] = df_vehicle_info['position.speed']

# Add 'segmentId' from the original dataframe
df_vehicle_info['segmentId'] = df['minDistanceResult']['segmentId']

# Define features and target variable
X = df_vehicle_info[['hour', 'day_of_week', 'vehicle_id', 'segmentId']]
y = df_vehicle_info['speed']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the model
model = xgb.XGBRegressor(objective ='reg:squarederror', colsample_bytree = 0.3, learning_rate = 0.1,
                max_depth = 5, alpha = 10, n_estimators = 10)

# Train the model
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Calculate the root mean squared error
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print("RMSE: %f" % (rmse))

# To make predictions on new data
# new_data = pd.DataFrame({'hour': [10], 'day_of_week': [3], 'vehicle_id': ['2387'], 'segmentId': ['13411']})
# preds = model.predict(new_data)
