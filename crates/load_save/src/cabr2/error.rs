use serde::{Serialize, Serializer};
use thiserror::Error;

use error_ser::SerializableError;

#[derive(Error, Debug)]
pub enum Cabr2Error {
  #[error(transparent)]
  JsonError(#[from] serde_json::Error),
}

impl Serialize for Cabr2Error {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match self {
      Cabr2Error::JsonError(err) => SerializableError::with_message("JsonError", err).serialize(serializer),
    }
  }
}
