// ./bin/fflive -i lena.jpg -s scripts/jpeg/dqt.js

/*********************************************************************/
//randomly change the DC quantization coefficient (from 0 to 80)
const dc_quant = 60;

/*********************************************************************/
export function setup(args) {
  // select quantization table feature
  args.features = ["dqt"];
}

export function glitch_frame(frame, stream) {
  const tables = frame.dqt.tables;
  const table0 = tables[0];
  console.log(`The old DC quantization coefficient was ${table0[0]}`);
  // change the DC quantization coefficient for first table
  table0[0] = dc_quant;
  console.log(`The new DC quantization coefficient is ${table0[0]}`);
}
