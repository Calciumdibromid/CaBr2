use std::{collections::HashMap, io::Read, sync::Mutex};

use lazy_static::lazy_static;
use ureq::Agent;

use super::{
  error::{Result, SearchError},
  types::{
    Data, GestisResponse, Image, SearchArguments, SearchResponse, SearchType, SubstanceData,
  },
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

pub fn get_substance_data(agent: Agent, zvg_number: String) -> Result<SubstanceData> {
  let url = format!("{}/{}/de/{}", BASE_URL, ARTICLE, zvg_number);
  let res = make_request(&agent, &url)?;

  let json: GestisResponse = res.into_json_deserialize()?;

  let data = xml_parser::parse_response(json)?;

  let res_data = SubstanceData {
    molecular_formula: Data::new(data.molecular_formula),
    melting_point: Data::new(data.melting_point),
    boiling_point: Data::new(data.boiling_point),
    water_hazard_class: Data::new(data.water_hazard_class),
    lethal_dose: Data::new(data.lethal_dose),
    signal_word: Data::new(data.signal_word),
    h_phrases: Data::new(match data.h_phrases {
      Some(inner) => inner,
      None => Vec::new(),
    }),
    p_phrases: Data::new(match data.p_phrases {
      Some(inner) => inner,
      None => Vec::new(),
    }),
    symbols: Data::new(match data.symbols {
      Some(symbols) => {
        let mut cache = IMAGE_CACHE.lock().unwrap();
        symbols
          .into_iter()
          .map(|i| Image {
            src: {
              if let Some(src) = cache.get(&i.src) {
                src.clone()
              } else {
                match make_request(&agent, &i.src) {
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
                    cache.insert(i.src, base_64_img.clone());

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
    }),
  };

  Ok(res_data)
}
