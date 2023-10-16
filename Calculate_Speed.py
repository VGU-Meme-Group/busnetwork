# Install package
# pip install gtfs_functions

# Import package
from gtfs_functions import Feed
import pandas as pd 

gtfs_path = 'data/morning/hanoi_gtfs_v2_am.zip'
feed = Feed(gtfs_path, time_windows=[0, 6, 10, 12, 16, 19, 24])
routes = feed.routes
trips = feed.trips
stops = feed.stops
stop_times = feed.stop_times
shapes = feed.shapes
stop_freq = feed.stops_freq
line_freq = feed.lines_freq
speeds = feed.avg_speeds

# print(stop_freq.head(4))
# print(speeds.head(2))

# extract the data
speeds.to_csv("speed.csv")
