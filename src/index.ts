import * as fs from 'fs';
import { simulateSingleCar } from './utils/simulateSingleCar';
import { simulateMultiCar } from './utils/simulateMultiCars';

function main() {
  try {
    const input = fs.readFileSync('input.txt', 'utf-8');
    const result = simulateMultiCar(input);
    console.log(result);
  } catch (e) {
    console.error('Error reading input file');
    process.exit(1);
  }
}

main();
