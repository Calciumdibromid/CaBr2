use types::{Amount, Data, SubstanceData};

use crate::types::{CaBr2Document, Header};

use super::types::{AmountV0, CaBr2DocumentV0, DataV0, SubstanceDataV0};

impl From<CaBr2DocumentV0> for CaBr2Document {
  fn from(old: CaBr2DocumentV0) -> Self {
    CaBr2Document {
      header: Header {
        document_title: old.header.document_title,
        organization: old.header.organisation,
        lab_course: old.header.lab_course,
        name: old.header.name,
        place: old.header.place,
        assistant: old.header.assistant,
        preparation: old.header.preparation,
      },
      substance_data: old.substance_data.into_iter().map(|s| s.into()).collect(),
      human_and_environment_danger: old.human_and_environment_danger,
      rules_of_conduct: old.rules_of_conduct,
      in_case_of_danger: old.in_case_of_danger,
      disposal: old.disposal,
    }
  }
}

impl From<SubstanceDataV0> for SubstanceData {
  fn from(mut old: SubstanceDataV0) -> Self {
    let mut names = Vec::with_capacity(old.alternative_names.len() + 1);
    names.push(old.name.original_data);
    names.append(&mut old.alternative_names);

    SubstanceData {
      name: Data {
        modified_data: old.name.modified_data,
        original_data: names,
      },
      cas: old.cas.into(),
      molecular_formula: old.molecular_formula.into(),
      molar_mass: old.molar_mass.into(),
      melting_point: old.melting_point.into(),
      boiling_point: old.boiling_point.into(),
      water_hazard_class: old.water_hazard_class.into(),
      h_phrases: old.h_phrases.into(),
      p_phrases: old.p_phrases.into(),
      signal_word: old.signal_word.into(),
      symbols: old.symbols.into(),
      lethal_dose: old.lethal_dose.into(),
      mak: old.mak.into(),
      amount: old.amount.map(|a| a.into()),
      source: old.source,
      checked: old.checked,
    }
  }
}

impl From<AmountV0> for Amount {
  fn from(old: AmountV0) -> Self {
    Amount {
      value: old.value,
      unit: old.unit,
    }
  }
}

impl<T> From<DataV0<Option<T>>> for Data<T> {
  fn from(old: DataV0<Option<T>>) -> Self {
    Data {
      modified_data: match old.modified_data {
        Some(opt) => opt,
        None => None,
      },
      original_data: match old.original_data {
        Some(data) => vec![data],
        None => Vec::with_capacity(0),
      },
    }
  }
}

impl<T> From<DataV0<Vec<T>>> for Data<Vec<T>> {
  fn from(old: DataV0<Vec<T>>) -> Self {
    Data {
      modified_data: old.modified_data,
      original_data: if old.original_data.is_empty() {
        Vec::with_capacity(0)
      } else {
        vec![old.original_data]
      },
    }
  }
}
