# Import necessary libraries
import numpy as np
import matplotlib.pyplot as plt
import linear_regression as linearReg
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# X_values = np.array([[5], [7], [8], [7], [2], [17], [2], [9], [4], [11], [12], [9], [6]])  # Input features for 5 data points
# y_values = np.array([[99], [86], [87], [88], [111], [86], [103], [87], [94], [78], [77], [85], [86]])  # Corresponding target values for the 5 data points

# Generate some random data for testing
np.random.seed(0)
X = 2 * np.random.rand(100, 1)
y = 3 + 5 * X + np.random.randn(100, 1)

X_train, X_test, y_train, y_test, predictions, model, mse, slope, intercept = linearReg.linear_regression_slope_intercept(X, y)

# Plot the training data, test data, and the regression line
plt.scatter(X_train, y_train, color='blue', label='Training Data')
plt.scatter(X_test, y_test, color='green', label='Test Data')
plt.plot(X_test, predictions, color='red', linewidth=2, label='Regression Line')
plt.xlabel('X')
plt.ylabel('y')
plt.legend()
plt.title('Linear Regression Example')
plt.show()
print(slope)
print(type(X_train))