use thiserror::Error;

#[derive(Error, Debug)]
pub enum SearchError {
  #[error("rate limited by server")]
  RateLimit,

  #[error("request error: {0}")]
  RequestError(u16),

  #[error("parsing json failed")]
  JsonError(#[from] serde_json::Error),
  #[error("io error")]
  IOError(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, SearchError>;
