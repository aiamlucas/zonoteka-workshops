# Codecs and Glitching

Every codec is essentially a algorithm designed to encode/decode and compress data, whether it’s visual, audio, or otherwise. While many codecs share similar principles—such as reducing spatial and temporal redundancy—each codec is built with specific instructions and strategies tailored for its particular purpose.

In the first part of this tutorial, we focused on **JPEG** and **MJPEG**. MJPEG applies JPEG compression to each frame independently, without considering the motion or context of surrounding frames, making it simpler to manipulate but limited in functionality.

Now, we’ll explore **MPEG-4**, a more complex codec developed specifically for video. Unlike MJPEG, MPEG-4 efficiently compresses video by analyzing changes across frames, storing only the differences rather than treating each frame independently. This added complexity introduces elements like motion vectors and different types of keyframes, which encode movement and changes over time.

Because each codec has a unique design, the possibilities for glitching are different too. JPEG glitches focus on static pixel data, while MPEG-4 glitches allow for the manipulation of movement and relationships between frames, enabling dynamic, sequence-based glitches.

---

# Diving into the MPEG-4 Codec:

## 1. Video Compression in MPEG-4

[MPEG-4 in FFglitch Documentation](https://ffglitch.org/docs/0.10.1/codecs/mpeg4/)

The MPEG-4 codec compresses video by reducing redundancy in both **_spatial_** and **temporal data**. The goal is to keep high visual quality while significantly lowering the amount of data stored.

The first step, like in JPEG compression, is converting the video from the **RGB** color model to **YCbCr**. This separates brightness (luminance) from color (chrominance) information, allowing for more efficient compression since the human eye is more sensitive to brightness than color.

### Temporal and Spatial Redundancy:

- **Temporal Redundancy**: Video frames are often similar to one another. MPEG-4 takes advantage of this by only encoding **changes between frames** instead of storing every frame fully. This is done through **inter-frame compression**.
- **Spatial Redundancy**: Pixels in an image (or frame) that are next to each other are often similar. This is compressed using **intra-frame compression**.

---

## 2. Key Frame Types in MPEG-4

MPEG-4 video streams use four types of frames for compression:

### I-Frames (Intra-coded Frames):

- These frames store a complete image, much like a JPEG file. They are used as reference points in the video stream.
- Typically, I-frames are placed periodically in the video to ensure that future frames (P and B) can be decoded properly.
- **Importance**: I-frames maintain the highest image quality but are less compressed. They serve as anchor points for the rest of the video.

### P-Frames (Predicted Frames):

- They store the differences between the current frame and the previous I-frame or P-frame.
- **Importance**: They rely on the previous frame to reconstruct the current one. If the previous frame is damaged or corrupted, P-frames will also be affected.

### B-Frames (Bi-directional Predicted Frames):

- **B-frames** store the differences between both the previous and the next frames.
- **Importance**: They achieve the highest compression but depend on both past and future frames. They compress the video significantly by using data from surrounding frames.

### S-VOPs (Sprite VOPs or GMC VOPs - Global Motion Compensation):

- **S-VOPs** use global motion compensation to track large, complex movements such as camera zooms, pans, or rotations.
- **Importance**: They are especially useful for compressing scenes with global motion, where the entire image moves in a more complex manner. This improves compression efficiency for these types of motion but is less commonly used in standard MPEG-4 implementations.

---

## 3. Motion Compensation

MPEG-4 achieves further compression by using **motion compensation**, which tracks the movement of objects between frames:

- **Macroblocks**: Each frame is divided into **macroblocks** (typically 16x16 pixels), and these are the fundamental units used for motion compensation.
- **Motion Vectors**: The codec tracks how these **macroblocks** move from one frame to another. Instead of storing a new image for every frame, the codec stores information on how each **macroblock** has moved, called a **motion vector**.
- **Importance**: By storing only the changes between **macroblocks** across frames rather than encoding each frame in its entirety, MPEG-4 achieves significant data savings, making it highly efficient for video storage and transmission.

---

## 4. Discrete Cosine Transform (DCT)

Like JPEG, MPEG-4 also uses **Discrete Cosine Transform (DCT)** to transform pixel data into frequency data.

## 5. Quantization

Once the DCT is applied, the frequency data is **quantized**, meaning it's divided by a specific value and rounded to reduce precision:

- **Quantization**: This is where compression becomes **lossy**. The higher the quantization value, the more data is discarded.
- **Importance**: Quantization reduces the amount of data needed to store each frame but also causes a loss in detail, particularly in the high-frequency components.

---

## 6. Motion Estimation and Prediction

In MPEG-4, **motion estimation** and **prediction** are used to reduce the file size further by focusing only on the changes between frames:

- **Prediction**: For P-frames and B-frames, the codec predicts how objects in the scene move from one frame to the next, using motion vectors. These vectors describe how blocks of pixels have shifted from one frame to the next.
- **Importance**: This reduces the need to store every pixel in every frame and instead stores the changes (predicted movements) between frames.

---

## 7. Entropy Coding

The final step in MPEG-4 compression is **entropy coding**. This step uses techniques like **Huffman coding** and **Run-Length Encoding (RLE)** to further compress the data:

- **Run-Length Encoding (RLE)**: Compresses sequences of repeating values, such as areas of uniform color.
- **Huffman Coding**: Assigns shorter binary codes to more frequently occurring symbols in the data, reducing the overall size of the bitstream.
- **Importance**: Entropy coding helps remove redundancies in the video data, leading to significant file size reduction.

---

## 8. Bitstream Packaging

Once the video data is fully compressed, the MPEG-4 codec packages it into a **bitstream** for storage or transmission. The bitstream includes:

- **Headers**: Contain metadata, such as the frame rate, resolution, and codec information.
- **Compressed Data**: The actual video data, including I-frames, P-frames, and B-frames.
- **Error Correction**: Some MPEG-4 bitstreams may also include error correction data to protect against corruption during transmission.

---

## Decoding (Inverse Process)

When decoding an MPEG-4 video, the process works in reverse:

1. **Entropy Decoding**: The compressed symbols are decoded back into quantized DCT coefficients.
2. **Inverse Quantization**: The quantized DCT coefficients are converted back into frequency data.
3. **IDCT (Inverse DCT)**: The **Inverse Discrete Cosine Transform** is applied to turn frequency data back into pixel data.
4. **Motion Compensation**: Motion vectors are used to reconstruct the frame from reference frames.
5. **Frame Reconstruction**: B-frames, P-frames, and S-VOPs are reconstructed using the differences from the reference frames or global motion data.
6. **YCbCr to RGB Conversion**: Finally, the image is converted back from **YCbCr** to **RGB** for display.

---

# FFglitch with MPEG-4

Now that we understand how MPEG-4 video is packaged into a bitstream, let’s explore how **FFglitch** allows us to manipulate motion vectors to create glitches.

> **Motion vectors** track the movement of objects between frames in a video. Each frame is divided into macroblocks (16x16 pixels), and motion vectors describe how these blocks have shifted between frames.

Let’s try a example where we clear the **horizontal motion vectors** of the video:

```
./bin/fflive -i input.avi -s scripts/mpeg4/mv_sink_and_rise.js
```

Here we apply the `mv_sink_and_rise.js` script to the video file. This script sets the horizontal motion vectors to zero, causing horizontal motion to freeze or glitch, while vertical motion remains intact.

---

> **Note**: If you want to store in another video file these modifications, one option is to use **ffedit** instead of `fflive`. With `ffedit`, you can apply the script and save the output in one step.

We’ll go into more detail about all the FFglitch tools later in the tutorial, but here’s how you would use `ffedit` to save your modifications:

```
./bin/ffedit -i input.avi -s scripts/mpeg4/mv_sink_and_rise.js -o output.avi
```

This command will apply the `mv_sink_and_rise.js` script to the input video file and save the edited bitstream directly to `output_with_glitch.avi`.

# MPEG-4 Features in FFglitch

Before we go for some other fancy examples of MPEG-4 glitching, let’s take a look at the essential features that **FFglitch** provides:

- **Info**
- **Motion Vectors**
- **Motion Vectors (Delta Only)**
- **Macroblock**
- **Global Motion Compensation**

For more details, you can check the full documentation here: [FFglitch MPEG-4 Features](https://ffglitch.org/docs/0.10.1/features/mpeg4/). I’ll be summarizing the some points, but it's definitely worth exploring the full documentation.

## Info

The "info" feature exports information about the picture type and the macroblock types. This feature is informative only; no changes will be applied back when transplicating.

```
"info": {
"pict_type": (informative) pict_type,
"interlaced": (informative) interlaced,
"field": (informative) (optional) field,
"mb_type": (informative) [
[ mb_type, mb_type, …, length: mb_width ],
[ mb_type, mb_type, …, length: mb_width ],
…, length: mb_height
]
}
```

### Key Information:

- **pict_type**: Can be `"I"`, `"P"`, `"B"`, or `"S"` (for S(GMC)-frames).
- **interlaced**: Boolean indicating if the frame is interlaced (`true`) or not (`false`).
- **field**: Optional, either `"top"` or `"bottom"`, for interlaced frames.
- **mb_type**: Describes the type of each macroblock (e.g., `"I"`, `"q"`, `"f"`, etc.).

### Macroblock Type Flags

The `mb_type` field describes the characteristics of each macroblock using a string of flags, where each flag represents a specific feature. Here are the flags:

- **I**: Intra macroblock (I, P, and S(GMC) frames)
- **a**: AC Prediction (used in I frames)
- **q**: Macroblocks that change the quantization scale (I, P, B, and S(GMC) frames)
- **f**: Forward motion vectors (used in P, B, and S(GMC) frames)
- **b**: Backward motion vectors (used in B frames)
- **d**: Direct motion vectors (used in B frames)
- **G**: Global Motion Compensation (used in S(GMC) frames)
- **4**: Macroblocks with 4 separate 8x8 motion vectors instead of a single 16x16 (used in P and S(GMC) frames)
- **i**: Interlaced macroblocks (motion vectors are 16x8 in this case, used in P, B, and S(GMC) frames)
- **1**: Macroblocks that change the DCT coefficients of the first luma block
- **2**: Macroblocks that change the DCT coefficients of the second luma block
- **3**: Macroblocks that change the DCT coefficients of the third luma block
- **4**: Macroblocks that change the DCT coefficients of the fourth luma block
- **5**: Macroblocks that change the DCT coefficients of the U chroma block
- **6**: Macroblocks that change the DCT coefficients of the V chroma block

## Motion Vectors

The "mv" feature exports the motion vectors from the bitstream. There may be "forward" and "backward" motion vectors.

```
"mv": {
"forward": (optional) [
[ MV, MV, …, length: mb_width ],
…, length: mb_height
],
"backward": (optional) [
[ MV, MV, …, length: mb_width ],
…, length: mb_height
],
"fcode": (informative) fcode,
"overflow": overflow
}
```

- **MV**: Motion vectors represented as arrays of horizontal and vertical components.
- **fcode**: Used to calculate the motion vector range.
- **overflow**: Defines the behavior if motion vectors overflow the limits.

## Motion Vectors (Delta Only)

The "mv_delta" feature is similar to "mv," but it exports motion vectors as delta values from the previous vectors.

```
"mv_delta": {
"forward": (optional) [
[ MV_delta, MV_delta, …, length: mb_width ],
…, length: mb_height
],
"backward": (optional) [
[ MV_delta, MV_delta, …, length: mb_width ],
…, length: mb_height
],
"fcode": (informative) fcode,
"overflow": overflow
}
```

## Macroblock

The "mb" feature exports the bytestream for each macroblock as a string value. This allows for manipulation and reordering of macroblocks.

```
"mb": {
"data": (optional) [
[ macroblock, macroblock, …, length: mb_width ],
…, length: mb_height
],
"sizes": (optional) [
[ size, size, …, length: mb_width ],
…, length: mb_height
]
}
```

- **macroblock**: Hex representation of the macroblock bytestream.
- **size**: The size of the macroblock in bits.

## Global Motion Compensation

The "gmc" feature exports the parameters for Global Motion Compensation.

- **Note**: The GMC feature documentation is still a work in progress. As of the creation of this tutorial, full details are yet to be completed on FFglitch.org.

## Introduction to MV2DArray and its Purpose in Video Processing

In video processing, particularly when dealing with effects that manipulate motion, it’s essential to work with **motion vectors**—small pieces of data representing movement between frames.

Each motion vector typically has two main components, **horizontal** and **vertical**, indicating movement in those directions. When applied across an entire frame, these vectors create a **2-dimensional array** representing motion throughout the video.

The **`MV2DArray`** is specifically designed to manage and manipulate these motion vectors efficiently. Imagine each frame in a video as a **grid** of pixels. For each grid cell, `MV2DArray` can store and adjust a motion vector, allowing users to control or modify movement across the entire frame. This structure offers **optimized methods** for fast, large-scale transformations on these grids, helping to apply effects smoothly and quickly.

Using `MV2DArray`, you can:

- Represent motion across each grid cell within a frame.
- Quickly adjust or apply complex transformations to these vectors, such as reversing directions, freezing parts of a frame, or modifying only selected areas.

### Visualizing Each Frame as a Grid of Pixels

Each frame in a video can be represented as a grid. Let’s assume we have a 4x3 frame (4 columns by 3 rows) as an example.

Each cell [x, y] in the grid represents a pixel location in the frame, and each cell contains a motion vector [horizontal, vertical]. These vectors dictate how that pixel should move in the frame. In MV2DArray, each cell holds such a vector.

```
   [0,0]        [0,1]        [0,2]        [0,3]
 ┌──────────┬──────────┬──────────┬──────────┐
0│ [1, -1]  │ [0, 0]   │ [-1, 1] │ [1, 2]   │ Row 0
 ├──────────┼──────────┼──────────┼──────────┤
1│ [0, -2]  │ [1, 1]   │ [0, 0]  │ [-1, 1]  │ Row 1
 ├──────────┼──────────┼──────────┼──────────┤
2│ [-1, 0]  │ [2, -1]  │ [1, 1]  │ [0, 0]   │ Row 2
 └──────────┴──────────┴──────────┴──────────┘
```

Each `[horizontal, vertical]` vector can be visualized as a small arrow indicating movement:

- `[1, -1]` means move right by 1 and up by 1.
- `[0, 0]` means no movement.
- `[-1, 1]` means move left by 1 and down by 1.

### Applying Motion Effects with MV2DArray

By adjusting these vectors, you can create different motion effects across the frame:

1. **Horizontal Motion Freeze**: Set all horizontal vectors to `0` using `assign_h(0)` to remove left/right movement while keeping vertical movement.

```
   [0,0]        [0,1]        [0,2]        [0,3]
 ┌──────────┬──────────┬──────────┬──────────┐
0│ [0, -1]  │ [0, 0]   │ [0, 1]  │ [0, 2]   │ Row 0
 ├──────────┼──────────┼──────────┼──────────┤
1│ [0, -2]  │ [0, 1]   │ [0, 0]  │ [0, 1]   │ Row 1
 ├──────────┼──────────┼──────────┼──────────┤
2│ [0, 0]   │ [0, -1]  │ [0, 1]  │ [0, 0]   │ Row 2
 └──────────┴──────────┴──────────┴──────────┘
```

2. **Vertical Motion Freeze**: Set all vertical vectors to `0` using `assign_v(0)` to **remove up/down movement** while keeping horizontal movement.

```
   [0,0]        [0,1]        [0,2]        [0,3]
 ┌──────────┬──────────┬──────────┬──────────┐
0│ [1, 0]   │ [0, 0]   │ [-1, 0] │ [1, 0]   │ Row 0
 ├──────────┼──────────┼──────────┼──────────┤
1│ [0, 0]   │ [1, 0]   │ [0, 0]  │ [-1, 0]  │ Row 1
 ├──────────┼──────────┼──────────┼──────────┤
2│ [-1, 0]  │ [2, 0]   │ [1, 0]  │ [0, 0]   │ Row 2
 └──────────┴──────────┴──────────┴──────────┘
```

3. **Motion Reset**: Use `clear()` to zero out all vectors and **freeze all movement** across the frame.

```
   [0,0]        [0,1]        [0,2]        [0,3]
 ┌──────────┬──────────┬──────────┬──────────┐
0│ [0, 0]   │ [0, 0]   │ [0, 0]  │ [0, 0]   │ Row 0
 ├──────────┼──────────┼──────────┼──────────┤
1│ [0, 0]   │ [0, 0]   │ [0, 0]  │ [0, 0]   │ Row 1
 ├──────────┼──────────┼──────────┼──────────┤
2│ [0, 0]   │ [0, 0]   │ [0, 0]  │ [0, 0]   │ Row 2
 └──────────┴──────────┴──────────┴──────────┘
```

## MV2DArray, MV2DPtr, and MV2DMask Overview

### MV2DArray

`MV2DArray` is a **fixed-size 2D array** used to store [horizontal, vertical] motion vectors. Once initialized, its size (width and height) remains constant. `MV2DArray` is **dense**, meaning all cells (grid positions) are accounted for, even if their value is `null`. If any vector data is missing, it’s represented as `MV(null)`, making it compatible with all `MV` methods.

### MV2DPtr

`MV2DPtr` is very similar to MV2DArray, and shares all the same methods. The main difference is that MV2DPtr does not have any memory allocated for its data. Instead, **it points to data from MV2DArray**.

> Be careful not to play around with MV2DPtrs once the object they were created from has run out of its scope. You will write into unallocated memory and the program will segfault.

### MV2DMask

`MV2DMask` is a **2D boolean array** that selects specific parts of an `MV2DArray` for operations. By creating a `MV2DMask`, you can apply transformations to only chosen vectors within an array, making the code more efficient by skipping irrelevant areas.

---

## MV2DArray Constructor

Creates a new `MV2DArray` with a specified width and height. All vectors initialize to `[0,0]`.

**Syntax:**

```
new MV2DArray(width, height)
```

**Example:**

```
const mv2darr = new MV2DArray(3, 2);
print(mv2darr);
// [
// [[0,0],[0,0],[0,0]],
// [[0,0],[0,0],[0,0]]
// ]
```

---

## Core Operations in MV2DArray:

`MV2DArray` supports the math operation methods:

1. **`add()`**: Adds a motion vector to each element in the array.
2. **`sub()`**: Subtracts a vector from each element.
3. **`mul()`**: Multiplies each element by a vector.
4. **`div()`**: Divides each element by a vector, rounding if needed.
5. **`assign()`**: Directly assigns a motion vector to each element.

Each of these functions can apply a transformation across the entire 2D array (or to selected cells if a mask is applied).

---

## Applying Transformations with MV2DArray

### Example Code: Horizontal Motion Freezing

> This script has similar functionality to mv_sink_and_rise.js, but it
> // uses optimized functions that make it much much faster.

The following code stops horizontal motion by setting each horizontal component in the forward motion vectors to `0`.

```
export function setup(args) {
args.features = [ "mv" ]; // Enables motion vector feature
}

export function glitch_frame(frame) {
const fwd_mvs = frame.mv?.forward;
if (!fwd_mvs) return; // Checks for motion vectors

fwd_mvs.assign_h(0); // Sets all horizontal elements to 0
}
```

### Explanation

1. **Setup**: Enables the motion vector feature in `args`.
2. **Motion Vector Check**: Exits if no forward motion vectors are present.
3. **Horizontal Motion Removal**: `assign_h(0)` zeroes all horizontal components, freezing horizontal movement while keeping vertical motion.

---
