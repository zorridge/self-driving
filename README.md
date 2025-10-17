# Auto Driving Car Simulation

My implementation of GIC Application - Take Home Coding Assignment (GIP2026).

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

- **Start with the `README`** <br/> For an overview of the design and key
  assumptions.
- **Review core modules** <br/> `entities` and `types` underpin the design and
  structure of the implementation.
- **Check test coverage** <br/> Screenshots of test results highlight which
  features and edge cases are covered.
- **Explore further** <br/> Feel free to run the CLI or examine additional
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
