import json
import folium

# read the json file
sample = open("./machine_learning/data/stops_lite.json", encoding='utf-8')
# parse/convert the list of JSON objects into Python list of dictionaries
bus_route = json.load(sample)


# create a map object with the center point
m = folium.Map(location=[10, 106], zoom_start=5)

# iterate through each JSON object in the list
for bus_location in bus_route:
    # get the coordinates of bus location (in REVERSE ORDER in the data file)
    location = bus_location['stop_lat'], bus_location['stop_lon']
    # create and add a Marker of each bus_location to the map
    folium.Marker(location=location,
                  popup=f'Vehicle Number: {bus_location["stop_name"]}\nLocation: {location}', icon=folium.Icon(color='red', icon='bus', prefix='fa')).add_to(m)

# save the map object into an HTML file
m.save('bus_stops.html')
