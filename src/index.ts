import * as fs from 'fs';
import { simulateSingleCar } from './utils/simulateSingleCar';
import { simulateMultiCar } from './utils/simulateMultiCars';

function main() {
  // Parse CLI flags
  const args = process.argv.slice(2);
  const isSingle = args.includes('--single');
  const isMulti = args.includes('--multi');

  // Prevent both flags at once
  if (isSingle && isMulti) {
    console.error('Error: Cannot pass both --single and --multi flags.');
    process.exit(1);
  }

  // Determine mode and input file path (default: single car)
  let mode: 'single' | 'multi' = 'single';
  let inputFile = 'inputs/single-car-input.txt';

  if (isSingle) {
    mode = 'single';
    inputFile = 'inputs/single-car-input.txt';
  } else if (isMulti) {
    mode = 'multi';
    inputFile = 'inputs/multi-car-input.txt';
  }

  try {
    const input = fs.readFileSync(inputFile, 'utf-8');
    const result =
      mode === 'multi' ? simulateMultiCar(input) : simulateSingleCar(input);
    console.log(result);
  } catch (e) {
    console.error(
      `Error reading input file "${inputFile}": ${(e as Error).message}`,
    );
    process.exit(1);
  }
}

main();
