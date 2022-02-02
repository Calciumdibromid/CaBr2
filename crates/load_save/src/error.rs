use serde::{Serialize, Serializer};
use thiserror::Error;

use error_ser::SerializableError;

#[derive(Error, Debug)]
pub enum LoadSaveError {
  #[error("unknown file type")]
  UnknownFileType(String),

  #[error("file already exists: '{0}'")]
  FileExists(String),

  #[error(transparent)]
  IOError(#[from] std::io::Error),

  #[cfg(feature = "beryllium")]
  #[error(transparent)]
  BerylliumError(#[from] crate::beryllium::BerylliumError),

  #[cfg(feature = "cabr2")]
  #[error(transparent)]
  Cabr2Error(#[from] crate::cabr2::Cabr2Error),

  #[cfg(feature = "pdf")]
  #[error(transparent)]
  PdfError(#[from] crate::pdf::PdfError),
}

impl Serialize for LoadSaveError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match self {
      LoadSaveError::UnknownFileType(value) => {
        SerializableError::with_message("UnknownFileType", value).serialize(serializer)
      }
      LoadSaveError::FileExists(value) => SerializableError::with_message("FileExists", value).serialize(serializer),
      LoadSaveError::IOError(err) => SerializableError::with_message("IOError", err).serialize(serializer),

      #[cfg(feature = "beryllium")]
      LoadSaveError::BerylliumError(err) => err.serialize(serializer),
      #[cfg(feature = "cabr2")]
      LoadSaveError::Cabr2Error(err) => err.serialize(serializer),
      #[cfg(feature = "pdf")]
      LoadSaveError::PdfError(err) => err.serialize(serializer),
    }
  }
}

pub type Result<T> = std::result::Result<T, LoadSaveError>;
