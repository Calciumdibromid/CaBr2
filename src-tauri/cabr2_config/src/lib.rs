#![allow(clippy::upper_case_acronyms)]

mod error;
pub mod handler;
mod types;

#[cfg(feature = "tauri_plugin")]
pub mod plugin;

pub use handler::{read_config, TMP_DIR};
pub use types::BackendConfig;
