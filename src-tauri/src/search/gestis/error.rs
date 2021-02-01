use thiserror::Error;

#[derive(Error, Debug)]
pub enum SearchError {
  #[error("rate limited by server")]
  RateLimit,

  #[error("request error: {0}")]
  RequestError(u16),

  #[error("no xml found")]
  NoXML,

  #[error("no value")]
  // the value is explicitly empty
  Empty,

  #[error("missing information: {0}")]
  MissingInfo(String),

  #[error("more values than expected")]
  Multiple(String),

  #[error("parsing json failed")]
  JsonError(#[from] serde_json::Error),
  #[error("parsing xml failed")]
  XmlError(roxmltree::Error),
  #[error("io error")]
  IOError(#[from] std::io::Error),
}

impl From<roxmltree::Error> for SearchError {
  #[inline]
  fn from(e: roxmltree::Error) -> Self {
    SearchError::XmlError(e)
  }
}

pub type Result<T> = std::result::Result<T, SearchError>;
