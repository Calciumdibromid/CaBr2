use serde::{Deserialize, Serialize};
use serde_json::Value;
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

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    #[serde(rename(deserialize = "zvg_nr"))]
    zvg_number: String,
    #[serde(rename(deserialize = "cas_nr"))]
    cas_number: Option<String>,
    name: String,
}

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
    if !res.ok() {
        println!("not OK");
        return vec![];
    }

    res.into_json_deserialize().unwrap()
}

pub fn get_search_results(
    agent: Agent,
    search_type: SearchType,
    pattern: String,
) -> Vec<SearchResult> {
    if pattern.len() == 0 {
        return vec![];
    }

    let url = format!(
        "{}/{}/de?{}={}&exact=false",
        BASE_URL, SEARCH, SEARCH_TYPE_NAMES[search_type as usize], pattern
    );
    println!("{}", &url);
    let res = agent.get(&url).call();
    println!("{}", res.status_line());
    if !res.ok() {
        println!("not OK");
        return vec![];
    }

    match res.into_json_deserialize() {
        Ok(res) => res,
        Err(_) => {
            println!("parsing failed");
            vec![]
        }
    }
}
