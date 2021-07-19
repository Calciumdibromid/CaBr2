use std::{collections::HashMap, env, path::PathBuf};

use directories_next::ProjectDirs;
use lazy_static::lazy_static;
use serde_json::Value;
use tokio::{
  fs::{self, OpenOptions},
  io::{AsyncReadExt, AsyncWriteExt},
};

use crate::error::ConfigError;

use super::{
  error::Result,
  types::{BackendConfig, FrontendConfig, GHSSymbols, LocalizedStrings, LocalizedStringsHeader},
};

lazy_static! {
  pub static ref PROJECT_DIRS: ProjectDirs = ProjectDirs::from("de", "Calciumdibromid", "CaBr2").unwrap();
  pub static ref DATA_DIR: PathBuf = get_program_data_dir();
  pub static ref TMP_DIR: PathBuf = env::temp_dir();
}

pub async fn get_frontend_config() -> Result<FrontendConfig> {
  Ok(read_config().await?.into())
}

pub async fn read_config() -> Result<BackendConfig> {
  let config_path = get_config_path();
  log::trace!("reading config from: {:?}", config_path);

  let mut file;

  loop {
    match OpenOptions::new().read(true).open(&config_path).await {
      Ok(f) => {
        file = f;
        break;
      }
      Err(e) => match e.kind() {
        std::io::ErrorKind::NotFound => {
          write_config(BackendConfig::default()).await?;
        }
        _ => return Err(e.into()),
      },
    }
  }

  let mut buf = String::new();
  file.read_to_string(&mut buf).await?;

  Ok(toml::from_str::<BackendConfig>(&buf)?)
}

pub async fn save_frontend_config(config: FrontendConfig) -> Result<()> {
  write_config(BackendConfig::convert(config).await).await
}

pub async fn write_config(config: BackendConfig) -> Result<()> {
  let config_path = get_config_path();
  log::trace!("writing config to: {:?}", config_path);

  let mut file = OpenOptions::new()
    .create(true)
    .write(true)
    .truncate(true)
    .open(config_path)
    .await?;

  file.write_all(toml::to_string_pretty(&config)?.as_bytes()).await?;
  file.sync_all().await?;

  Ok(())
}

pub async fn get_hazard_symbols() -> Result<GHSSymbols> {
  // symbols from: https://unece.org/transportdangerous-goods/ghs-pictograms
  let mut symbol_folder = DATA_DIR.clone();
  symbol_folder.push("ghs_symbols");
  log::trace!("loading ghs symbols from: {:?}", symbol_folder);

  let mut symbols = HashMap::new();
  let mut buf = Vec::new();

  for filename in symbol_folder
    .read_dir()?
    .filter(|p| p.is_ok())
    .map(|p| p.unwrap().path())
    .filter(|p| p.is_file())
  {
    buf.clear();
    let mut file = OpenOptions::new().read(true).open(&filename).await?;
    file.read_to_end(&mut buf).await?;

    symbols.insert(
      filename
        .file_name()
        .unwrap()
        .to_string_lossy()
        .trim_end_matches(".png")
        .into(),
      format!("data:image/image/png;base64,{}", base64::encode(&buf)),
    );
  }

  Ok(symbols)
}

pub async fn get_available_languages() -> Result<Vec<LocalizedStringsHeader>> {
  let translation_folder = get_translation_folder();

  let mut languages: Vec<LocalizedStringsHeader> = Vec::new();
  let mut buf: Vec<u8> = Vec::new();

  if translation_folder.is_dir() {
    let mut results = fs::read_dir(translation_folder).await?;
    while let Some(entry) = results.next_entry().await? {
      let path = entry.path();

      let mut file = match OpenOptions::new().read(true).open(path).await {
        Ok(file) => file,
        Err(err) => {
          log::debug!("error when opening translation file: {:?}", err);
          continue;
        }
      };

      buf.clear();
      // It's faster to first read the complete file and then deserialize it.
      file.read_to_end(&mut buf).await?;

      match serde_json::from_slice(&buf) {
        Ok(lang) => languages.push(lang),
        Err(err) => {
          log::debug!("error when reading translation file: {:?}", err)
        }
      };
    }
  }

  Ok(languages)
}

