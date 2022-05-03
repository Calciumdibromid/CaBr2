mod impls;

use std::{fs, path::PathBuf};
use structopt::StructOpt;
use warp::Filter;

use crate::impls::{
  config,
  load_save::{self},
  search,
};

/// Options for the webserver binary
#[derive(StructOpt, Debug)]
#[structopt(name = "basic")]
struct Opt {
  /// socket address the webserver will start listening on
  #[structopt(short, long, default_value = "127.0.0.1:3030")]
  address: String,

  /// folder where created pdfs to download are stored
  #[structopt(long, default_value = "/tmp/cabr2_server/created")]
  download_folder: PathBuf,

  /// public address that will be used to generate the download links
  #[structopt(short, long, default_value = "https://api.cabr2.de")]
  public_address: String,

  /// domain which is allowed to make requests to the webserver,
  /// this is a security header which will be set on responses
  #[structopt(short, long)]
  cors_allow_origin: Vec<String>,

  /// allow any origin when requests are sent with CORS
  #[structopt(long)]
  cors_allow_any: bool,
}

#[tokio::main]
pub async fn main() {
  // must be initialized first
  logger::setup_logger().await.unwrap();

  let opt = Opt::from_args();
  log::debug!("args: {:#?}", opt);

  search::init().await;
  load_save::init(
    opt.download_folder.clone(),
    opt.public_address,
    search::get_provider_mapping().await,
  )
  .await;

  // create tmp folder
  if let Err(why) = fs::create_dir_all(&opt.download_folder) {
    match why.kind() {
      std::io::ErrorKind::AlreadyExists => (),
      _ => {
        log::error!("{why:?}");
        panic!("temporary downloads folder could not be created");
      }
    }
  }

  let search_available_providers = warp::path("availableProviders")
    .and(warp::path::end())
    .and(warp::get())
    .and_then(search::handle_available_providers);

  let search_suggestions = warp::path("suggestions")
    .and(warp::post())
    .and(warp::body::json())
    .and_then(search::handle_suggestions);

  let search_results = warp::path("results")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(search::handle_results);

  let search_substances = warp::path("substances")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(search::handle_substances);

  let search = warp::path("search")
    .and(search_available_providers.or(search_suggestions.or(search_results.or(search_substances))));

  let config_programversion = warp::path("programVersion")
    .and(warp::path::end())
    .and(warp::get())
    .and_then(config::handle_program_version);

  let config_hazard_symbols = warp::path("hazardSymbols")
    .and(warp::path::end())
    .and(warp::get())
    .and_then(config::handle_hazard_symbols);

  let config_available_languages = warp::path("availableLanguages")
    .and(warp::path::end())
    .and(warp::get())
    .and_then(config::handle_available_languages);

  let config_localized_strings = warp::path("localizedStrings")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(config::handle_localized_strings);

  let config = warp::path("config")
    .and(config_programversion.or(config_hazard_symbols.or(config_available_languages.or(config_localized_strings))));

  let load_save_available_document_types = warp::path("availableDocumentTypes")
    .and(warp::path::end())
    .and(warp::get())
    .and_then(load_save::handle_available_document_types);

  let load_save_load_document = warp::path("loadDocument")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(load_save::handle_load_document);

  let load_save_save_document = warp::path("saveDocument")
    .and(warp::path::end())
    .and(warp::post())
    .and(warp::body::json())
    .and_then(load_save::handle_save_document);

  let load_save = warp::path("loadSave").and(
    load_save_available_document_types
      .or(load_save_load_document)
      .or(load_save_save_document),
  );

  let downloads_folder = warp::path("download").and(warp::fs::dir(opt.download_folder));

  let cors = if opt.cors_allow_any {
    log::warn!("Every origin is allowed for CORS requests!");
    warp::cors()
      .allow_any_origin()
      .allow_methods(vec!["GET", "POST"])
      .allow_headers(vec!["content-type"])
  } else {
    if opt.cors_allow_origin.is_empty() {
      log::warn!("No origin(s) specified for CORS requests! Every CORS request will fail!");
    }

    warp::cors()
      .allow_origins(opt.cors_allow_origin.iter().map(|s| s.as_str()).collect::<Vec<&str>>())
      .allow_methods(vec!["GET", "POST"])
      .allow_headers(vec!["content-type"])
  };

  let api = warp::path("api").and(warp::path("v1"));
  let routes = api.and(downloads_folder.or(load_save.or(search.or(config)))).with(cors);

  /*
  /api/v1/..

  POST ../search/suggestions { provider, searchArgument: { searchType, pattern } }
  POST ../search/results { provider, searchArguments: { exact, arguments: []{ searchType, pattern } } }
  POST ../search/substances { provider, identifier }

  GET ../config/programVersion
  GET ../config/hazardSymbols
  POST ../config/promptHtml { name }

  GET ../config/availableLanguages
  POST ../config/localizedStrings { language }

  GET ../loadSave/availableDocumentTypes
  POST ../loadSave/saveDocument { fileType, document } // document: CaBr2Document
  POST ../loadSave/loadDocument { fileType, document } // document: String
  */

  log::info!("Starting cleanup thread...");
  tokio::spawn(load_save::cleanup_thread());

  let address: std::net::SocketAddr = opt.address.parse().expect("failed to parse socket address");
  log::info!("server starting...");
  warp::serve(routes).run(address).await;
}
