use thiserror::Error;

#[derive(Error, Debug)]
pub enum SearchError {
  // should never occur in the wild
  #[error("already logged")]
  Logged,

  #[error("unknown provider: {0}")]
  UnknownProvider(String),

  #[error("rate limited by server")]
  RateLimit,

  #[error("request error: {0}")]
  RequestError(u16),

  #[error("no xml found")]
  NoXML,

  // the value is explicitly empty
  #[error("no value")]
  Empty,

  #[error("missing information: {0}")]
  MissingInfo(String),

  #[error("more values than expected")]
  Multiple(String),

  #[error("parsing json failed")]
  JsonError(#[from] serde_json::Error),
  #[cfg(feature = "gestis")]
  #[error("parsing xml failed")]
  XmlError(roxmltree::Error),
  #[error("io error")]
  IOError(#[from] std::io::Error),
}

#[cfg(feature = "gestis")]
impl From<roxmltree::Error> for SearchError {
  #[inline]
  fn from(e: roxmltree::Error) -> Self {
    SearchError::XmlError(e)
  }
}

pub type Result<T> = std::result::Result<T, SearchError>;