pub async fn get_localized_strings(language: String) -> Result<Value> {
  let mut translation_path = get_translation_folder();
  translation_path.push(&language);
  let translation_path = translation_path.with_extension("json");

  if translation_path.is_file() {
    let mut file = match OpenOptions::new().read(true).open(&translation_path).await {
      Ok(file) => file,
      Err(err) => {
        log::error!("opening translation file '{:?}' failed: {:?}", translation_path, err);
        return Err(ConfigError::LocalizationReadError(language));
      }
    };

    let mut buf = vec![];
    file.read_to_end(&mut buf).await?;

    match serde_json::from_slice(&buf) {
      Ok(localized) => {
        let localized: LocalizedStrings = localized;
        return Ok(localized.strings);
      }
      Err(err) => {
        log::error!("reading translation file '{:?}' failed: {:?}", translation_path, err);
        return Err(ConfigError::LocalizationReadError(language));
      }
    };
  }

  log::error!("translation file '{:?}' is not a file", translation_path);
  Err(ConfigError::LocalizationNotFound(language))
}

pub async fn get_prompt_html(name: String) -> Result<String> {
  // TODO embed images
  let mut folder = get_prompt_folder();
  match name.as_str() {
    "gettingStarted" => {
      folder.push("getting-started.html");
      Ok(fs::read_to_string(folder).await?)
    }
    _ => Err(ConfigError::NoPromptHtml(name)),
  }
}

#[inline]
fn get_translation_folder() -> PathBuf {
  let mut translation_folder = DATA_DIR.clone();
  translation_folder.push("translations");

  translation_folder
}

#[inline]
fn get_prompt_folder() -> PathBuf {
  let mut prompt_folder = DATA_DIR.clone();
  prompt_folder.push("prompts");

  prompt_folder
}

#[cfg(not(debug_assertions))]
#[inline]
fn get_config_path() -> PathBuf {
  #[cfg(not(feature = "portable"))]
  {
    log::trace!("config path: user config folder");
    use super::PROJECT_DIRS;
    let mut conf_dir = PROJECT_DIRS.config_dir().to_path_buf();

    if !conf_dir.exists() {
      std::fs::create_dir_all(&conf_dir).unwrap();
    }

    conf_dir.push("config.toml");

    conf_dir
  }

  #[cfg(feature = "portable")]
  {
    log::trace!("config path: portable");
    let mut cfg_path = PathBuf::from(std::env::args().next().unwrap())
      .parent()
      .unwrap()
      .to_path_buf();
    cfg_path.push("config.toml");
    cfg_path
  }
}

#[cfg(debug_assertions)]
#[inline]
fn get_config_path() -> PathBuf {
  log::trace!("config path: debug");
  let config_path = PathBuf::from(std::env::args().next().unwrap());
  // src-tauri/target
  config_path.parent().unwrap().with_file_name("config.toml")
}

fn get_program_data_dir() -> PathBuf {
  #[cfg(not(debug_assertions))]
  {
    #[cfg(not(feature = "portable"))]
    {
      #[cfg(target_os = "linux")]
      {
        log::trace!("data path: linux");
        return PathBuf::from("/usr/lib/cabr2/");
      }

      #[cfg(target_os = "macos")]
      {
        log::trace!("data path: macos");
        unimplemented!();
      }

      #[cfg(target_os = "windows")]
      {
        log::trace!("data path: windows");
        return PathBuf::from(env::args().next().unwrap())
          .parent()
          .unwrap()
          .to_path_buf();
      }
    }

    #[cfg(feature = "portable")]
    {
      log::trace!("data path: portable");
      return PathBuf::from(env::args().next().unwrap())
        .parent()
        .unwrap()
        .to_path_buf();
    }
  }

  #[cfg(debug_assertions)]
  {
    log::trace!("data path: debug");
    let mut program_path = PathBuf::from(env::args().next().unwrap())
      .parent()
      .unwrap()
      .to_path_buf();
    // git repo root
    program_path.push("../../../");
    program_path.canonicalize().unwrap()
  }
}
