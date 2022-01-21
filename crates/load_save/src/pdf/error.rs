use serde::{ser::SerializeStruct, Serialize, Serializer};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PdfError {
  #[error("merging of pdfs failed: '{0}'")]
  PdfMergeError(String),

  #[error(transparent)]
  TemplateError(#[from] handlebars::TemplateError),

  #[error(transparent)]
  RenderError(#[from] handlebars::RenderError),

  #[error(transparent)]
  Wkhtml(#[from] wkhtmltopdf::Error),

  #[error(transparent)]
  IOError(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, PdfError>;

impl Serialize for PdfError {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match self {
      PdfError::PdfMergeError(value) => serialize_string(serializer, "pdfMergeError", value),

      PdfError::TemplateError(err) => serialize_string(serializer, "templateError", err),
      PdfError::RenderError(err) => serialize_string(serializer, "renderError", err),
      PdfError::Wkhtml(err) => serialize_string(serializer, "wkhtmltopdfError", err),
      PdfError::IOError(err) => serialize_string(serializer, "ioError", err),
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
