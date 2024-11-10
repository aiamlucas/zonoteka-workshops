#!/bin/bash

# Prompt for the input file name
read -p "Enter the input video file name (with extension): " input_file

count=1
start_time="00:00:00.000"  # Initial start time in timestamp format

# Detect scene change timestamps in hh:mm:ss.ms format and save them to scenes_converted.txt
ffmpeg -i "$input_file" -vf "select='gt(scene,0.1)',showinfo" -vsync vfr -f null - 2>&1 | \
grep "pts_time:" | sed -E "s/.*pts_time:([0-9]+\.[0-9]+)/\1/" | \
awk '{ secs=$1; hrs=int(secs/3600); mins=int((secs%3600)/60); secs=secs%60; printf("%02d:%02d:%06.3f\n", hrs, mins, secs) }' > scenes_converted.txt

# Read each timestamp from scenes_converted.txt and cut the scenes
while read -r end_time; do
    output_file="scene_${count}.mp4"
    
    # Extract the segment from start_time to end_time
    ffmpeg -i "$input_file" -ss "$start_time" -to "$end_time" -c copy "$output_file"
    
    # Update start_time to the current end_time for the next iteration
    start_time="$end_time"
    count=$((count + 1))
done < scenes_converted.txt

# Handle the last segment from the last timestamp to the end of the video
output_file="scene_${count}.mp4"
ffmpeg -i "$input_file" -ss "$start_time" -c copy "$output_file"
