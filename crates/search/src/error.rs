use serde::Serialize;
use thiserror::Error;

use crate::gestis::error::GestisError;

#[derive(Error, Debug, Serialize)]
pub enum SearchError {
  #[error("unknown provider: {0}")]
  UnknownProvider(String),

  #[cfg(feature = "gestis")]
  #[error(transparent)]
  Gestis(#[from] GestisError),
}

pub type Result<T> = std::result::Result<T, SearchError>;
