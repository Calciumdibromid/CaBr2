use serde::{ser::SerializeStruct, Serialize, Serializer};
use thiserror::Error;

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
      LoadSaveError::UnknownFileType(value) => serialize_string(serializer, "unknownFileType", value),
      LoadSaveError::FileExists(value) => serialize_string(serializer, "fileExists", value),
      LoadSaveError::IOError(err) => serialize_string(serializer, "ioError", err),

      _ => self.serialize(serializer),
    }
  }
}

fn serialize_string<S: Serializer, ST: ToString>(
  ser: S,
  name: &'static str,
  field_value: ST,
) -> std::result::Result<S::Ok, S::Error> {
  let mut st = ser.serialize_struct("Error", 1)?;
  st.serialize_field(name, &field_value.to_string())?;
  st.end()
}

pub type Result<T> = std::result::Result<T, LoadSaveError>;
