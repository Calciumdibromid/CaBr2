# CaBr2 Angular Application

This is the UI application of CaBr2.
It is written in [Angular](https://angular.io/) with [TypeScript](https://www.typescriptlang.org/).

It can be build in two different ways: As a [Tauri](https://tauri.studio) desktop application and as web application
with a WASM implementation.

In the `src` folder is the Angular source code.

In the [`src-tauri`](src-tauri) folder is the Tauri source code.

In the [`src-wasm`](src-wasm) folder is the WASM glue code for the CaBr2 core logic.

## Development requirements

> Using Windows for development is not recommended, because it isn't tested and all of us use Linux so we most likely
> can't help you when you have problems.

> It is recommended to use your system's package manager for each of these.
> For Windows you can use [chocolatey](https://chocolatey.org/).

1. Install [Rust](https://www.rust-lang.org/tools/install)
2. Install [Node.js](https://nodejs.org) and [yarn](https://yarnpkg.com/getting-started/install)
3. Set up the Tauri development environment by following their [guide](https://tauri.studio/docs/get-started/intro)
   (This is only needed if you want to build the desktop app).
4. (optional) If you want to generate PDFs have a look at the [wkhtmltopdf](#wkhtmltopdf) section.

Jump to the corresponding section to learn how to build this project:

[Tauri Application](#tauri-app)  
[Standalone Web Application](#web-app)  

## Tauri App

[Tauri](https://tauri.studio) is an alternative to [Electron](https://www.electronjs.org/) that enables us to build
smaller apps and write a Rust backend.
It is now out of beta, but because of wkhtmltopdf not everything works at the moment.
We advise you to use the web app until we removed the dependency on wkhtmltopdf.

### Develop

First you have to install all npm dependencies:

```bash
yarn install
```

To start the Angular application in development mode run:

```bash
yarn start
```

Wait until the above command finishes (it says something like: `Angular Live Development Server is listening on
localhost:4200`) and then run the following command to start Tauri in development mode:

```bash
yarn tauri:dev
```

### Build

To build the Tauri app in release mode you must first install the npm dependencies:

```bash
yarn install --force --frozen-lockfile
```

Then you just have to run:

```bash
yarn build:release
```

> This step most likely fails on Linux. We are trying to fix the problem but haven't found a solution yet.

## Web App

### Develop

You first have to compile the wasm binary. For instructions how to do this have a look at the [README in the `src-wasm`
folder](src-wasm/README.md).

Then install all npm dependencies:

```bash
yarn install
```

To start the Angular application in development mode run:

```bash
yarn start:web
```

When the command finishes you can open <http://localhost:4200> in your Browser.

### Build

To build the Web app in release mode you must first install the npm dependencies:

```bash
yarn install --force --frozen-lockfile
```

Then you just have to run:

```bash
yarn build:web
```

## wkhtmltopdf

> We will soon(tm) switch to another method of generating PDFs

We generate the PDFs from html templates using `wkhtmltopdf`, so you have to install
[`wkhtmltox`](https://wkhtmltopdf.org/downloads.html).
