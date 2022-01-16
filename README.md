# CaBr2

[![License: GPL3+](https://img.shields.io/badge/License-GPL3+-blue.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0.en.html)
[![test](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FCalciumdibromid%2FCaBr2%2Fbadge&style=flat-square)](https://github.com/Calciumdibromid/CaBr2/actions/workflows/test.yml)
[![Crowdin](https://badges.crowdin.net/cabr2/localized.svg)](https://crowdin.com/project/cabr2)

Generate "experiment wise safety sheets" in compliance to European law.

## Structure

This project can be built in two ways:

- web front end with webserver and WASM bindings
- Tauri app

From this the folder structure was derived:

| path                  | description                                                                      |
|-----------------------|----------------------------------------------------------------------------------|
| `/`                   | Git repo root with obvious files                                                 |
| `webserver/`          | CaBr2 as REST API implementation                                                 |
| `crates/`             | core CaBr2 implementation that is shared                                         |
| `frontend/`           | Angular application that can be built for Tauri or as standalone web application |
| `frontend/src/`       | Angular sourcecode                                                               |
| `frontend/src-tauri/` | Tauri glue code for CaBr2 logic                                                  |
| `frontend/src-wasm/`  | WASM glue code for CaBr2 logic                                                   |

[Angular Application](frontend)  
[WASM library](frontend/src-wasm)  
[Webserver](webserver)  

## Develop

CaBr2 is a [tauri](https://tauri.studio) project.

Frontend is written in Angular 12 and backend is in Rust.

To start execute `yarn start` to build and serve UI,
execute `yarn tauri:dev` to get the application window.

## Build

You need the tauri-builder. Get it  via `cargo install -f tauri-bundler`.

To convert the html template to a pdf file you need to install `wkhtmltopdf`.
`wkhtmltox` (that can be downloaded from [here](https://wkhtmltopdf.org/downloads.html)) is needed to build the app.

Just execute `build:release` afterwards.

## Translate

Translation is done via [Crowdin](https://crowdin.com/project/cabr2).

to suggest translation improvements or improve support of your own language visit [https://crowdin.com/project/cabr2](https://crowdin.com/project/cabr2).
