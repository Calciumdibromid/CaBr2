use thiserror::Error;

#[derive(Error, Debug)]
pub enum LoadSaveError {
  #[error("unknown file type")]
  UnknownFileType,

  #[error("failed to load file: '{0}'")]
  DeserializeError(String),

  #[error("file already exists: '{0}'")]
  FileExists(String),

  #[error("creating template failed: '{0}'")]
  TemplateError(#[from] handlebars::TemplateError),
  #[error("rendering document failed: '{0}'")]
  RenderError(#[from] handlebars::RenderError),
  #[error("PDF creation failed: {0}")]
  PdfError(#[from] wkhtmltopdf::Error),
  #[error("parsing json failed: '{0}'")]
  JsonError(#[from] serde_json::Error),
  #[error("io error: '{0}'")]
  IOError(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, LoadSaveError>;
