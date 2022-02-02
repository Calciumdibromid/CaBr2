use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug, Serialize)]
pub enum SearchError {
  #[error("unknown provider: {0}")]
  UnknownProvider(String),

  #[cfg(feature = "gestis")]
  #[error(transparent)]
  Gestis(#[from] crate::gestis::GestisError),
}

pub type Result<T> = std::result::Result<T, SearchError>;
