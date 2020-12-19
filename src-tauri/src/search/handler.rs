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

#[derive(Deserialize)]
pub struct SearchResultGestis {
  rank: String,
  #[serde(rename = "zvg_nr")]
  zvg_number: String,
  #[serde(rename = "cas_nr")]
  cas_number: String,
  name: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
  rank: u32,
  zvg_number: String,
  cas_number: String,
  name: String,
}

impl std::convert::From<SearchResultGestis> for SearchResult {
  fn from(result: SearchResultGestis) -> Self {
    SearchResult {
      rank: result.rank.strip_suffix(".").unwrap().parse().unwrap(),
      zvg_number: result.zvg_number,
      cas_number: result.cas_number,
      name: result.name,
    }
  }
}

// TODO delete
pub fn get_quick_search_suggestions(
  agent: Agent,
  search_type: SearchType,
  pattern: String,
) -> Vec<String> {
  let url = format!(
    "{}/{}/de?{}={}",
    BASE_URL, SEARCH_SUGGESTIONS, SEARCH_TYPE_NAMES[search_type as usize], pattern
  );
  println!("{}", &url);
  let res = agent.get(&url).call();
  println!("{}", res.status_line());

  res.into_json_deserialize().unwrap()
}

pub fn get_search_results(
  agent: Agent,
  search_type: SearchType,
  pattern: String,
) -> Vec<SearchResult> {
  let url = format!(
    "{}/{}/de?{}={}&exact=false",
    BASE_URL, SEARCH, SEARCH_TYPE_NAMES[search_type as usize], pattern
  );
  println!("{}", &url);
  // TODO error handling
  let res = agent.get(&url).call();
  println!("{}", res.status_line());
  let results: Vec<SearchResultGestis> = res.into_json_deserialize().unwrap();

  results.into_iter().map(|r| SearchResult::from(r)).collect()
}
