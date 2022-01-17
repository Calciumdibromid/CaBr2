# CaBr2 WASM Library

This is the CaBr2 WASM library.
It is written in Rust with [`wasm-bindgen`](https://lib.rs/crates/wasm-bindgen).

In the `src/impls` folder is the glue code for the CaBr2 core logic.

## Build

In order to build the WASM bindings you must first install [rust](https://www.rust-lang.org/tools/install)
and [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/).
You can install them via your package manager or from the links above.
`wasm-pack` can also be installed via cargo after you installed Rust:

```bash
cargo install wasm-pack
```

The WASM binaries can be built in two flavours: an optimized version that is small or an debug version that can also
display stack traces.

These two `yarn` commands are available:

```bash
# optimized version
yarn wasm_lib:release

# debug buid
yarn wasm_lib:debug
```

Normally you just have to run the `yarn` commands but if you want to build them manually these are the commands:

```bash
# optimized version
wasm-pack build --out-dir ../cabr2_wasm --release

# debug buid
wasm-pack build --out-dir ../cabr2_wasm --dev -- --features debug_build
```

### Code Checking

We use `clippy` for lints and `cargo fmt` to check the formatting of the code:

```bash
cargo clippy --all-features -- --deny clippy::all
cargo fmt
```
