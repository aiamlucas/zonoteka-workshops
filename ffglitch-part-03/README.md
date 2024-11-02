# Recap: FFmpeg Filters

FFmpeg has extensive documentation for all its filters, accessible online and via the command line. Here are some ways to explore FFmpeg filter information, including examples of each approach.

## 1. View Filter Documentation on FFmpeg's Official Website

FFmpeg’s official documentation provides a comprehensive list of filters, options, and examples.

```
https://ffmpeg.org/ffmpeg-filters.html
```

---

## 2. Access Filter Documentation with `ffmpeg -h`

Using FFmpeg’s `-h` (help) option provides a quick overview of general filter information.

```
ffmpeg -h filter=<filter_name>
```

---

## 3. List Available Filters with `ffmpeg -filters`

Use `-filters` to list all available FFmpeg filters, with a brief description of each.

```
ffmpeg -filters
```

---

# FFmpeg Guide: Splitting Video into Red, Green, and Blue Layers

This guide provides different methods to split a video into three layers representing the red, green, and blue channels using FFmpeg. Each method outputs separate video files for each color channel. The output format is RGB, ensuring each file contains only one isolated color channel.

## Method 1: Using `format`, `split`, and `lutrgb` Filters

Isolate each channel by converting the video to RGB format, splitting the streams, and applying a lookup table (LUT) to zero out other channels.

```
ffmpeg -i input.mp4 \
 -vf "format=rgb24,split=3[red][green][blue];
[red]lutrgb=g=0:b=0[out1];
[green]lutrgb=r=0:b=0[out2];
[blue]lutrgb=r=0:g=0[out3]" \
 -map "[out1]" red_layer.mp4 \
 -map "[out2]" green_layer.mp4 \
 -map "[out3]" blue_layer.mp4
```

**Explanation**:

- `format=rgb24`: Converts the video to RGB format.
- **`split=3[red][green][blue]`**: Splits the video into three separate streams (`[red]`, `[green]`, and `[blue]`). This creates three identical streams from the input, which can then be filtered individually.
- **`lutrgb=g=0:b=0`**: For each color stream, the `lutrgb` filter zeroes out unwanted channels:
  - `[red]lutrgb=g=0:b=0[out1]`: Keeps only the red channel in `[out1]`.
  - `[green]lutrgb=r=0:b=0[out2]`: Keeps only the green channel in `[out2]`.
  - `[blue]lutrgb=r=0:g=0[out3]`: Keeps only the blue channel in `[out3]`.
- **`-map`**: The `-map` option directs each filtered output stream to a separate output file:
  - `-map "[out1]" red_layer.mp4`: Saves `[out1]` as `red_layer.mp4`.
  - `-map "[out2]" green_layer.mp4`: Saves `[out2]` as `green_layer.mp4`.
  - `-map "[out3]" blue_layer.mp4`: Saves `[out3]` as `blue_layer.mp4`.

---

## Method 2: Using `extractplanes` Filter

This method uses `extractplanes` to directly extract each color channel as a grayscale image in the output files.

```
ffmpeg -i input.mp4 -vf "format=rgb24,extractplanes=r" red_layer.mp4
ffmpeg -i input.mp4 -vf "format=rgb24,extractplanes=g" green_layer.mp4
ffmpeg -i input.mp4 -vf "format=rgb24,extractplanes=b" blue_layer.mp4
```

**Explanation**:

- `extractplanes=r`, `extractplanes=g`, `extractplanes=b`: Extracts each color channel as a grayscale image, saved to separate files for red, green, and blue.

---

## Method 3: Using `colorchannelmixer` Filter

This method isolates channels by using `colorchannelmixer` to zero out the unwanted channels.

```
ffmpeg -i input.mp4 -vf "colorchannelmixer=.3:0:0:0:0:.3:0:0:0:0:.3:0" red_layer.mp4
ffmpeg -i input.mp4 -vf "colorchannelmixer=0:.3:0:0:0:0:.3:0:0:0:0:.3" green_layer.mp4
ffmpeg -i input.mp4 -vf "colorchannelmixer=0:0:.3:0:0:0:0:.3:0:0:0:0:.3" blue_layer.mp4
```

**Explanation**:

- **`colorchannelmixer`**: Adjusts each color channel to isolate the desired color:
  - **`colorchannelmixer=.3:0:0:0:0:.3:0:0:0:0:.3:0`**: Red layer, keeping only the red values.
  - **`colorchannelmixer=0:.3:0:0:0:0:.3:0:0:0:0:.3`**: Green layer, keeping only the green values.
  - **`colorchannelmixer=0:0:.3:0:0:0:0:.3:0:0:0:0:.3`**: Blue layer, keeping only the blue values.

Each method provides a unique approach to isolating color channels. Choose the one that best fits your needs!
