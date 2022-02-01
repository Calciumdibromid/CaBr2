use serde::{Serialize, Serializer};
use thiserror::Error;

use error_ser::SerializableError;

#[derive(Error, Debug)]
pub enum BerylliumError {
  #[error(transparent)]
  DeserializeError(#[from] quick_xml::DeError),
}

impl Serialize for BerylliumError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match self {
      BerylliumError::DeserializeError(err) => {
        SerializableError::with_message("DeserializeError", err).serialize(serializer)
      }
    }
  }
}
