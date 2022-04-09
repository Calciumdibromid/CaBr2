mod error;
mod types;

use async_trait::async_trait;
use chrono::TimeZone;
use lazy_static::lazy_static;
use quick_xml::de::from_reader;
use regex::Regex;

use ::types::{Amount, Data, Source, SubstanceData, Unit};

use self::types::{BerylliumDocument, TemplateCategory};
use super::{
  error::Result,
  types::{CaBr2Document, Header, Loader},
};

pub use error::BerylliumError;

pub struct Beryllium;

#[cfg_attr(not(target_family = "wasm"), async_trait)]
#[cfg_attr(target_family = "wasm", async_trait(?Send))]
impl Loader for Beryllium {
  async fn load_document(&self, contents: Vec<u8>) -> Result<CaBr2Document> {
    lazy_static! {
      static ref BEGINNING_OF_TIME: chrono::DateTime<chrono::Utc> = chrono::Utc.ymd(1970, 1, 1).and_hms(0, 0, 0);
      static ref GESTIS_URL_RE: Regex =
        Regex::new(r"http://gestis\.itrust\.de/nxt/gateway\.dll/gestis_(de|en)/(\d{6})\.xml").unwrap();
    }

    let beryllium_doc: BerylliumDocument = from_reader(contents.as_slice()).map_err(BerylliumError::from)?;
    Ok(CaBr2Document {
      disposal: get_templates_with_category(&beryllium_doc, TemplateCategory::Dumping),
      human_and_environment_danger: get_templates_with_category(&beryllium_doc, TemplateCategory::Danger),
      in_case_of_danger: get_templates_with_category(&beryllium_doc, TemplateCategory::Behavior),
      rules_of_conduct: get_templates_with_category(&beryllium_doc, TemplateCategory::Security),
      header: Header {
        assistant: beryllium_doc.personal.assistant,
        document_title: beryllium_doc.general.title,
        lab_course: beryllium_doc.general.location,
        name: beryllium_doc.personal.name,
        organization: beryllium_doc.general.institute,
        place: beryllium_doc.personal.spot,
        preparation: beryllium_doc.product.name,
      },
      substance_data: beryllium_doc
        .substances
        .into_iter()
        .map(|substance| SubstanceData {
          name: Data::new(substance.names),
          cas: Data::new(option_to_vec(substance.cas)),
          molecular_formula: Data::new(option_to_vec(substance.chemical_formula)),
          molar_mass: Data::new(option_to_vec(substance.molecular_weight)),
          boiling_point: Data::new(option_to_vec(substance.boiling_point)),
          melting_point: Data::new(option_to_vec(substance.melting_point.map(|mp| mp.value))),
          water_hazard_class: Data::new(option_to_vec(substance.wgk)),
          h_phrases: Data::new(option_to_vec(substance.harzard_statements.map(|phrases| {
            phrases
              .split('-')
              .map(|p| {
                let mut s = String::from("H");
                s.push_str(p);
                (s, "".to_string()) // TODO(1287) fill statements
              })
              .collect()
          }))),
          p_phrases: Data::new(option_to_vec(substance.precautionary_statements.map(|phrases| {
            phrases
              .split('-')
              .map(|p| {
                let mut s = String::from("P");
                s.push_str(p);
                (s, "".to_string()) // TODO(1287) fill statements
              })
              .collect()
          }))),
          signal_word: Data::new(option_to_vec(substance.signal_word)),
          symbols: Data::new(option_to_vec(substance.symbols.map(|symbols| {
            symbols
              .into_iter()
              .map(|s| {
                let mut new_s = String::from("ghs");
                new_s.push_str(s.trim_end_matches("-neu"));
                new_s
              })
              .collect()
          }))),
          lethal_dose: Data::new(option_to_vec(substance.lethaldose50.map(|ld| ld.value))),
          mak: Data::new(option_to_vec(substance.mak.map(|mak| mak.value))),
          amount: {
            let mut unit = None;
            let mut value = None;
            if let Some(su) = substance.setting_up {
              if su.volumina.unwrap_or_default() {
                unit = Some(Unit::Liter);
              } else if su.mass.unwrap_or_default() {
                unit = Some(Unit::Gram);
              }
              value = Some(su.value);
            }
            if let Some(c) = substance.concentration {
              if c.relative.unwrap_or_default() {
                unit = Some(Unit::SolutionRelative);
              } else {
                unit = Some(Unit::SolutionMol);
              }
              value = substance.solution_volumina;
            }

            if unit.is_some() && value.is_some() {
              Some(Amount {
                unit: unit.unwrap(),
                value: value.unwrap(),
              })
            } else {
              log::debug!("could not convert amount: {{ unit: {:?}, value: {:?} }}", unit, value);
              None
            }
          },
          source: Source {
            provider: substance
              .source_provider
              .unwrap_or_else(|| "custom".to_string())
              .to_lowercase(),
            url: {
              let mut url = substance.source_url.unwrap_or_default();
              // remap gestis url to new one
              if GESTIS_URL_RE.is_match(&url) {
                let captures = GESTIS_URL_RE.captures(&url).unwrap();
                url = format!(
                  "https://gestis-api.dguv.de/api/article/{}/{}",
                  &captures[1], &captures[2]
                );
              }
              url
            },
            last_updated: match chrono::DateTime::parse_from_rfc2822(&substance.source_fetched.unwrap_or_default()) {
              Ok(datetime) => datetime.into(),
              Err(_) => *BEGINNING_OF_TIME,
            },
          },

          checked: true,
        })
        .collect(),
    })
  }
}

fn get_templates_with_category(doc: &BerylliumDocument, category: TemplateCategory) -> Vec<String> {
  doc
    .templates
    .templates
    .iter()
    .filter(|t| t.category == category)
    .map(|t| t.content.clone())
    .collect()
}

fn option_to_vec<T>(opt: Option<T>) -> Vec<T> {
  match opt {
    Some(contents) => vec![contents],
    None => Vec::with_capacity(0),
  }
}
