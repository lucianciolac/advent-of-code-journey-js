# Advent of Code - JavaScript

[![Node.js](https://img.shields.io/badge/node-%3E%3D%2020-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Lint](https://github.com/lucianciolac/advent-of-code-journey-js/actions/workflows/lint.yml/badge.svg)](https://github.com/lucianciolac/advent-of-code-journey-js/actions/workflows/lint.yml)
[![Tests](https://github.com/lucianciolac/advent-of-code-journey-js/actions/workflows/tests.yml/badge.svg)](https://github.com/lucianciolac/advent-of-code-journey-js/actions/workflows/tests.yml)

## About

My JavaScript solutions for **Advent of Code**.

I use this repository to:

- Stay sharp with **JavaScript** and **algorithms**
- Share solutions for anyone looking for **inspiration**

## Solution Philosophy

- Uses **procedural**, **imperative**, and **functional** approaches
- Focuses on **performance** without sacrificing clarity
- Prioritizes **readability** over clever but obscure one-liners

## Notes

- Each solution is a **single-file Node.js program** that relies only on **Node** and a **local input file**. All logic is **self-contained**, making the code easy to read without navigating across multiple files.
- Follows **[Advent of Code 2025](https://adventofcode.com/2025/about)** sharing guidelines (no puzzle text, no personal inputs)

## Requirements

- **Node.js**: >= 20

## Setup

To enable `npm run aoc:prepare`, create a `.env` file (copy from `.env.example`) with:

- `AOC_SESSION`: your AoC session cookie value (without the `session=` prefix)
- `AOC_USER_AGENT`: your email or GitHub account (per AoC automation guidelines)

## Scripts

### `npm run aoc:prepare` (bootstrap a day)

Creates `<year>/day_<DD>/`, downloads the puzzle input, and prepares solution files.

- Creates: `<year>/day_<DD>/`
- Writes: `input.txt` (**overwrites every run**)
- Writes (if missing): `part1.js`, `part2.js`

**Usage**

```bash
# Uses AoC today in America/New_York when in the event window
npm run aoc:prepare

# Day only
npm run aoc:prepare -- 1

# Day + year
npm run aoc:prepare -- 1 2025
```

Notes:

- The `day` argument accepts `1` or `01` (it’s normalized to `day_01`).

### `npm run run:day` (execute a single day)

Runs the `part1.js` and `part2.js` files for a single day.

**Usage**

```bash
# Run both parts (defaults to latest discovered year)
npm run run:day -- 1

# Run both parts for a specific year
npm run run:day -- 1 2025

# Run a single part (1 or 2)
npm run run:day -- 1 2025 2
```

### `npm run run:all` (execute all solutions)

Runs every existing `part1.js` / `part2.js` found under `./<year>/day_<DD>/` in order, and stops on the first failure.

```bash
npm run run:all
```
