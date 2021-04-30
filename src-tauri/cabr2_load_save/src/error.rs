use serde::{Serialize, Serializer};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum LoadSaveError {
  #[error("unknown file type")]
  UnknownFileType,

  #[error("failed to load file: '{0}'")]
  DeserializeError(String),

  #[error("file already exists: '{0}'")]
  FileExists(String),

  #[error("merging of pdfs failed: '{0}'")]
  PdfMergeError(String),

  #[error("creating template failed: '{0}'")]
  TemplateError(#[from] handlebars::TemplateFileError),
  #[error("rendering document failed: '{0}'")]
  RenderError(#[from] handlebars::RenderError),
  #[error("PDF creation failed: {0}")]
  PdfError(#[from] wkhtmltopdf::Error),
  #[error("parsing json failed: '{0}'")]
  JsonError(#[from] serde_json::Error),
  #[error("io error: '{0}'")]
  IOError(#[from] std::io::Error),
}

impl Serialize for LoadSaveError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_str())
  }
}

pub type Result<T> = std::result::Result<T, LoadSaveError>;
