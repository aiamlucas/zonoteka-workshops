# Creative Lab: Automatic Glitch Montage

**Project Overview:**

In this creative lab, we will explore how to deconstruct and reconstruct a video automatically using **FFmpeg** and bash scripting.

> The scripts used in this project will be stored in a folder called `bash-scripts`.

**Steps:**

- **Using FFmpeg to Identify and Extract Cuts**: Detect and mark scene cuts in the video to split it into individual segments automatically.
- **Export Each Cut as a Separate Video File**: Save each detected scene as its own video file.
- **Concatenate the Scenes with Bash Scripting**: Use a bash script to reorder these segments in sorted sequences, creating a new montage.
- **Glitching**: Glitching specific scenes of the video.

---

### Step 1: Download the Trailer

Start by downloading the trailer using **yt-dlp**.

#### Install `yt-dlp`

For Linux and macOS users, you can install `yt-dlp` with the following commands:

1. **Linux/macOS Installation**:

   ```
   sudo apt update
   sudo apt install yt-dlp
   ```

2. **Install via Homebrew (macOS)**:

   If you have Homebrew installed, you can install `yt-dlp` by running:

   ```
   brew install yt-dlp
   ```

#### Download the Trailer

Once installed, use the following command to download the video in the highest available quality:

```
yt-dlp -f 'best' -o "trailer.mp4" https://youtu.be/YourVideoID
```

- **`-f 'best'`**: Downloads the highest quality available for the video.
- **`-o "trailer.mp4"`**: Specifies the output filename as `trailer.mp4`.

This will download the trailer as `trailer.mp4`, which you’ll use in the next steps for scene detection and reassembly.

### Step 2: Run the Script `split_scenes.sh` to Detect and Extract Scenes

The script (`split_scenes.sh`) is designed to automatically detect scene changes in a video, save the timestamps for each scene cut, and then extract each scene as a separate video file. Here’s how the script works in two main sections:

1. **Detect Scene Change Timestamps**: Identifies scene changes based on pixel differences and logs the timestamps.
2. **Extract Each Scene Using Timestamps**: Uses these timestamps to cut the video into individual scenes and saves each one as a separate video file.

### Full Command Breakdown

```
ffmpeg -i "$input_file" -vf "select='gt(scene,0.1)',showinfo" -vsync vfr -f null - 2>&1 | \
grep "pts_time:" | sed -E "s/.*pts_time:([0-9]+\.[0-9]+)/\1/" | \
awk '{ secs=$1; hrs=int(secs/3600); mins=int((secs%3600)/60); secs=secs%60; printf("%02d:%02d:%06.3f\n", hrs, mins, secs) }' > scenes_converted.txt
```

This command pipeline generates a list of scene cut timestamps in `hh:mm:ss.ms` format and saves them in `scenes_converted.txt`. Below is a detailed explanation of each part.

#### 1. **Scene Detection and Frame Processing (FFmpeg)**

```
ffmpeg -i "$input_file" -vf "select='gt(scene,0.1)',showinfo" -vsync vfr -f null -
```

- **`-i "$input_file"`**: Specifies the input file (e.g., `trailer.mp4`) to analyze for scene cuts.
- **`-vf "select='gt(scene,0.1)',showinfo"`**: Applies two filters:
  - **`select='gt(scene,0.1)'`**: The `select` filter uses FFmpeg's `scene` detection feature with a threshold of `0.1` (10%), marking frames where 10% or more of the pixels change significantly as scene cuts.
  - **`showinfo`**: Adds extra logging data for each frame, including timestamp information that is used for identifying scene changes.
- **`-vsync vfr`**: Ensures a variable frame rate, producing output only for frames that meet the scene change criteria.
- **`-f null -`**: Specifies the output format as `null`, meaning FFmpeg will process frames but not save them to a video file. The purpose is logging data only.

- **`2>&1`**: Redirects standard error (stderr) to standard output (stdout) so `grep` can read all output in a single stream.

#### 2. **Extracting and Formatting Timestamps**

