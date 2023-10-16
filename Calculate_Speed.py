from gtfs_functions import Feed, map_gdf

gtfs_path = 'data/morning/hanoi_gtfs_v2_am.zip'
feed = Feed(gtfs_path, time_windows=[0, 6, 10, 12, 16, 19, 24])

speeds = feed.avg_speeds
speeds.head(1)