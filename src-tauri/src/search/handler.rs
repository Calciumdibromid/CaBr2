use serde::{Deserialize, Serialize};
use ureq::Agent;

const BASE_URL: &str = "https://gestis-api.dguv.de/api";
const SEARCH_SUGGESTIONS: &str = "search_suggestions";
const SEARCH: &str = "search";
const ARTICLE: &str = "article";

const SEARCH_TYPE_NAMES: [&str; 4] = ["stoffname", "nummern", "summenformel", "volltextsuche"];
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum SearchType {
  ChemicalName,
  Numbers,
  EmpiricalFormula,
  FullText,
}

pub type SearchSuggestions = Vec<String>;

pub fn quick_search_suggestions(
  agent: Agent,
  type_: SearchType,
  pattern: String,
) -> SearchSuggestions {
  let url = format!(
    "{}/{}/de?{}={}",
    BASE_URL, SEARCH_SUGGESTIONS, SEARCH_TYPE_NAMES[type_ as usize], pattern
  );
  println!("{}", &url);
  let res = agent.get(&url).call();

  res.into_json_deserialize().unwrap()
}
