use serde::{Serialize, Serializer};
use thiserror::Error;

use error_ser::SerializableError;

#[derive(Error, Debug)]
pub enum PdfError {
  #[error("merging of pdfs failed: '{0}'")]
  PdfMergeError(String),

  #[error(transparent)]
  TemplateError(Box<handlebars::TemplateError>),

  #[error(transparent)]
  RenderError(#[from] handlebars::RenderError),

  #[error(transparent)]
  Wkhtml(#[from] wkhtmltopdf::Error),

  #[error(transparent)]
  IOError(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, PdfError>;

impl From<handlebars::TemplateError> for PdfError {
  fn from(err: handlebars::TemplateError) -> Self {
    PdfError::TemplateError(Box::new(err))
  }
}

impl Serialize for PdfError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match self {
      PdfError::PdfMergeError(value) => SerializableError::with_message("PdfMergeError", value).serialize(serializer),

      PdfError::TemplateError(err) => SerializableError::with_message("TemplateError", err).serialize(serializer),
      PdfError::RenderError(err) => SerializableError::with_message("RenderError", err).serialize(serializer),
      PdfError::Wkhtml(err) => SerializableError::with_message("Wkhtml", err).serialize(serializer),
      PdfError::IOError(err) => SerializableError::with_message("IOError", err).serialize(serializer),
    }
  }
}
