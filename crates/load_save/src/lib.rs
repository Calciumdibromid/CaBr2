#![allow(clippy::new_without_default)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::upper_case_acronyms)]

pub mod error;
pub mod handler;
pub mod types;

#[cfg(feature = "beryllium")]
mod beryllium;
#[cfg(feature = "cabr2")]
mod cabr2;
#[cfg(feature = "pdf")]
mod pdf;
