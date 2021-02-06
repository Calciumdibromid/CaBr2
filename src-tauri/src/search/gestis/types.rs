use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub struct ParsedData {
  pub molecular_formula: String,
  pub melting_point: Option<String>,
  pub boiling_point: Option<String>,
  pub water_hazard_class: Option<String>,
  pub h_phrases: Option<Vec<(String, String)>>,
  pub p_phrases: Option<Vec<(String, String)>>,
  pub signal_word: Option<String>,
  pub symbols: Option<Vec<Image>>,
  pub lethal_dose: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct Image {
  pub src: String,
  pub alt: String,
}

#[derive(Debug, Deserialize)]
pub struct GestisResponse {
  #[serde(rename = "zvgnummer_mit_null")]
  pub zvg_number: String,
  pub name: String,
  #[serde(rename = "hauptkapitel")]
  pub chapters: Vec<Chapter>,
}

#[derive(Debug, Deserialize)]
pub struct Chapter {
  #[serde(rename = "drnr")]
  pub dr_number: String,
  #[serde(rename = "unterkapitel")]
  pub subchapters: Vec<Subchapter>,
}

#[derive(Debug, Deserialize)]
pub struct Subchapter {
  #[serde(rename = "drnr")]
  pub dr_number: String,
  pub text: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum SearchType {
  ChemicalName,
  Numbers,
  EmpiricalFormula,
  FullText,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchArgument {
  pub search_type: SearchType,
  pub pattern: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchArguments {
  #[serde(default)]
  pub exact: bool,
  pub arguments: Vec<SearchArgument>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResponse {
  #[serde(rename(deserialize = "zvg_nr"))]
  pub zvg_number: String,
  #[serde(rename(deserialize = "cas_nr"))]
  pub cas_number: Option<String>,
  pub name: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Data<T> {
  data: T,
  modified: bool,
}

impl<T> Data<T> {
  pub fn new(data: T) -> Data<T> {
    Data {
      data,
      modified: false,
    }
  }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceData {
  pub molecular_formula: Data<String>,
  pub melting_point: Data<Option<String>>,
  pub boiling_point: Data<Option<String>>,
  pub water_hazard_class: Data<Option<String>>,
  pub h_phrases: Data<Vec<(String, String)>>,
  pub p_phrases: Data<Vec<(String, String)>>,
  pub signal_word: Data<Option<String>>,
  pub symbols: Data<Vec<Image>>,
  pub lethal_dose: Data<Option<String>>,
}
