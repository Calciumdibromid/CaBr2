# Contribution Guidelines

## Introduction

This document explains how to contribute to the CaBr2 project.

You can contribute in many different ways, not only by providing code.
We need your help translating CaBr2 or our [website](https://codeberg.org/Calciumdibromid/website)
into other languages (see [Translation](#translation)).
If you're an artist you can also help us by creating logos, background images or stickers
(see <https://codeberg.org/Calciumdibromid/CaBr2_icon>).

You're also welcome to talk to us about any other ideas in our [Matrix channel](https://matrix.to/#/#cabr2:obermui.de).


## Translation

We do all translation work using [Weblate](https://translate.codeberg.org/engage/cabr2/).
The only translation that is maintained in this git repository is
[`en_us.json`](https://github.com/Calciumdibromid/CaBr2/blob/develop/translations/en_us.json)
and is synced automatically by Weblate. Once we decide a translation has reached
A SATISFACTORY PERCENTAGE it will be synced back into this repo and
included in the next released version.


## Software Setup

We are primarily using [VSCodium](https://vscodium.com/) as our IDE for Rust and Angular.
VSCodium is an FOSS alternative to VSCode, with all proprietary stuff, like telemetry, removed.

It is advisable to install the following extensions:

* [EditorConfig for VS Code](https://open-vsx.org/vscode/item?itemName=EditorConfig.EditorConfig): adds support for the [EditorConfig format](https://EditorConfig.org)
* [rust-analyzer](https://open-vsx.org/vscode/item?itemName=rust-lang.rust-analyzer): Rust integration for VSCode
* [CodeLLDB](https://open-vsx.org/vscode/item?itemName=vadimcn.vscode-lldb): debugging for Rust
* [Angular Language Service](https://open-vsx.org/vscode/item?itemName=Angular.ng-template): Angular integration for VSCode
* [Prettier - Code formatter](https://open-vsx.org/vscode/item?itemName=esbenp.prettier-vscode): formatting for frontend code
* [ESLint](https://open-vsx.org/vscode/item?itemName=dbaeumer.vscode-eslint): linting integration for frontend code

For the software setup that is required have a look at these READMEs:

* [frontend (Tauri app and SPA)](./frontend/README.md#development-requirements)
* [webserver/crates](./webserver/README.md#build)

You can also use [IntelliJ](https://www.jetbrains.com/idea/) with the [IntelliJ-Rust plugin](https://www.jetbrains.com/rust/),
but we don't know how well this works and can't provide any support.


## Building

For detailed instructions on how to build the different parts of this project see the related READMEs:

* [Tauri app](./frontend/README.md#build)
* [SPA](./frontend/README.md#build-1)
* [webserver](./webserver/README.md#build)


## Testing

Before submitting a pull request, run all the tests for the whole tree
to make sure your changes don't cause regression elsewhere.

Here's how to run the test suite:

- code lint

|                                 |                                                                                      |
| :------------------------------ | :----------------------------------------------------------------------------------- |
|`yarn lint`                      | lint frontend code                                                                   |
|`yarn prettier -c src`           | check if frontend files are formatted correctly                                      |
|`cargo lint`                     | lint Rust files (must be called in a Rust source folder)                             |
|`cargo fmt --check`              | check if Rust files are formatted correctly (must be called in a Rust source folder) |

- run tests

|              |                 |
| :----------- | :-------------- |
| `yarn test`  | test frontend   |
| `cargo test` | test Rust crate |

For more information read the README in the folder of the specific component you are working on.


## Frontend/Angular

- all frontend-related code is in `src` folder
- imports should be arranged like this with empty lines in between:
  1. external libraries/browser builtins
  2. own modules
- imports should be sorted alphabetically
- use style defined in prettierrc:
  - always use trailing commas
  - use single quotes
  - use 2 spaces to indent code
  - ...

## Backend/Rust

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
After v1.0 one release every 6 months (bugfixes excluded).

We use [semantic versioning](https://semver.org/).
