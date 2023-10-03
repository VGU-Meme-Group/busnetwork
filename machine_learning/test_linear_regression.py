import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from linear_regression import linear_regression_slope_intercept  # Import your function


def test_linear_regression_slope_intercept_1():
    """-  Validate the basic functionality of the function

    Args:
        X (_np.ndarray_): _description_
        y (_np.ndarray_): _description_
    """
    
    # Generate some random data for testing
    np.random.seed(0)
    X = 2 * np.random.rand(100, 1)
    y = 3 + 4 * X + np.random.randn(100, 1)
    
    # Call the function to get return values
    X_train, X_test, y_train, y_test, predictions, model, mse, slope, intercept = linear_regression_slope_intercept(X, y)

    # Test that the returned values are not None
    assert X_train is not None
    assert X_test is not None
    assert y_train is not None
    assert y_test is not None
    assert predictions is not None
    assert model is not None

    # Test the type of the returned values
    assert isinstance(X_train, np.ndarray)
    assert isinstance(X_test, np.ndarray)
    assert isinstance(y_train, np.ndarray)
    assert isinstance(y_test, np.ndarray)
    assert isinstance(predictions, np.ndarray)
    assert isinstance(model, LinearRegression)

    # Test the length of the returned lists
    assert len(X_train) > 0
    assert len(X_test) > 0
    assert len(y_train) > 0
    assert len(y_test) > 0
    assert len(predictions) > 0

    # Test the type of the slope and intercept
    assert isinstance(slope, float)
    assert isinstance(intercept, float)

    # Test the mean squared error
    assert isinstance(mse, float)
    assert mse >= 0  # Mean Squared Error should be non-negative


def test_linear_regression_slope_intercept_2():
    """-  Validate the basic functionality of the function case#2

    Args:
        X (_np.ndarray_): _description_
        y (_np.ndarray_): _description_
    """
    
    # Generate some random data for testing
    np.random.seed(0)
    X = 19 * np.random.rand(131, 1)
    y = -62 - 85 * X + np.random.randn(131, 1)
    
    # Call the function to get return values
    X_train, X_test, y_train, y_test, predictions, model, mse, slope, intercept = linear_regression_slope_intercept(X, y)

    # Test that the returned values are not None
    assert X_train is not None
    assert X_test is not None
    assert y_train is not None
    assert y_test is not None
    assert predictions is not None
    assert model is not None

    # Test the type of the returned values
    assert isinstance(X_train, np.ndarray)
    assert isinstance(X_test, np.ndarray)
    assert isinstance(y_train, np.ndarray)
    assert isinstance(y_test, np.ndarray)
    assert isinstance(predictions, np.ndarray)
    assert isinstance(model, LinearRegression)

    # Test the length of the returned lists
    assert len(X_train) > 0
    assert len(X_test) > 0
    assert len(y_train) > 0
    assert len(y_test) > 0
    assert len(predictions) > 0

    # Test the type of the slope and intercept
    assert isinstance(slope, float)
    assert isinstance(intercept, float)

    # Test the mean squared error
    assert isinstance(mse, float)
    assert mse >= 0  # Mean Squared Error should be non-negative


def test_linear_regression_slope_intercept_zero_mse():
    # Test with intentionally generated data where MSE should be 0
    X = np.array([[1], [2], [3], [4], [5]])
    y = np.array([[1], [2], [3], [4], [5]])

    X_train, X_test, y_train, y_test, predictions, model, mse, slope, intercept = linear_regression_slope_intercept(X, y)

    assert mse == 0


def test_linear_regression_slope_intercept_negative_mse():
    # Test with intentionally generated data where MSE should be non-negative
    
    # Generate random X values
    X = np.random.rand(100, 1)
    # Set y values to all zeros
    y = np.zeros((100, 1))

    X_train, X_test, y_train, y_test, predictions, model, mse, slope, intercept = linear_regression_slope_intercept(X, y)

    assert mse >= 0