```
grep "pts_time:" | sed -E "s/.*pts_time:([0-9]+\.[0-9]+)/\1/" | \
awk '{ secs=$1; hrs=int(secs/3600); mins=int((secs%3600)/60); secs=secs%60; printf("%02d:%02d:%06.3f\n", hrs, mins, secs) }' > scenes_converted.txt
```

- **`grep "pts_time:"`**: Filters the output for lines containing `pts_time:`, which indicates frame timestamps in FFmpeg's log.

- **`sed -E "s/.*pts_time:([0-9]+\.[0-9]+)/\1/"`**: Uses `sed` to clean up the output, keeping only the numerical timestamp and removing extra text.
- **`awk '{ secs=$1; hrs=int(secs/3600); mins=int((secs%3600)/60); secs=secs%60; printf("%02d:%02d:%06.3f\n", hrs, mins, secs) }'`**: Converts each timestamp into a more readable format, `hh:mm:ss.ms`, and saves them in `scenes_converted.txt`.

---

### Extracting Each Scene Using the Timestamps

The second part of the script reads each timestamp from `scenes_converted.txt`, extracting segments between each consecutive pair of timestamps and creating separate video files for each.

#### Commands for Extracting Scenes

```
ffmpeg -i "$input_file" -ss "$start_time" -to "$end_time" -c copy "$output_file"
```

Explanation of key options here:

- **`-ss "$start_time"`**: Specifies the start time for the segment, initialized as the previous scene's end time.
- **`-to "$end_time"`**: Specifies the end time for the segment, which is the next detected scene change.
- **`-c copy`**: Copies video and audio streams without re-encoding, preserving the original quality in the output.

This loop continues for each timestamp, creating segments such as `scene_1.mp4`, `scene_2.mp4`, etc.

#### Handling the Last Segment

Once all timestamps have been processed, the script handles the last segment:

```
ffmpeg -i "$input_file" -ss "$start_time" -c copy "$output_file"
```

This command extracts from the last recorded timestamp to the end of the video, ensuring no scenes are missed.

---

### Summary

1. **Scene Detection**: FFmpeg analyzes the input video, detects scene changes, and logs timestamps.
2. **Timestamp Formatting**: `grep`, `sed`, and `awk` clean and format these timestamps into `hh:mm:ss.ms`.
3. **Scene Extraction**: The script reads each timestamp, cutting segments for each scene and saving them as separate video files.

---

### Step 3: Run `random_concat.sh` to Reassemble Scenes in Random Order

With each scene segment created, you can now use the `random_concat.sh` script to reassemble them in a random order. The key FFmpeg commands used within this script include:

1. **Re-encoding to MJPEG**:

   ```
   ffmpeg -i "$file" \
          -c:v mjpeg -q:v 2 -pix_fmt yuvj420p -an \
          -c:a aac -b:a 128k -map 0:a -map 0:v \
          -fflags +genpts \
          -r 24 \
          -metadata:s:v:0 handler=" " \
          -metadata:s:a:0 handler=" " \
          -metadata:s:v:0 vendor_id=" " \
          -y "reencoded_scenes/scene_${count}.mp4"
   ```

   - **`-c:v mjpeg`**: Specifies MJPEG as the output video codec, a format compatible with concatenation.
   - **`-q:v 2`**: Sets high video quality; lower values indicate better quality.
   - **`-pix_fmt yuvj420p`**: Sets pixel format to a widely compatible format for MJPEG.
   - **`-map 0:a -map 0:v`**: Ensures all audio and video streams from the input are included.
   - **`-fflags +genpts`**: Generates PTS timestamps to avoid sync issues in concatenation.
   - **`-metadata`**: Removes handler and vendor metadata, preventing playback conflicts.

2. **Randomizing and Concatenating**:

   ```
   ffmpeg -f concat -safe 0 -i reencoded_scene_list.txt -c copy random-timeline.mp4
   ```

   - **`-f concat -safe 0`**: Uses FFmpeg’s concat demuxer to safely concatenate multiple files.
   - **`-c copy`**: Copies streams without re-encoding, preserving quality in the final output.

---
