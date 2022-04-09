use serde::{Deserialize, Serialize};

use types::{Amount, Source};

use crate::types::CaBr2Document;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase", tag = "version")]
#[allow(clippy::large_enum_variant)]
pub enum CaBr2DocumentFormat {
  #[serde(rename = "1")]
  V1(CaBr2Document),
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CaBr2DocumentV0 {
  pub header: HeaderV0,
  pub substance_data: Vec<SubstanceDataV0>,
  pub human_and_environment_danger: Vec<String>,
  pub rules_of_conduct: Vec<String>,
  pub in_case_of_danger: Vec<String>,
  pub disposal: Vec<String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HeaderV0 {
  pub document_title: String,
  pub organisation: String,
  pub lab_course: String,
  pub name: String,
  pub place: String,
  pub assistant: String,
  pub preparation: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubstanceDataV0 {
  pub name: DataV0<String>,
  pub alternative_names: Vec<String>,
  pub cas: DataV0<Option<String>>,
  pub molecular_formula: DataV0<Option<String>>,
  pub molar_mass: DataV0<Option<String>>,
  pub melting_point: DataV0<Option<String>>,
  pub boiling_point: DataV0<Option<String>>,
  pub water_hazard_class: DataV0<Option<String>>,
  pub h_phrases: DataV0<Vec<(String, String)>>,
  pub p_phrases: DataV0<Vec<(String, String)>>,
  pub signal_word: DataV0<Option<String>>,
  pub symbols: DataV0<Vec<String>>,
  pub lethal_dose: DataV0<Option<String>>,
  pub mak: DataV0<Option<String>>,
  pub amount: Option<Amount>,
  pub source: Source,
  pub checked: bool,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DataV0<T> {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub modified_data: Option<T>,
  pub original_data: T,
}
