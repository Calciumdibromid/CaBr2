use std::default::Default;

use chrono::TimeZone;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use cabr2_types::{Source, SubstanceData};

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

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PDFSubstanceData {
  name: Data<String>,
  alternative_names: Vec<String>,
  cas: Data<Option<String>>,
  molecular_formula: Data<String>,
  molar_mass: Data<Option<String>>,
  melting_point: Data<Option<String>>,
  boiling_point: Data<Option<String>>,
  water_hazard_class: Data<Option<String>>,
  pub h_phrases: Data<Vec<(String, String)>>,
  pub p_phrases: Data<Vec<(String, String)>>,
  signal_word: Data<Option<String>>,
  symbols: Data<Vec<String>>,
  lethal_dose: Data<Option<String>>,
  mak: Data<Option<String>>,
  amount: Option<Amount>,
  pub source: Source,
}

#[derive(Debug, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Data<T> {
  pub data: T,
  modified: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Amount {
  pub value: String,
  pub unit: String,
}

impl std::default::Default for PDFSubstanceData {
  fn default() -> Self {
    lazy_static! {
      static ref BEGINNING_OF_TIME: chrono::DateTime<chrono::Utc> = chrono::Utc.ymd(1970, 1, 1).and_hms(0, 0, 0);
    }

    PDFSubstanceData {
      name: Data::default(),
      alternative_names: Vec::default(),
      cas: Data::default(),
      molecular_formula: Data::default(),
      molar_mass: Data::new(Some("".into())),
      melting_point: Data::new(Some("".into())),
      boiling_point: Data::new(Some("".into())),
      water_hazard_class: Data::new(Some("".into())),
      h_phrases: Data::default(),
      p_phrases: Data::default(),
      signal_word: Data::default(),
      symbols: Data::default(),
      lethal_dose: Data::new(Some("".into())),
      mak: Data::new(Some("".into())),
      amount: None,
      source: Source {
        provider: String::default(),
        url: String::default(),
        last_updated: BEGINNING_OF_TIME.clone(),
      },
    }
  }
}

impl std::convert::From<CaBr2Document> for PDFCaBr2Document {
  fn from(doc: CaBr2Document) -> Self {
    PDFCaBr2Document {
      header: doc.header,
      substance_data: {
        let mut substances: Vec<PDFSubstanceData> = doc.substance_data.into_iter().map(|s| s.into()).collect();
        for _ in substances.len()..4 {
          substances.push(PDFSubstanceData::default());
        }
        substances.push(PDFSubstanceData::default());
        substances
      },
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
      amount: match data.amount {
        Some(amount) => Some(amount.into()),
        None => None,
      },
      source: data.source,
    }
  }
}

impl std::convert::From<cabr2_types::Amount> for Amount {
  fn from(amount: cabr2_types::Amount) -> Self {
    Amount {
      unit: match amount.unit {
        cabr2_types::Unit::Litre => "l".into(),
        cabr2_types::Unit::Milliliter => "ml".into(),
        cabr2_types::Unit::Microlitre => "µl".into(),
        cabr2_types::Unit::Gram => "g".into(),
        cabr2_types::Unit::Milligram => "mg".into(),
        cabr2_types::Unit::Microgram => "µg".into(),
        cabr2_types::Unit::Pieces => "st".into(),
        cabr2_types::Unit::SolutionRelative => "% (v/v)".into(),
        cabr2_types::Unit::SolutionMol => "mol/l".into(),
        cabr2_types::Unit::SolutionMillimol => "mmol/l".into(),
        cabr2_types::Unit::SolutionMicromol => "µmol/l".into(),
        cabr2_types::Unit::Custom(unit) => unit,
      },
      value: amount.value,
    }
  }
}

impl<T> Data<T> {
  pub fn new(data: T) -> Data<T> {
    Data { data, modified: false }
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
