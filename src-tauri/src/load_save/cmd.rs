use std::path::PathBuf;

use serde::Deserialize;

use super::types::CaBr2Document;

#[derive(Debug, Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  #[serde(rename_all = "camelCase")]
  SaveDocument {
    file_type: String,
    filename: PathBuf,
    document: CaBr2Document,
    callback: String,
    error: String,
  },
  LoadDocument {
    filename: PathBuf,
    callback: String,
    error: String,
  },
  GetAvailableDocumentTypes {
    callback: String,
    error: String,
  },
}
