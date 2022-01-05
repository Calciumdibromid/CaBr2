use std::{convert::Infallible, path::PathBuf, time::Duration};

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use tokio::fs;
use uuid::Uuid;
use warp::{hyper::StatusCode, Reply};

use cabr2_types::{webserver::generate_error_reply, ProviderMapping};

use crate::{error::LoadSaveError, handler, types::CaBr2Document};

lazy_static! {
  static ref DOWNLOAD_FOLDER: Arc<Mutex<PathBuf>> = Arc::new(Mutex::new(PathBuf::new()));
  static ref CACHE_FOLDER: Arc<Mutex<PathBuf>> = Arc::new(Mutex::new(PathBuf::new()));
}

#[cfg(not(debug_assertions))]
const SERVER_URL: &str = "https://api.cabr2.de";
#[cfg(debug_assertions)]
const SERVER_URL: &str = "http://localhost:3030";

pub async fn init(download_folder: PathBuf, cache_folder: PathBuf, provider_mapping: ProviderMapping) {
  DOWNLOAD_FOLDER.lock().unwrap() = download_folder;
  CACHE_FOLDER.lock().unwrap() = cache_folder;
  handler::init_handlers(provider_mapping).await;
}

pub async fn handle_available_document_types() -> Result<impl Reply, Infallible> {
  Ok(warp::reply::with_status(
    warp::reply::json(&handler::get_available_document_types().await),
    StatusCode::OK,
  ))
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadDocumentBody {
  file_type: String,
  document: Vec<u8>,
}

pub async fn handle_load_document(body: LoadDocumentBody) -> Result<impl Reply, Infallible> {
  match handler::load_document(&body.file_type, body.document).await {
    Ok(res) => Ok(warp::reply::with_status(warp::reply::json(&res), StatusCode::OK)),
    Err(LoadSaveError::UnknownFileType(filetype)) => {
      let message = format!("unknown file type: {}", filetype);
      log::error!("{}", message);
      Ok(generate_error_reply(StatusCode::BAD_REQUEST, message))
    }
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to load document".to_string(),
      ))
    }
  }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveDocumentBody {
  file_type: String,
  document: CaBr2Document,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveDocumentResponse {
  download_url: String,
}

pub async fn handle_save_document(body: SaveDocumentBody) -> Result<impl Reply, Infallible> {
  lazy_static! {
    static ref TMP: PathBuf = PathBuf::from(DOWNLOAD_FOLDER.lock().unwrap().clone());
  }

  let mut path;
  let mut uuid_str;
  loop {
    path = TMP.clone();
    uuid_str = Uuid::new_v4().to_hyphenated().to_string();
    path.push(format!("{}.{}", uuid_str, body.file_type));

    if !path.exists() {
      break;
    }
  }

  let contents = match handler::save_document(body.file_type.as_str(), body.document).await {
    Ok(contents) => contents,
    Err(LoadSaveError::UnknownFileType(filetype)) => {
      let message = format!("unknown file type: {}", filetype);
      log::error!("{}", message);
      return Ok(generate_error_reply(StatusCode::BAD_REQUEST, message));
    }
    Err(err) => {
      log::error!("{:?}", err);
      return Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to convert document".to_string(),
      ));
    }
  };

  match fs::write(&path, contents).await {
    Ok(_) => Ok(warp::reply::with_status(
      warp::reply::json(&SaveDocumentResponse {
        download_url: format!("{}/download/{}.{}", SERVER_URL, uuid_str, body.file_type),
      }),
      StatusCode::CREATED,
    )),
    Err(err) => {
      log::error!("{:?}", err);
      Ok(generate_error_reply(
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to create download file".to_string(),
      ))
    }
  }
}

pub async fn cleanup_thread() {
  // I'm sorry for the number of match statements.
  // This logic should ignore every error and continue working on the next file
  // but we want to know what went wrong.

  loop {
    let mut res = match fs::read_dir(DOWNLOAD_FOLDER.lock().unwrap().clone()).await {
      Ok(iter) => iter,
      Err(err) => {
        log::error!("{:?}", err);
        break;
      }
    };

    // go through all generated files and remove all that are older than 24 hours
    loop {
      let path = res.next_entry().await.unwrap_or_default();
      match path {
        Some(path) => match path.metadata().await {
          Ok(data) => match data.modified() {
            Ok(c_time) => match c_time.elapsed() {
              Ok(dur) => {
                if dur.as_secs() > 86400 {
                  match fs::remove_file(path.path()).await {
                    Ok(_) => log::debug!("deleted file: {:?}", path.path()),
                    Err(e) => log::error!("{:?}", e),
                  };
                }
              }
              Err(e) => log::error!("{:?}", e),
            },
            Err(e) => log::error!("{:?}", e),
          },
          Err(e) => log::error!("{:?}", e),
        },
        None => break,
      }
    }

    // check every 15 minutes
    tokio::time::sleep(Duration::from_secs(900)).await;
  }
}
