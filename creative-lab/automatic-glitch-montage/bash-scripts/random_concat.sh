#!/bin/bash

# Create a temporary directory for the re-encoded MJPEG files
mkdir -p reencoded_scenes

# Re-encode each scene file to MJPEG format with audio preserved and metadata removed
count=1
for file in scene_*.mp4; do
    ffmpeg -i "$file" \
           -c:v mjpeg -q:v 2 -pix_fmt yuvj420p -an \
           -c:a aac -b:a 128k -map 0:a -map 0:v \
           -fflags +genpts \
           -r 24 \
           -metadata:s:v:0 handler=" " \
           -metadata:s:a:0 handler=" " \
           -metadata:s:v:0 vendor_id=" " \
           -y "reencoded_scenes/scene_${count}.mp4"
    count=$((count + 1))
done

# Randomly order files and create a list file for ffmpeg concat demuxer
ls reencoded_scenes/scene_*.mp4 | shuf | sed "s/^/file '/; s/$/'/" > reencoded_scene_list.txt

# Concatenate the re-encoded MJPEG files
ffmpeg -f concat -safe 0 -i reencoded_scene_list.txt -c copy random-timeline.mp4

# Clean up the temporary directory and list file
rm -rf reencoded_scenes
rm -f reencoded_scene_list.txt

echo "Randomly concatenated video saved as random-timeline.mp4"
