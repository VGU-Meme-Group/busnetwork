# Server 2: Receiving server
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/receive-data', methods=['POST'])
def receive_data():
    data = request.get_json()   # get the data from the request
    print(f"Received data: {data}")  # print the data

    return jsonify({'message': 'Data received successfully!'}), 200

if __name__ == '__main__':
    app.run(port=7612)
