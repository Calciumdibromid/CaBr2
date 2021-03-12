use serde::Serialize;

use cabr2_types::{Amount, Source, SubstanceData};

use crate::types::{CaBr2Document, Header};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PDFCaBr2Document {
  header: Header,
  substance_data: Vec<PDFSubstanceData>,
  human_and_environment_danger: Vec<String>,
  rules_of_conduct: Vec<String>,
  in_case_of_danger: Vec<String>,
  disposal: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PDFSubstanceData {
  name: Data<String>,
  alternative_names: Vec<String>,
  cas: Data<Option<String>>,
  molecular_formula: Data<String>,
  molar_mass: Data<Option<String>>,
  melting_point: Data<Option<String>>,
  boiling_point: Data<Option<String>>,
  water_hazard_class: Data<Option<String>>,
  h_phrases: Data<Vec<(String, String)>>,
  p_phrases: Data<Vec<(String, String)>>,
  signal_word: Data<Option<String>>,
  symbols: Data<Vec<String>>,
  lethal_dose: Data<Option<String>>,
  mak: Data<Option<String>>,
  amount: Data<Option<Amount>>,
  source: Source,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct Data<T> {
  data: T,
  modified: bool,
}

impl std::convert::From<CaBr2Document> for PDFCaBr2Document {
  fn from(doc: CaBr2Document) -> Self {
    PDFCaBr2Document {
      header: doc.header,
      substance_data: doc.substance_data.into_iter().map(|s| s.into()).collect(),
      human_and_environment_danger: doc.human_and_environment_danger,
      rules_of_conduct: doc.rules_of_conduct,
      in_case_of_danger: doc.in_case_of_danger,
      disposal: doc.disposal,
    }
  }
}

impl std::convert::From<SubstanceData> for PDFSubstanceData {
  fn from(data: SubstanceData) -> Self {
    PDFSubstanceData {
      name: data.name.into(),
      alternative_names: data.alternative_names,
      cas: data.cas.into(),
      molecular_formula: data.molecular_formula.into(),
      molar_mass: data.molar_mass.into(),
      melting_point: data.melting_point.into(),
      boiling_point: data.boiling_point.into(),
      water_hazard_class: data.water_hazard_class.into(),
      h_phrases: data.h_phrases.into(),
      p_phrases: data.p_phrases.into(),
      signal_word: data.signal_word.into(),
      symbols: data.symbols.into(), // TODO fill with actual symbols
      lethal_dose: data.lethal_dose.into(),
      mak: data.mak.into(),
      amount: data.amount.into(),
      source: data.source,
    }
  }
}

impl<T> std::convert::From<cabr2_types::Data<T>> for Data<T> {
  fn from(data: cabr2_types::Data<T>) -> Self {
    match data.modified_data {
      Some(data) => Data { data, modified: true },
      None => Data {
        data: data.original_data,
        modified: false,
      },
    }
  }
}
