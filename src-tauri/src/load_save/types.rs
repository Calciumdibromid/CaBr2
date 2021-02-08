use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use super::error::Result;
use crate::types::SubstanceData;

pub trait Loader {
  fn load_document(&self, filename: PathBuf) -> Result<CaBr2Document>;
}

pub trait Saver {
  fn save_document(&self, filename: PathBuf, document: CaBr2Document) -> Result<()>;
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Header {
  document_title: String,
  organisation: String,
  lab_course: String,
  name: String,
  place: String,
  assistant: String,
  preparation: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CaBr2Document {
  header: Header,
  substance_data: Vec<SubstanceData>,
  human_and_environment_danger: Vec<String>,
  rules_of_conduct: Vec<String>,
  in_case_of_danger: Vec<String>,
  disposal: Vec<String>,
}
