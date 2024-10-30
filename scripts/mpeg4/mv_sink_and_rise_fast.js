// ./bin/fflive -i CEP00109_mpeg4.avi -s scripts/mpeg4/mv_sink_and_rise_fast.js

/*********************************************************************/
// This script has similar functionality to mv_sink_and_rise.js, but it
// uses optimized functions that make it much much faster.
// Go here for more documentation on the optimized functions:
// - https://ffglitch.org/docs/0.10.2/quickjs/mv2darray#mv2darrayprototypemathop

/*********************************************************************/
export function setup(args) {
  // select motion vector feature
  args.features = ["mv"];
}

export function glitch_frame(frame) {
  const fwd_mvs = frame.mv?.forward;
  // bail out if we have no forward motion vectors
  if (!fwd_mvs) return;

  // assign 0 to the 'h'orizontal element of each motion vector,
  // effectively removing horizontal movement from the video.
  fwd_mvs.assign_h(0);

  //////////////////////////
  // Example modifications (methods like add(), sub(), mul(), div()):

  // Remove vertical movement from the video:
  // fwd_mvs.assign_v(0);

  // Apply a positive horizontal shift:
  // fwd_mvs.add_h(27);

  // Apply a negative horizontal shift:
  // fwd_mvs.add_h(-27);

  // Subtract from horizontal elements:
  // fwd_mvs.sub_h(27);

  // Add vertical shift:
  // fwd_mvs.add_v(15);

  // Multiply horizontal elements by 27:
  // fwd_mvs.mul_h(27);

  // Divide vertical elements by 27:
  // fwd_mvs.div_v(27);
  //////////////////////////
}
