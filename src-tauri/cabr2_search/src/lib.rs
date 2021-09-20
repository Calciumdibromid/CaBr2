#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::upper_case_acronyms)]

mod error;
pub mod handler;
pub mod types;

#[cfg(all(feature = "gestis", not(feature = "gestis_helper")))]
mod gestis;
#[cfg(feature = "gestis_helper")]
pub mod gestis;

#[cfg(feature = "tauri_plugin")]
pub mod plugin;
#[cfg(feature = "wasm")]
pub mod wasm;
#[cfg(feature = "webserver")]
pub mod webserver;
