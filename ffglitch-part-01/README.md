## 1. FFmpeg

> "A complete, cross-platform solution to record, convert and stream audio and video."  
> — [FFmpeg](https://ffmpeg.org/)

> "FFmpeg is the leading multimedia framework, able to decode, encode, transcode, mux, demux, stream, filter and play pretty much anything that humans and machines have created. It supports the most obscure ancient formats up to the cutting edge. No matter if they were designed by some standards committee, the community or a corporation."  
> — [FFmpeg About](https://ffmpeg.org/about.html)

FFmpeg is a free and open-source software.

## 2. What Can FFmpeg Do?

FFmpeg is a versatile tool that can perform a variety of multimedia tasks:

- **Decoding**: Read and interpret video/audio formats from any media file.
- **Encoding**: Convert raw or processed media into different formats.
- **Transcoding**: Convert one media format into another, changing codecs or file types.
- **Muxing**: Combine multiple streams (audio, video, subtitles) into one file.
- **Demuxing**: Split streams from a multimedia container (e.g., extract audio from a video file).
- **Streaming**: Serve multimedia over a network or internet in real-time.
- **Filtering**: Apply effects, manipulate frames, add overlays, and much more during media processing.
- **Playback**: FFmpeg can also play various multimedia formats directly.

---

## Basic FFmpeg Commands (Examples)

### 1. Convert a File from One Format to Another

```
ffmpeg -i input.jpg output.png
```

- **`-i input.jpg`**: Input file.
- **`output.png`**: Output file.

### 4. Video Conversion to MPEG-4

```
ffmpeg -i input.mov -c:v mpeg4 -q:v 1 output.avi
```

- **`input.mov`**: Specifies the input file (input.mov), which uses the MOV container format.
- **`-c:v mpeg4`**: Specifies the video codec as MPEG-4.
- **`-q:v 1`**: Sets the video quality (lower value means better quality, 1 is best, 31 is worst).
- **`output.avi`**: Specifies the output file (output.mp4), which uses the AVI container format.

### 2. Extract Audio from a Video

```
ffmpeg -i input.avi -vn -acodec libmp3lame output.mp3
```

- **`-i video.mp4`**: Input file.
- **`-vn`**: Stands for "video none," meaning the video stream will be omitted in the output (only audio will be processed).
- **`-acodec libmp3lame`**: Specifies the MP3 codec (LAME) for encoding the audio into MP3 format.
- **`audio.mp3`**: Output file.

### 3. Cut a Portion of a Video (from 30 seconds to 90 seconds)

```
ffmpeg -i input.avi -ss 00:00:30 -to 00:01:30 -c copy output_short.mp4
```

- **`-i input.avi`**: Input file.
- **`-ss 00:00:30`**: Specifies the start time for the cut (30 seconds in this case).
- **`-to 00:01:30`**: Specifies the end time for the cut (1 minute and 30 seconds in this case).
- **`-c copy`**: Copies both the video and audio streams without re-encoding, preserving the original quality.
- **`output.mp4`**: Output file.

---

## Useful Commands to Explore FFmpeg Capabilities

### 1. See Supported Codecs

```
ffmpeg -codecs
```

### 2. See Supported Filters

```
ffmpeg -filters
```

### 3. Get General Help

```
ffmpeg --help
```

### 4. Access FFmpeg Manual

```
man ffmpeg
```

---

## Applying Filters with FFmpeg (Examples)

### 1. Gaussian Blur Filter

You can check the details of the Gaussian Blur filter:

```
ffmpeg -h filter=gblur
```

Apply the Gaussian Blur filter:

```
ffmpeg -i input.avi -vf "gblur=sigma=20" -c:a copy output.avi
```

- **`-i input.avi`**: Input file.
- **`-vf "gblur=sigma=20"`**: Applies a Gaussian blur filter with a **sigma** value of 20. The higher the sigma value, the stronger the blur effect.
- **`-c:a copy`**: Copies the audio stream without re-encoding.
- **`output.avi`**: Output file.

### 2. Pixelize Filter

You can check the details of the `pixelize` filter:

```
ffmpeg -h filter=pixelize
```

Apply the pixelize filter:

```
ffmpeg -i input.mp4 -vf "pixelize=w=12:h=12" -c:a copy output.mp4
```

- **`-i input.mp4`**: Input file.
- **`-vf "pixelize=w=12:h=12"`**: Applies a pixelization effect, setting the width (`w`) and height (`h`) of each pixel block to 12. This results in a blocky, pixelated look.
- **`-c:a copy`**: Copies the audio stream without re-encoding.
- **`outpur.mp4`**: Output file.

### 3. Adding Grids to a Video

```
ffmpeg -i input.mp4 -vf "drawgrid=w=100:h=100:color=orange" -c:a copy output.mp4
```

- **`-i input.mp4`**: Input file.
- **`-vf "drawgrid=w=100:h=100:color=orange"`**: Adds a grid overlay to the video, where each grid cell has a width (`w`) and height (`h`) of 100 pixels, and the grid lines are orange.
- **`-c:a copy`**: Copies the audio stream without re-encoding.
- **`output.mp4`**: Output file.

### 4. Hue Filter

Make the video cycle through hues in a full 360-degree rotation every 20 seconds.

```
ffmpeg -i input.mp4 -vf "hue='h=mod(t\*360/20,360)'" -c:a copy output.mp4
```

- **`-i input.mp4`**: Input file.
- **`-vf "hue='h=mod(t\*360/20,360)'`**: Applies a hue shift filter, where the hue (`h`) rotates through 360 degrees every 20 seconds. The `mod(t*360/20,360)` ensures the hue wraps around after 360 degrees.
- **`t`**: Refers to the time in seconds.
- **`360/20`**: Divides 360 degrees by 20 seconds, meaning the hue will complete a full rotation every 20 seconds.
- **`mod(...,360)`**: Ensures the hue loops after reaching 360 degrees.
- **`-c:a copy`**: Copies the audio stream without re-encoding.
- **`output.mp4`**: Output file.

### 5. Random Frame Picking

Pick random frames from the video.

```
ffmpeg -i input.mp4 -vf "random=frames=100" -c:a copy output.mp4
```

- **`-i input.mp4`**: Specifies the input file.
- **`-vf "random=frames=100"`**: Applies a random frame filter, which keeps a cache of 100 frames and shuffles them randomly in the output.
- **`-c:a copy`**: Copies the audio stream without re-encoding.
- **`output.mp4`**: Output file.

### 6 Basic Waveform Filter

Visualize the video as a waveform.

```
ffmpeg -i input.mp4 -vf "waveform" -c:a copy output.mp4
```

- **`-i input.mp4`**: Specifies the input file.
- **`-vf "waveform"`**: Applies a waveform filter, generating a visual representation of the video's waveform.
- **`-c:a copy`**: Copies the audio stream without re-encoding.
- **`output.mp4`**: Output file.

---

# FFglitch Workshop

> **FFglitch** is a multimedia **bitstream editor**, based on the open-source project **FFmpeg**.  
> FFglitch allows you to very precisely edit multimedia files, down to the **bitstream level**.  
> It generates files with a **valid bitstream**, meaning platforms like VLC or Instagram won’t have issues with your files.  
> **FFglitch** can be used to create **codec art**.
>
> [Source: FFglitch](https://ffglitch.org/what/)

---

## Understanding the Basics Before Glitching

Before diving into glitch art using **FFglitch**, it’s important to recap some fundamental concepts like **bitstreams**, **containers**, and **codecs**.

---

## 1. What is a Bitstream?

A **bitstream** is a sequence of bits (binary digits, i.e., 0s and 1s) that represents digital data. In the context of multimedia and video/audio processing, a **bitstream** typically refers to the raw or encoded stream of binary data that constitutes the actual content of video, audio, or other types of data.

Bitstreams are either:

- **Raw**: Uncompressed video/audio data (e.g., from a camera sensor).
- **Encoded**: Compressed data using a codec (e.g., H.264 for video).

## 2. Understanding Containers and Codecs

### Containers

A **multimedia container** is a file format that can hold multiple types of data streams, such as video, audio, subtitles, and metadata, all within a single file. It acts as a **wrapper** that brings together different media streams, allowing them to be stored and synchronized for playback.

#### Types of Containers

- **Audio Containers**: Designed to hold **audio** data.

  - **AIFF**: Audio Interchange File Format (IFF).
  - **WAV**: Waveform Audio File Format.
  - **XMF**: Extensible Music Format.
  - **FLAC**: Free Lossless Audio Codec.

- **Still Image Containers**: Exclusively store **still images** and their metadata.

  - **TIFF**: High-quality raster graphics.
  - **PDF**: Can include images and text.
  - **SVG**: Two-dimensional vector graphics.

- **Video Containers**: Common containers that store both **video and audio** streams.
  - **AVI**: One of the oldest video containers developed by Microsoft.
  - **MOV**: Developed by Apple, often used for high-quality video storage and editing.
  - **MP4**: One of the most popular and versatile containers, commonly used for streaming and downloads.

---

### Codecs

A **codec** is a software or hardware algorithm used to **encode** or **decode** digital data streams, particularly video and audio. While a **container** stores and organizes different streams (video, audio, subtitles), the **codec** defines how each stream is compressed and formatted.

#### Example of Codecs:

- **H.264**: A widely used codec for video compression, known for its high-quality compression at relatively low bitrates.
- **AAC**: Advanced Audio Codec, commonly used for audio compression in MP4.
- **MP3**: A lossy audio codec used for compressing audio files.
- **MPEG-4**: A codec often used for compressing both video and audio streams.
- **JPEG (JPG)**: A widely-used image compression codec that uses lossy compression to reduce file sizes while maintaining visual quality.

---

### How Codecs Work with Containers:

The **container** acts as the package that holds the media streams, while the **codec** is responsible for compressing (or decompressing) those streams. Codecs reduce the file size of media by encoding it into a more efficient format and decoding it during playback to restore the original data as much as possible.

For example:

- An **MP4** container might use the **H.264** codec for video compression and **AAC** for audio compression.
- AVI containers can use MPEG-4 codec for video and audio compression.
- A Motion JPEG (**M-JPEG**) video compresses each frame as an individual JPEG image.

---

# Glitch Art

## Glitching a BMP File

1. **BMP is uncompressed**:
   - Hex edits affect specific pixel data directly.
   - Avoid editing the first 54 bytes (header).
   - Changes result in **minor, localized glitches** (e.g., color shifts, lines of distortion).

## Glitching a JPG File

1. **JPEG is compressed**:
   - Even small hex edits can cause **major glitches**.
   - Avoid editing the initial bytes (header and metadata).
   - Edits result in major distortions (e.g., blocky pixelation, color shifts, smearing).

---

# Diving into the JPEG Codec:

Before following this tutorial, it's important to check out this **interactive website** by **Ramiro Polla**, the creator of FFglitch:

## [**JPEG: from pixels to bitstream**](http://jpeg.ffglitch.org/cram.html)

This site will help you understand JPEG encoding and demystify the magic behind it!

## 1. Conversion from RGB to YCbCr (similar to YUV)

[YUV in FFglitch Documentation](https://ffglitch.org/docs/0.10.1/codecs/yuv/)

The first step in JPEG compression is converting the **RGB** color model to the **YCbCr** color model. The **RGB** model represents an image using three color components: **Red**, **Green**, and **Blue**. However, the **YCbCr** model separates the brightness (luminance) from the color (chrominance) information, which is more efficient for compression.

### YCbCr Components:

- **Y (luminance)**: Represents the **brightness** or grayscale information in the image. The human eye is more sensitive to brightness details, so this part is preserved with higher accuracy.

- **Cb and Cr (chrominance)**: Represent the **color** information. Since the human eye is less sensitive to color variations, the chrominance data can be compressed more aggressively.

  - **Cb (B - Y):**: This component represents the difference between the **blue** channel and the luminance (Y).
  - **Cr (R - Y)**: This component represents the difference between the **red** channel and the luminance (Y).

The **green** channel is not directly encoded into the chrominance channels because it can be reconstructed from the luminance and the other two channels (Cb and Cr), as green dominates the luminance data.

---

### 2. DCT (Discrete Cosine Transform)

[DCT Quantization in FFglitch Documentation](https://ffglitch.org/docs/0.10.1/codecs/dct_quant/)

Once the image is in YCbCr, the **Discrete Cosine Transform (DCT)** is applied to blocks of 8x8 pixels. DCT transforms the spatial information (pixel data) into **frequency data**. Essentially, this step breaks down the image into a sum of **sinusoids** or frequency components.

- **Low-frequency components** represent smooth areas (broad color or brightness changes).
- **High-frequency components** represent sharp edges or detail.

By compressing the high-frequency data more than the low-frequency data, JPEG achieves significant size reduction while maintaining visual quality.

### 3. Quantization (Rounding)

The frequency data from the DCT step is **quantized**, which means that the values are divided by a pre-set number and rounded off. This step introduces most of the **lossiness** in JPEG compression.

- **Lower-frequency coefficients** are preserved with higher accuracy (finer details).
- **Higher-frequency coefficients** are rounded more aggressively (less detail retained).

This is a key point for glitching: **small changes in the quantized values can have big visual impacts** on the image, leading to large blocks of distortion when the file is glitched.

### 4. AC/DC Prediction and Run-Length Encoding

After quantization, the data is divided into two types:

- **DC coefficients**: Represent the average color of each 8x8 block (lower-frequency information).
- **AC coefficients**: Represent the finer details or changes within the block (higher-frequency information).

These values are **predicted** based on neighboring blocks, and **run-length encoding (RLE)** is applied to efficiently store the repeating sequences of zeros that commonly occur in the AC coefficients.

Changes in the hex data at this point can cause dramatic effects, as the RLE and predictive models can be disrupted by small modifications, scrambling entire blocks of the image.

### 5. Huffman Encoding (Huffman MAGIC)

After prediction and run-length encoding, the coefficients are further compressed using **Huffman encoding**, a lossless compression technique that replaces frequently occurring symbols with shorter codes.

---

### 6. Final Bitstream (NBITES)

Once Huffman encoding is complete, the JPEG file is converted into a final **bitstream**. This bitstream includes all the encoded data: YCbCr values, DCT coefficients, and Huffman-encoded symbols, ready for storage or transmission.

---

## Decoding (Inverse Process)

When decoding a JPEG image, the steps are essentially reversed:

1. **Huffman Decoding**: The compressed symbols are decoded back into the quantized DCT coefficients.
2. **Run-Length Decoding and AC/DC Prediction**: The encoded values are reconstructed, using predictions for the DC components.
3. **Inverse Quantization**: The frequency coefficients are multiplied by the same quantization factor to retrieve the original DCT values.
4. **IDCT (Inverse DCT)**: The **Inverse Discrete Cosine Transform** is applied to convert frequency data back into the spatial domain (pixels).
5. **YCbCr to RGB Conversion**: The image is converted back from **YCbCr** to **RGB** for display.

This decoding process reconstructs the compressed data as accurately as possible, though some detail is lost due to quantization in the compression step.

---

# How to Glitch with FFglitch

This tutorial is based on the [FFglitch Scripts guide](https://github.com/ramiropolla/ffglitch-scripts/blob/main/tutorial/readme.md), with additional tips and examples.

Since **FFglitch** is a fork of **FFmpeg** specifically designed for glitch art and multimedia manipulation, it provides several command-line tools like in FFmpeg but with glitching features:

- **ffedit**: Is a multimedia bitstream editor. It allows you to manipulate the bitstream of video, audio, and other media formats:

  > [ffedit documentation](https://ffglitch.org/docs/0.10.1/ffedit/).

- **fflive**: Similar to **ffplay**, but with added glitch capabilities. **fflive** integrates **ffedit**, allowing you to glitch multimedia content in real-time:

  > [fflive documentation](https://ffglitch.org/docs/0.10.1/fflive/).

- **ffgac**: Is a modified version of **ffmpeg**. While it behaves almost identically to **ffmpeg**, it includes additional features for glitch art manipulation. The **GAC** in the name stands for [Glitch Artists Collective](https://glitchartistscollective.tumblr.com/):
  > [ffgac documentation](https://ffglitch.org/docs/0.10.1/ffgac/).

---

## Codecs and Features Documentation

Since FFglitch focuses on bitstream-level manipulation, it's important to understand how each codec functions and the specific features available for glitching.

- [FFglitch - Codecs documentation](https://ffglitch.org/docs/0.10.1/codecs/)
- [FFglitch - Features documentation](https://ffglitch.org/docs/0.10.1/features/)

---

## Installation

Before starting, install **FFglitch** on your system:

- **Linux**: [FFglitch Installation Guide for Linux](https://github.com/ramiropolla/ffglitch-scripts/blob/main/tutorial/readme_linux.md)
- **macOS**: [FFglitch Installation Guide for macOS](https://github.com/ramiropolla/ffglitch-scripts/blob/main/tutorial/readme_macos.md)
- **Windows**: [FFglitch Installation Guide for Windows](https://github.com/ramiropolla/ffglitch-scripts/blob/main/tutorial/readme_windows.md)

Once you’ve successfully installed FFglitch, you're ready to start experimenting.

## JPG Glitches:

The equivalent of "Hello World" in FFglitch involves glitching a JPEG file using its DC quantization coefficients.

1. **Modifying the DC Quantization Coefficient:**

```
./bin/fflive -i lena.jpg -s scripts/jpeg/random_dqt.js
```

2. **Modifying the Quantized DC Delta:**

```
./bin/fflive -i lena.jpg -s scripts/jpeg/q_dc_delta.js
```

### MJPEG Glitches:

In addition to glitching JPEG images, **FFglitch** can also be used to glitch videos by converting them into the **MJPEG (Motion JPEG)** format.
MJPEG is essentially a series of JPEG images stitched together in a video stream.

#### Step 1: Convert Video to MJPEG

You can convert any video file (e.g., MP4, MOV) into MJPEG format using **FFmpeg** or **FFglitch** with the following commands:

- Using **FFmpeg**:

  ```
  ffmpeg -i input.mp4 -c:v mjpeg -q:v 1 output.mjpeg
  ```

- Using **FFglitch** (**ffgac**):
  ```
  ./bin/ffgac -i input.mp4 -c:v mjpeg -q:v 1 output.mjpeg
  ```
- **`-c:v mjpeg`**: Specifies that the video codec should be **MJPEG**.
- **`-q:v 1`**: Controls the quality of the output video (lower values mean higher quality).

#### Step 2: Apply FFglitch Script to the MJPEG Video

Once you have the video in MJPEG format, you can apply the same glitch scripts used for JPEG files. For example:

1. **Modifying the DC Quantization Coefficient in MJPEG Video:**

```
./bin/fflive -i input.mjpeg -s scripts/jpeg/dqt.js
```

2. **Modifying the Quantized DC Delta in MJPEG Video:**

```
./bin/fflive -i input.mjpeg -s scripts/jpeg/random_q_dc_delta.js
```

3. **Another script that modify the Quantized DC Delta**

```
./bin/fflive -i input.mjpeg -s scripts/jpeg/random_q_dc_delta.js
```

### Alternative: Combine Conversion and Glitching in One Command

You can also perform both the conversion to MJPEG and the glitching in a single step by using a pipe (`|`) to send the MJPEG stream directly into **FFlive**:

```
./bin/ffgac -i input.mp4 -c:v mjpeg -q:v 1 -f mjpeg - | ./bin/fflive -i - -s scripts/jpeg/dqt.js
```

### Final Step: Piping a Generative Mandelbrot to FFglitch

Now that you know how to pipe things into FFglitch, you can pipe a generated Mandelbrot fractal (https://trac.ffmpeg.org/wiki/FancyFilteringExamples) into **FFglitch** and apply real-time glitching using fflive.

```
ffmpeg -f lavfi -i "mandelbrot=size=1920x1080:rate=25:maxiter=10000" -c:v mjpeg -q:v 3 -f mjpeg - | ./bin/fflive -i - -s scripts/jpeg/random_dqt.js
```

#### Here's what this command does:

1. **Generate a Mandelbrot fractal**:

   - **`mandelbrot=size=1920x1080:rate=25`**: Creates a Full HD Mandelbrot fractal at 25 fps.

2. **Convert to MJPEG**:

   - **`-c:v mjpeg`**: Compresses each frame of the video as a **JPEG**.
   - **`-q:v 3`**: Sets the MJPEG quality (lower values = higher quality).
   - **`-f mjpeg -`**: Pipes the MJPEG video stream into the next command without saving it to disk.

3. **Pipe the MJPEG video to FFglitch (FFlive)**:
   - **`| ./bin/fflive -i -`**: Sends the MJPEG stream to **fflive**, the real-time glitching tool from **FFglitch**.
   - **`-s scripts/jpeg/random_dqt.js`**: Applies the **random_dqt.js** glitching script to modify the DC quantization coefficients.

---

**_You're done! Enjoy the fractal!_**

---
