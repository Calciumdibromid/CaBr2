use cabr2_types::ProviderMapping;

pub use crate::types::{CaBr2Document, DocumentTypes};
use crate::{
  error::Result,
  handler::{self, init_handlers},
};

pub async fn init(provider_mapping: ProviderMapping) {
  init_handlers(provider_mapping).await
}

pub async fn save_document(file_type: String, document: CaBr2Document) -> Result<Vec<u8>> {
  handler::save_document(&file_type, document).await
}

pub async fn load_document(file_type: String, file: Vec<u8>) -> Result<CaBr2Document> {
  handler::load_document(&file_type, file).await
}

pub async fn get_available_document_types() -> DocumentTypes {
  handler::get_available_document_types().await
}
