// ./bin/fflive -i input.mjpg -s scripts/jpeg/random_q_dc_delta.js

/*********************************************************************/
// Function to generate random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*********************************************************************/
export function setup(args) {
  // Enable quantized DC delta feature
  args.features = ["q_dc_delta"];
}

export function glitch_frame(frame, stream) {
  if (frame.q_dc_delta && frame.q_dc_delta.data) {
    const data = frame.q_dc_delta.data;
    const planes = data.length; // Number of planes
    const plane = randomInt(0, planes - 1); // Randomly choose a valid plane

    const mb_x_max = data[plane].length - 1; // Max value for mb_x
    const mb_y_max = data[plane][0].length - 1; // Max value for mb_y

    if (mb_x_max > 0 && mb_y_max > 0) {
      const mb_x = randomInt(0, mb_x_max); // Randomly choose valid macroblock x
      const mb_y = randomInt(0, mb_y_max); // Randomly choose valid macroblock y
      const dc_delta = randomInt(-64, 64); // Random DC delta

      // Apply glitch to the selected macroblock
      data[plane][mb_x][mb_y] += dc_delta;
      console.log(
        `Glitched plane ${plane}, macroblock (${mb_x}, ${mb_y}), DC delta changed by ${dc_delta}`
      );
    } else {
      console.log("No valid macroblocks in this frame.");
    }
  } else {
    console.log("Skipping frame: q_dc_delta data not available");
  }
}
