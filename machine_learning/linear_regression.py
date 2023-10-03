from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

def linear_regression_slope_intercept(X, y):
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=0)

    # Create a linear regression model
    model = LinearRegression()

    # Train the model using the training data
    model.fit(X_train, y_train)

    # Make predictions on the test data
    predictions = model.predict(X_test)

    # Calculate and print mean squared error
    mse = mean_squared_error(y_test, predictions)
    #print("Mean Squared Error:", mse)
    
    # Get the slope (coefficient) and intercept of the regression line
    slope = model.coef_[0][0]
    intercept = model.intercept_[0]
    
    return X_train, X_test, y_train, y_test, predictions, model, mse, slope, intercept
