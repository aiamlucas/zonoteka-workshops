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

  // try this for removing vorizontal movement from the video.
  // fwd_mvs.assign_v(0);

  //////////////////////////
  // try to use other methods like add(), sub(), mul(), div():
  // fwd_mvs.add_h(27); // try this
  // fwd_mvs.add_h(-27); // try this
  // fwd_mvs.sub_h(27); // try this
  // fwd_mvs.add_v(15); // try this
  // fwd_mvs.mul_h(27); // // try this!
  // fwd_mvs.div_v(27); //
  //////////////////////////
}
