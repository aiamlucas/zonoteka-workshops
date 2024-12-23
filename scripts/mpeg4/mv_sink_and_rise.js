// ./bin/fflive -i CEP00109_mpeg4.avi -s scripts/mpeg4/mv_sink_and_rise.js

/*********************************************************************/
// Go down to WHERE THE MAGIC HAPPENS to experiment with this script.

/*********************************************************************/
export function setup(args) {
  // select motion vector feature
  args.features = ["mv"];
}

export function glitch_frame(frame) {
  const fwd_mvs = frame.mv?.forward;
  if (!fwd_mvs) return; // Bail out if no forward motion vectors

  // clear horizontal element of all motion vectors
  for (let i = 0; i < fwd_mvs.length; i++) {
    // loop through all rows
    const row = fwd_mvs[i];
    for (let j = 0; j < row.length; j++) {
      // loop through all macroblocks
      const mv = row[j];

      // THIS IS WHERE THE MAGIC HAPPENS
      if (mv) {
        // Ensure mv is not null
        mv[0] = 0; // Set horizontal motion vector to zero
        // mv[1] = 0; // you   could also change the vertical motion vector
      }
    }
  }
}
