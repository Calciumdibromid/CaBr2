use std::fmt::Debug;

use serde::{Serialize, Serializer};
use thiserror::Error;

use error_ser::SerializableError;

#[derive(Error, Debug)]
pub enum GestisError {
  #[error("missing information: {0}")]
  MissingInfo(&'static str),

  #[error("rate limited")]
  RateLimit,

  #[error("unexpected event: {0}")]
  UnexpectedEvent(String),

  #[error(transparent)]
  RequestError(#[from] reqwest::Error),
  #[error(transparent)]
  XmlError(#[from] quick_xml::Error),
  #[error(transparent)]
  IOError(#[from] std::io::Error),
}

impl Serialize for GestisError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match self {
      GestisError::MissingInfo(value) => SerializableError::with_message("MissingInfo", value).serialize(serializer),
      GestisError::UnexpectedEvent(value) => {
        SerializableError::with_message("UnexpectedEvent", value).serialize(serializer)
      }

      GestisError::RequestError(err) => SerializableError::with_message("RequestError", err).serialize(serializer),
      GestisError::XmlError(err) => SerializableError::with_message("XmlError", err).serialize(serializer),
      GestisError::IOError(err) => SerializableError::with_message("IOError", err).serialize(serializer),

      GestisError::RateLimit => SerializableError::new("RateLimit").serialize(serializer),
    }
  }
}

pub type Result<T> = std::result::Result<T, GestisError>;
