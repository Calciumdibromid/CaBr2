use thiserror::Error;

#[derive(Error, Debug)]
pub enum LoadSaveError {
  #[error("unknown file type")]
  UnknownFileType,

  #[error("parsing json failed")]
  JsonError(#[from] serde_json::Error),
  #[error("io error")]
  IOError(#[from] std::io::Error),
}

pub type Result<T> = std::result::Result<T, LoadSaveError>;
