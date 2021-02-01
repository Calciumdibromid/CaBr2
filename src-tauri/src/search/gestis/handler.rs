use std::{collections::HashMap, io::Read, sync::Mutex};

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use ureq::Agent;

use super::{
  error::{Result, SearchError},
  types::GestisResponse,
  xml_parser,
};

const BASE_URL: &str = "https://gestis-api.dguv.de/api";
const SEARCH_SUGGESTIONS: &str = "search_suggestions";
const SEARCH: &str = "search";
const ARTICLE: &str = "article";

const SEARCH_TYPE_NAMES: [&str; 4] = ["stoffname", "nummern", "summenformel", "volltextsuche"];

lazy_static! {
  static ref IMAGE_CACHE: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
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
  search_type: SearchType,
  pattern: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchArguments {
  #[serde(default)]
  exact: bool,
  arguments: Vec<SearchArgument>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResponse {
  #[serde(rename(deserialize = "zvg_nr"))]
  zvg_number: String,
  #[serde(rename(deserialize = "cas_nr"))]
  cas_number: Option<String>,
  name: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseData {
  pub molecular_formula: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub melting_point: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub boiling_point: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub water_hazard_class: Option<String>,
  pub h_phrases: Vec<(String, String)>,
  pub p_phrases: Vec<(String, String)>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub signal_word: Option<String>,
  pub symbols: Vec<Image>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub lethal_dose: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Image {
  pub src: String,
  pub alt: String,
}

fn make_request(agent: &Agent, url: &str) -> Result<ureq::Response> {
  let res = agent.get(&url).call();
  log::debug!("{} - {}", res.status_line(), &url);

  match res.status() {
    200..=399 => Ok(res),
    429 => Err(SearchError::RateLimit),
    _ => Err(SearchError::RequestError(res.status())),
  }
}

pub fn get_quick_search_suggestions(
  agent: Agent,
  search_type: SearchType,
  pattern: String,
) -> Result<Vec<String>> {
  if pattern.len() < 2 {
    return Ok(vec![]);
  }

  let url = format!(
    "{}/{}/de?{}={}",
    BASE_URL, SEARCH_SUGGESTIONS, SEARCH_TYPE_NAMES[search_type as usize], pattern
  );
  let res = make_request(&agent, &url)?;

  Ok(res.into_json_deserialize()?)
}

pub fn get_search_results(agent: Agent, args: SearchArguments) -> Result<Vec<SearchResponse>> {
  let arguments = args.arguments.into_iter().filter(|a| !a.pattern.is_empty());

  if arguments.size_hint().1.unwrap() == 0 {
    return Ok(vec![]);
  }

  let arguments: Vec<String> = arguments
    .map(|a| {
      format!(
        "{}={}",
        SEARCH_TYPE_NAMES[a.search_type as usize], a.pattern
      )
    })
    .collect();

  let url = format!(
    "{}/{}/de?{}&exact={}",
    BASE_URL,
    SEARCH,
    arguments.join("&"),
    args.exact,
  );
  let res = make_request(&agent, &url)?;

  Ok(res.into_json_deserialize()?)
}

pub fn get_chemical_info(agent: Agent, zvg_number: String) -> Result<ResponseData> {
  let url = format!("{}/{}/de/{}", BASE_URL, ARTICLE, zvg_number);
  let res = make_request(&agent, &url)?;

  let json: GestisResponse = res.into_json_deserialize()?;

  let data = xml_parser::parse_response(json)?;

  let res_data = ResponseData {
    molecular_formula: data.molecular_formula,
    melting_point: data.melting_point,
    boiling_point: data.boiling_point,
    water_hazard_class: data.water_hazard_class,
    lethal_dose: data.lethal_dose,
    signal_word: data.signal_word,
    h_phrases: match data.h_phrases {
      Some(inner) => inner,
      None => Vec::new(),
    },
    p_phrases: match data.p_phrases {
      Some(inner) => inner,
      None => Vec::new(),
    },
    symbols: match data.symbols {
      Some(symbols) => {
        let mut cache = IMAGE_CACHE.lock().unwrap();
        symbols
          .into_iter()
          .map(|i| Image {
            src: {
              if let Some(src) = cache.get(&i.url) {
                src.clone()
              } else {
                match make_request(&agent, &i.url) {
                  Ok(res) => {
                    let len = res
                      .header("Content-Length")
                      .and_then(|s| s.parse::<usize>().ok())
                      .unwrap();

                    let mut reader = res.into_reader();
                    let mut buf = Vec::with_capacity(len);
                    reader.read_to_end(&mut buf).unwrap();

                    let base_64_img =
                      format!("data:image/image/gif;base64,{}", base64::encode(buf));
                    cache.insert(i.url, base_64_img.clone());

                    base_64_img
                  }
                  Err(e) => {
                    log::debug!("{:#?}", e);
                    "".into()
                  }
                }
              }
            },
            alt: i.alt,
          })
          .collect()
      }
      None => Vec::new(),
    },
  };

  Ok(res_data)
}
