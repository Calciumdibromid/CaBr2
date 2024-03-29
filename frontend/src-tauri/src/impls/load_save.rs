use std::path::PathBuf;

use tauri::{plugin::Plugin, Invoke, Runtime, Window};
use tokio::fs;

use load_save::{
  error::{LoadSaveError, Result},
  handler,
  types::{CaBr2Document, DocumentTypes},
};
use types::ProviderMapping;

#[tauri::command]
pub async fn save_document(file_type: String, filename: PathBuf, document: CaBr2Document) -> Result<()> {
  log::debug!("type: {}", file_type);
  log::debug!("filename: {:?}", filename);
  log::trace!("doc: {:#?}", document);

  let mut filename = filename;
  let mut filename_changed = false;
  if let Some(ext) = filename.extension() {
    if ext.to_str().unwrap() != file_type {
      let mut name = filename.file_name().unwrap().to_owned();
      name.push(".");
      name.push(&file_type);
      filename = filename.with_file_name(&name);
      filename_changed = true;
    }
  } else {
    filename.set_extension(&file_type);
    filename_changed = true;
  }

  if filename_changed {
    log::debug!("filename changed: {:?}", filename);
    if filename.exists() {
      return Err(LoadSaveError::FileExists(filename.to_string_lossy().into()));
    }
  }

  let res = handler::save_document(file_type.as_str(), document).await?;

  let res = fs::write(&filename, res).await;

  if res.is_err() {
    log::warn!("failed to write file '{:?}': {:?}", filename, res);
  }

  Ok(res?)
}

#[tauri::command]
pub async fn load_document(filename: PathBuf) -> Result<CaBr2Document> {
  log::debug!("filename: {:?}", filename);

  let contents = fs::read(&filename).await;

  if contents.is_err() {
    log::warn!("failed to read file '{:?}': {:?}", filename, contents);
  }

  handler::load_document(
    filename.extension().unwrap_or_default().to_str().unwrap_or_default(),
    contents?,
  )
  .await
}

#[tauri::command]
pub async fn get_available_document_types() -> DocumentTypes {
  handler::get_available_document_types().await
}

pub struct LoadSave<R: Runtime> {
  invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync>,
}

impl<R: Runtime> LoadSave<R> {
  pub async fn new(provider_mapping: ProviderMapping) -> Self {
    handler::init_handlers(provider_mapping).await;
    LoadSave {
      invoke_handler: Box::new(tauri::generate_handler![
        save_document,
        load_document,
        get_available_document_types,
      ]),
    }
  }
}

impl<R: Runtime> Plugin<R> for LoadSave<R> {
  fn name(&self) -> &'static str {
    "cabr2_load_save"
  }

  fn extend_api(&mut self, message: Invoke<R>) {
    (self.invoke_handler)(message)
  }

  fn created(&mut self, _: Window<R>) {
    log::trace!("plugin created");
  }
}
