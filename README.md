# CaBr2

[![License: GPL3+](https://img.shields.io/badge/License-GPL3+-blue.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0.en.html)
[![status-badge](https://ci.codeberg.org/api/badges/Calciumdibromid/CaBr2/status.svg)](https://ci.codeberg.org/Calciumdibromid/CaBr2)
[![Translation status](https://translate.codeberg.org/widgets/cabr2/-/svg-badge.svg)](https://translate.codeberg.org/engage/cabr2/)
[![Please don't upload to GitHub](https://nogithub.codeberg.page/badge.svg)](https://nogithub.codeberg.page)

Generate "experiment wise safety sheets" in compliance to European law.

<a href="https://codeberg.org/Calciumdibromid/CaBr2"> <img src="assets/get-it-on-blue-on-white.svg" alt="Get It On Codeberg" width="250"/> <a/>

## Description

Calciumdibromid (short: CaBr2) is a free program to generate safety data sheets for experiments in accordance to
Regulation (EC) No 1272/2008 (CLP).

It is written in [Angular](https://angular.io/) and can be either used as a standalone
desktop application or as a SPA with WASM bindings and an API server to
generate PDFs.

## Structure

This project can be built in two ways:

- web front end with webserver and WASM bindings
- [Tauri](https://tauri.studio/) app

From this the folder structure was derived:

| path                  | description                                                                      |
|-----------------------|----------------------------------------------------------------------------------|
| `/`                   | Git repo root with obvious files                                                 |
| `webserver/`          | CaBr2 as REST API implementation                                                 |
| `crates/`             | core CaBr2 implementation that is shared                                         |
| `frontend/`           | Angular application that can be built for Tauri or as standalone web application |
| `frontend/src/`       | Angular source code                                                              |
| `frontend/src-tauri/` | Tauri glue code for CaBr2 logic                                                  |
| `frontend/src-wasm/`  | WASM glue code for CaBr2 logic                                                   |

To learn more about a specific part of this project, go to the corresponding README:

[Angular Application](frontend)  
[WASM library](frontend/src-wasm)  
[Webserver](webserver)  

## Translate

[![Translation Status](https://translate.codeberg.org/widgets/cabr2/-/open-graph.png)](https://translate.codeberg.org/engage/cabr2/)
