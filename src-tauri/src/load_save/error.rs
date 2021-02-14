use thiserror::Error;

#[derive(Error, Debug)]
pub enum LoadSaveError {
    #[error("unknown file type")]
    UnknownFileType,

    #[error("failed to load file: '{0}'")]
    DeserializeError(String),

    #[error("parsing json failed: '{0}'")]
    JsonError(#[from] serde_json::Error),
    #[error("io error: '{0}'")]
    IOError(#[from] std::io::Error),

    #[error("render document failed: '{0}'")]
    RenderError(String),
}

pub type Result<T> = std::result::Result<T, LoadSaveError>;
