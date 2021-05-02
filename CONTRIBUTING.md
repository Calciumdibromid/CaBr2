# Contribution Guidelines

## Introduction

This document explains how to contribute changes to the CaBr2 project.

## Testing redux

Before submitting a pull request, run all the tests for the whole tree
to make sure your changes don't cause regression elsewhere.

Here's how to run the test suite:

- code lint

|                       |                                                                   |
| :-------------------- | :---------------------------------------------------------------- |
|``yarn lint``          | lint frontend code   |
|``yarn prettier -c src`` | check formatiton of frontend files  |
|``cd src-tauri`` and ``cargo clippy``  | lint backend files   |

- run tests (Suggest run in linux)

|                                        |                                                  |
| :------------------------------------- | :----------------------------------------------- |
|``./contrib/for-each-cargo test``|  run `cargo test` for each crate |


## Translation

We do all translation work inside [Crowdin](https://crowdin.com/project/CaBr2).
The only translation that is maintained in this git repository is
[`en_us.json`](https://github.com/Calciumdibromid/CaBr2/blob/develop/translations/en_us.json)
and is synced regularly to Crowdin. Once a translation has reached
A SATISFACTORY PERCENTAGE it will be synced back into this repo and
included in the next released version.


## Building

See the [Readme](README.md)

## Styleguide

## Frontend/Angular

- all frontend-related code is in `src` folder
- imports should be arranged like this with empty lines in between:
  1. external libraries/browser builtins
  2. own modules
- imports should be sorted alphabetically
- use style defined in prettierrc:
  - always use trailing commas
  - use singlequotes
  - use 2 spaces to indent code
  - ...

## Backend/Rust

- all backend-ralated code is in `src-tauri`
- imports should be arranged like this with empty lines in between:
  1. standard library (`std`)
  2. external libraries
  3. internal libraries (prefixed with `cabr2_`)
  4. intra-library imports
- use style defined in `rustfmt.toml`:
  - always use trailing commas
  - use 2 spaces to indent code
  - ...

## Release Cycle

Before v1.0 there will be a release if needed.
After v1.0 one release halve a year (bugfixes excluded).

We use [semantic](https://semver.org/) versioning.
