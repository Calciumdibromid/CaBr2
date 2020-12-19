use thiserror::Error;

#[derive(Error, Debug)]
pub enum SearchError {
  #[error("invalid search pattern")]
  InvalidPattern,

  /// Represents all other cases of `std::io::Error`.
  #[error(transparent)]
  IOError(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, SearchError>;
