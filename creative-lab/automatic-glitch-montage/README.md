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

### 2. Identify the Cuts in the Video

Using FFmpeg, detect the scene cuts automatically by analyzing pixel differences between frames. The following command generates a list of timestamps for each detected cut and outputs them in `scenes_converted.txt`:

```
ffmpeg -i trailer.mp4 -vf "select='gt(scene,0.1)',showinfo" -vsync vfr -f null - 2>&1 | \
grep "pts_time:" | sed -E "s/.\*pts_time:([0-9]+\.[0-9]+)/\1/" | \
awk '{ secs=$1; hrs=int(secs/3600); mins=int((secs%3600)/60); secs=secs%60; printf("%02d:%02d:%06.3f\n", hrs, mins, secs) }' > scenes_converted.txt
```

### Explanation of Each Step of the Command:

1. **Scene Detection and Frame Processing (FFmpeg)**

   The first part of the command runs **FFmpeg** to analyze the video for scene changes and outputs frame information:

   ```
   ffmpeg -i trailer.mp4 -vf "select='gt(scene,0.1)',showinfo" -vsync vfr -f null -
   ```

   - **`-i trailer.mp4`**: Specifies `trailer.mp4` as the input file.
   - **`-vf "select='gt(scene,0.1)',showinfo"`**:
     - **`select='gt(scene,0.1)'`**: FFmpeg’s **select** filter uses the `scene` detection feature to analyze differences between frames. Here, `scene` is set to 0.1 (or 10%)—a threshold that triggers FFmpeg to log a “scene change” whenever 10% or more of the pixels differ significantly from the previous frame.
     - **`showinfo`**: This filter provides additional frame-level information, including timestamp details, which FFmpeg logs to the console.
   - **`-vsync vfr`**: Ensures the output frame rate is variable, meaning FFmpeg only outputs frames that meet the scene change criteria.
   - **`-f null -`**: Sets the output format to `null`, meaning FFmpeg does not create an output video but logs frame information for further processing.
   - **`2>&1`**: Redirects standard error (stderr) to standard output (stdout), allowing the `grep` command to read all logged information.

2. **Filtering Timestamps (grep and sed)**

   The next segment isolates timestamps for each detected cut:

   ```
   grep "pts_time:" | sed -E "s/.*pts_time:([0-9]+\.[0-9]+)/\1/"
   ```

   - **`grep "pts_time:"`**: Searches through FFmpeg’s output to find lines containing `pts_time:`, which represent the timestamps of frames where scene changes were detected.
   - **`sed -E "s/.*pts_time:([0-9]+\.[0-9]+)/\1/"`**: This uses `sed` (stream editor) to extract the numerical part of each timestamp. It matches `pts_time:` followed by one or more digits, capturing only the timestamp (e.g., `123.456` seconds) by removing everything else.

3. **Formatting the Timestamps (awk)**

   Finally, the `awk` command converts timestamps from seconds into `hh:mm:ss.ms` format and saves the output in `scenes_converted.txt`:

   ```
   awk '{ secs=$1; hrs=int(secs/3600); mins=int((secs%3600)/60); secs=secs%60; printf("%02d:%02d:%06.3f\n", hrs, mins, secs) }' > scenes_converted.txt
   ```

   - **`secs=$1`**: Stores the raw seconds value from `grep` and `sed`.
   - **`hrs=int(secs/3600)`**: Converts total seconds into hours by dividing by 3600.
   - **`mins=int((secs%3600)/60)`**: Calculates remaining minutes.
   - **`secs=secs%60`**: Converts the remaining seconds.
   - **`printf("%02d:%02d:%06.3f\n", hrs, mins, secs)`**: Prints each timestamp in `hh:mm:ss.ms` format, ensuring that hours, minutes, and seconds are formatted as two-digit values, with milliseconds as three decimal places.
   - **`> scenes_converted.txt`**: Directs the formatted timestamps into a file named `scenes_converted.txt`.

---

### Step 3: Run the Scene Splitting Script

Now that you have your cuts stored in `scenes_converted.txt`, you’re ready to use the `split_scenes.sh` script to segment the video based on those timestamps. This script will generate separate video files for each cut, naming them sequentially (`scene_1.mp4`, `scene_2.mp4`, etc.).

#### How `split_scenes.sh` Works

1. The script starts by prompting you to enter the name of the video file you want to split.
2. It reads each timestamp from `scenes_converted.txt` and uses these timestamps as cut points.
3. **FFmpeg** extracts each scene segment, using the timestamp as the end point for the current scene and the start point for the next.
4. Finally, it handles the last segment, cutting from the last timestamp to the end of the video.

#### Running `split_scenes.sh`

1. Make the script executable (necessary for both Linux and macOS users):

   ```
   chmod +x bash-scripts/split_scenes.sh
   ```

2. Run the script:

   ```
   ./bash-scripts/split_scenes.sh
   ```

3. Enter the video filename (e.g., `trailer.mp4`) when prompted.

This will generate separate scene files named `scene_1.mp4`, `scene_2.mp4`, etc., in the current directory.

### Step 4: Run the Random Concatenation Script

With each scene segment created, you can now use the `random_concat.sh` script to reassemble them into a new video, arranged in a random order. This script will re-encode each scene into an MJPEG format to maintain compatibility and avoid metadata conflicts, then concatenate them to create a new montage.

#### How `random_concat.sh` Works

1. The script re-encodes each `scene_*.mp4` file to MJPEG format with audio preserved, removes potentially conflicting metadata, and saves them in a temporary `reencoded_scenes` directory.
2. It randomly shuffles the re-encoded scene files and generates a list file (`reencoded_scene_list.txt`) for FFmpeg’s concat filter.
3. FFmpeg then concatenates the scenes into a single video file, `random-timeline.mp4`.
4. The script cleans up by deleting temporary files and folders.

#### Running `random_concat.sh`

1. Make the script executable:

   ```
   chmod +x bash-scripts/random_concat.sh
   ```

2. Run the script:

   ```
   ./bash-scripts/random_concat.sh
   ```

The output will be saved as `random-timeline.mp4`

---
