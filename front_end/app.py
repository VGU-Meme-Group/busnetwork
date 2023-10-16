# pip install Flask

from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    lat = 0
    lon = 0
    if request.method == 'POST':
        lat = request.form.get('lat')
        lon = request.form.get('lon')
    return render_template('index.html', lat=lat, lon=lon)

if __name__ == '__main__':
    app.run(debug=True)


