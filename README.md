# Auto Driving Car Simulation

My implementation of GIC Application - Take Home Coding Assignment (GIP2026).

## 📑 Table of Contents

1. [🤔 Rationale](#🤔-rationale)
2. [🚀 Get Started](#🚀-get-started)
3. [🏗️ Architecture](#🏗️-architecture)
4. [💭 Key Assumptions](#💭-key-assumptions)
5. [🧪 Test Results](#🧪-test-results)

## 🤔 Rationale

Thank you for reviewing my submission! Your time is valuable, and with that in
mind...

My approach focuses on **simplicity**, **clarity**, and **efficiency**. Given
the open-ended nature of the assignment, I deliberately avoided complexity and
feature creep, prioritizing the core requirements.

#### What this implementation covers:

- Single car simulation: reporting a car's final position and orientation.
- Multi-car simulation: detecting and reporting collisions

#### What’s not covered _(but could be in a full product)_:

- Frontend UI: no graphical interface or visualization of car movements.
- Dynamic configuration: no support for runtime editing of cars and fields

#### Suggested review approach

1. **Start with the `README`** <br/> For an overview of the design and key
   assumptions.

2. **Review core modules** <br/> `entities` and `types` underpin the design and
   structure of the implementation.

3. **Check test coverage** <br/> Test results below highlight which features and
   edge cases are covered.

4. **Explore further** <br/> Feel free to run the CLI or examine additional
   modules for more details.

## 🚀 Get Started

### Prerequisites

- node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Run simulations

Input files are located under `/inputs`.

```bash
# Single car simulations
npm run start -- --single

# Multi car simulations
npm run start -- --multi
```

### Run tests

Each module is covered by unit tests that focus on public interfaces, following
a minimalist and results-oriented testing philosophy. Integration tests are also
included to verify end-to-end interactions.

```bash
npm run test
```

## 🏗️ Architecture

```
src
|
+-- entities
|   |
|   +-- Car.ts                  // Car representation (position, movement, direction)
|   +-- Field.ts                // Field representation and bounds
|
+-- types                       // Shared type definitions (Position, Direction, Command)
|
+-- utils
|   |
|   +-- parser.ts               // Input parsing and validation
|   +-- simulateMultiCars.ts    // Multi-car simulation and collision detection
|   +-- simulateSingleCar.ts    // Single car simulation
|
+-- index.ts                    // CLI entry point
```

## 💭 Key Assumptions

- **Input Validation**

  - Inputs are expected to be reasonably well-formed text files.
  - Validation focuses on syntax (e.g. valid directions, commands, field
    dimensions), not on handling arbitrary or nonsensical input (e.g. random
    words or symbols).

- **Collision Handling**

  - The simulation does not account for movement order or car stacking. All cars
    move simultaneously each step.
  - Transition states (e.g. two cars swapping places in one step) are not
    considered collisions. Only direct overlap is detected.
  - A collision is defined strictly as two or more cars intending to occupy the
    same grid cell in the next move.

- **Simulation Halting**

  - If any collision occurs, the simulation stops immediately even if other cars
    could continue moving.
  - If multiple collisions happen in the same step, all are reported together.

- **Field and Movement**

  - The field is a bounded, zero-indexed grid. Cars cannot move outside its
    limits.
  - Car commands are limited to turning left/right and moving forward.

- **Single-Step Execution**

  - In multi-car mode, all cars execute one command per step in parallel.

## 🧪 Test Results

```
npm run test

> self-driving@1.0.0 test
> jest

 PASS  tests/entities/Field.test.ts
  Field
    isWithinBounds
      ✓ returns true for positions inside bounds (5 ms)
      ✓ returns false for positions outside bounds (1 ms)

 PASS  tests/entities/Car.test.ts
  Car
    getIntendedPosition
      ✓ returns correct position for movement within bounds (4 ms)
      ✓ returns current position for movement out of bounds
      ✓ returns current position for rotation (1 ms)
    executeCommand
      ✓ moves forward within bounds
      ✓ does not move forward out of bounds (1 ms)
      ✓ rotates left
      ✓ rotates right (1 ms)

 PASS  tests/utils/parser.test.ts
  parseSingleCarInput
    ✓ parses a valid single car input (5 ms)
    ✓ throws on too few lines (11 ms)
    ✓ throws on invalid field size (1 ms)
    ✓ throws on invalid car position
    ✓ throws on invalid direction (1 ms)
    ✓ throws on invalid command character
  parseMultiCarInput
    ✓ parses valid multi-car input (1 ms)
    ✓ throws on too few lines
    ✓ throws on invalid car position
    ✓ throws on invalid direction (1 ms)
    ✓ throws on invalid command character
    ✓ throws on empty car ID (1 ms)
    ✓ throws on incomplete car definition
    ✓ throws on duplicate car IDs (1 ms)
    ✓ throws on car position collision

 PASS  tests/utils/simulteSingleCar.test.ts
  simulateSingleCar
    ✓ returns final position and direction for valid input (4 ms)
    ✓ handles moving out of bounds (car stays in place)
    ✓ handles rotation only
    ✓ returns error message for invalid input (too few lines) (9 ms)
    ✓ returns error message for invalid command (1 ms)
    ✓ returns error message for invalid direction
    ✓ returns error message for car out of bounds (1 ms)
    ✓ returns error message for invalid field size

 PASS  tests/utils/simulateMultiCars.test.ts
  simulateMultiCar
    ✓ returns "no collision" when cars never collide (6 ms)
    ✓ detects a collision at the first step (1 ms)
    ✓ detects a collision at a later step
    ✓ detects multiple collisions at the same step
    ✓ handles cars with different command lengths (1 ms)
    ✓ returns error message for invalid input (too few lines) (1 ms)
    ✓ returns error for invalid command
    ✓ returns error message for invalid direction
    ✓ returns error for car out of bounds (1 ms)
    ✓ returns error for duplicate car IDs
    ✓ returns error for initial position collision (1 ms)

-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |     100 |      100 |     100 |     100 |
 entities              |     100 |      100 |     100 |     100 |
  Car.ts               |     100 |      100 |     100 |     100 |
  Field.ts             |     100 |      100 |     100 |     100 |
 types                 |     100 |      100 |     100 |     100 |
  index.ts             |     100 |      100 |     100 |     100 |
 utils                 |     100 |      100 |     100 |     100 |
  parser.ts            |     100 |      100 |     100 |     100 |
  simulateMultiCars.ts |     100 |      100 |     100 |     100 |
  simulateSingleCar.ts |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|-------------------
Test Suites: 5 passed, 5 total
Tests:       43 passed, 43 total
Snapshots:   0 total
Time:        2.186 s
Ran all test suites.
```
