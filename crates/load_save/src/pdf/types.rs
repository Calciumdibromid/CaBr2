use std::default::Default;

use chrono::TimeZone;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use ::types::{Source, SubstanceData};

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
  cas: Data<String>,
  molecular_formula: Data<String>,
  molar_mass: Data<String>,
  melting_point: Data<String>,
  boiling_point: Data<String>,
  water_hazard_class: Data<String>,
  pub h_phrases: Data<Vec<(String, String)>>,
  pub p_phrases: Data<Vec<(String, String)>>,
  signal_word: Data<String>,
  symbols: Data<Vec<String>>,
  lethal_dose: Data<String>,
  mak: Data<String>,
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

impl PDFSubstanceData {
  pub fn empty(&self) -> bool {
    self.name.data.is_empty()
      && self.cas.data.is_empty()
      && self.molecular_formula.data.is_empty()
      && self.molar_mass.data.is_empty()
      && self.melting_point.data.is_empty()
      && self.boiling_point.data.is_empty()
      && self.water_hazard_class.data.is_empty()
      && self.h_phrases.data.is_empty()
      && self.p_phrases.data.is_empty()
      && self.signal_word.data.is_empty()
      && self.symbols.data.is_empty()
      && self.lethal_dose.data.is_empty()
      && self.mak.data.is_empty()
      && self.amount.is_none()
  }
}

impl std::default::Default for PDFSubstanceData {
  fn default() -> Self {
    lazy_static! {
      static ref BEGINNING_OF_TIME: chrono::DateTime<chrono::Utc> = chrono::Utc.ymd(1970, 1, 1).and_hms(0, 0, 0);
    }

    PDFSubstanceData {
      name: Data::default(),
      cas: Data::default(),
      molecular_formula: Data::default(),
      molar_mass: Data::new("".to_string()),
      melting_point: Data::new("".to_string()),
      boiling_point: Data::new("".to_string()),
      water_hazard_class: Data::new("".to_string()),
      h_phrases: Data::default(),
      p_phrases: Data::default(),
      signal_word: Data::default(),
      symbols: Data::default(),
      lethal_dose: Data::new("".to_string()),
      mak: Data::new("".to_string()),
      amount: None,
      source: Source {
        provider: String::default(),
        url: String::default(),
        last_updated: *BEGINNING_OF_TIME,
      },
    }
  }
}

impl std::convert::From<CaBr2Document> for PDFCaBr2Document {
  fn from(doc: CaBr2Document) -> Self {
    PDFCaBr2Document {
      header: doc.header,
      substance_data: {
        let mut substances: Vec<PDFSubstanceData> = doc
          .substance_data
          .into_iter()
          .map(|s| {
            let s: PDFSubstanceData = s.into();
            if s.empty() {
              PDFSubstanceData::default()
            } else {
              s
            }
          })
          .collect();
        for _ in substances.len()..5 {
          substances.push(PDFSubstanceData::default());
        }
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
      cas: data.cas.into(),
      molecular_formula: data.molecular_formula.into(),
      molar_mass: data.molar_mass.into(),
      melting_point: data.melting_point.into(),
      boiling_point: data.boiling_point.into(),
      water_hazard_class: data.water_hazard_class.into(),
      h_phrases: data.h_phrases.into(),
      p_phrases: data.p_phrases.into(),
      signal_word: data.signal_word.into(),
      symbols: data.symbols.into(),
      lethal_dose: data.lethal_dose.into(),
      mak: data.mak.into(),
      amount: data.amount.map(|value| value.into()),
      source: data.source,
    }
  }
}

impl std::convert::From<::types::Amount> for Amount {
  fn from(amount: ::types::Amount) -> Self {
    Amount {
      unit: amount.unit.into(),
      value: amount.value,
    }
  }
}

impl<T> Data<T> {
  pub fn new(data: T) -> Data<T> {
    Data { data, modified: false }
  }
}

impl<T: Default> std::convert::From<::types::Data<T>> for Data<T> {
  fn from(mut data: ::types::Data<T>) -> Self {
    match data.modified_data {
      Some(data) => Data { data, modified: true },
      None => Data {
        data: if !data.original_data.is_empty() {
          data.original_data.swap_remove(0)
        } else {
          T::default()
        },
        modified: false,
      },
    }
  }
}
