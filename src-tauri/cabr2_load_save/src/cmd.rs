use std::path::PathBuf;

use super::{
  error::Result,
  handler,
  types::{CaBr2Document, DocumentTypes},
};

#[tauri::command]
pub fn save_document(file_type: String, filename: PathBuf, document: CaBr2Document) -> Result<()> {
  handler::save_document(file_type, filename, document)
}

#[tauri::command]
pub fn load_document(filename: PathBuf) -> Result<CaBr2Document> {
  handler::load_document(filename)
}

#[tauri::command]
pub fn get_available_document_types() -> Result<DocumentTypes> {
  handler::get_available_document_types()
}
