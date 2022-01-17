# CaBr2 Webserver

This is the CaBr2 REST webserver.
It is a complete implementation of the CaBr2 logic as REST API for use in the web app and possible mobile apps.

In the `src/impl` folder there is the glue code for the CaBr2 logic.

The webserver is written in rust with [`warp`](https://lib.rs/crates/warp).

## Build

In order to build the webserver you must first install [rust](https://www.rust-lang.org/tools/install).

If you want to generate PDFs hava a look at the
[wkhtmltopdf section in the frontend README](../frontend/README.md#wkhtmltopdf)

The webserver can be built with all features with the following command:

```bash
cargo build --release
```

If you only want specific features use the following command and add a space separated list of the features you want
after `--features`:

```bash
cargo build --no-default-features --features "portable pdf"
```

These features are available:

| Name         | Explanation                                                                     |
|--------------|---------------------------------------------------------------------------------|
| `portable`   | the config and all required assets are located in the same folder as the binary |
| `beryllium`  | the Beryllium10 file reader                                                     |
| `cabr2`      | load and save CaBr2 files                                                       |
| `pdf`        | export the safety datasheet as PDF                                              |
| `gestis`     | search for substances in the Gestis database                                    |

## Code Checking

We use `clippy` for lints and `cargo fmt` to check the formatting of the code:

```bash
cargo clippy --all-features -- --deny clippy::all
cargo fmt
```
