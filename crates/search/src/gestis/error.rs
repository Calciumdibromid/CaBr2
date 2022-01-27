use std::fmt::Debug;

use serde::{ser::SerializeStruct, Serialize, Serializer};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum GestisError {
  #[error("no xml found")]
  NoXML,

  // the value is explicitly empty
  #[error("no value")]
  Empty,

  #[error("missing information: {0}")]
  MissingInfo(&'static str),

  #[error("more values than expected")]
  Multiple(&'static str),

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
      GestisError::MissingInfo(value) => serialize_string(serializer, "missingInfo", value),
      GestisError::Multiple(value) => serialize_string(serializer, "multiple", value),
      GestisError::UnexpectedEvent(value) => serialize_string(serializer, "unexpectedEvent", value),

      GestisError::RequestError(err) => serialize_string(serializer, "requestError", err),
      GestisError::XmlError(err) => serialize_string(serializer, "xmlError", err),
      GestisError::IOError(err) => serialize_string(serializer, "ioError", err),

      _ => serialize_string(serializer, "error", &format!("{self}")),
    }
  }
}

fn serialize_string<S: Serializer, ST: Debug>(
  ser: S,
  name: &'static str,
  field_value: ST,
) -> std::result::Result<S::Ok, S::Error> {
  let mut st = ser.serialize_struct("Error", 1)?;
  st.serialize_field(name, &format!("{field_value:?}"))?;
  st.end()
}

pub type Result<T> = std::result::Result<T, GestisError>;
