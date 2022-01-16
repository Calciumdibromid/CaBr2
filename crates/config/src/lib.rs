#![allow(clippy::upper_case_acronyms)]

pub mod error;
pub mod handler;
pub mod types;

pub use crate::types::{BackendConfig, GHSSymbols};
pub use handler::{get_hazard_symbols, read_config, DATA_DIR, TMP_DIR};
