use std::{
  collections::HashMap,
  fs::{self, OpenOptions},
  io::{BufReader, Read, Write},
  path::PathBuf,
};

use serde_json::Value;

use crate::error::ConfigError;

use super::{
  error::Result,
  types::{GHSSymbols, JsonConfig, LocalizedStrings, LocalizedStringsHeader, TomlConfig},
  DATA_DIR,
};

pub fn get_config() -> Result<JsonConfig> {
  Ok(read_config()?.into())
}

pub fn read_config() -> Result<TomlConfig> {
  let config_path = get_config_path();
  log::trace!("reading config from: {:?}", config_path);

  let mut file = match OpenOptions::new().read(true).open(config_path) {
    Ok(file) => file,
    Err(e) => match e.kind() {
      std::io::ErrorKind::NotFound => {
        save_config(TomlConfig::default().into())?;
        return read_config();
      }
      _ => return Err(e.into()),
    },
  };
  let mut buf = String::new();
  file.read_to_string(&mut buf)?;

  Ok(toml::from_str::<TomlConfig>(&buf)?)
}

pub fn save_config(config: JsonConfig) -> Result<()> {
  write_config(config.into())
}

pub fn write_config(config: TomlConfig) -> Result<()> {
  let config_path = get_config_path();
  log::trace!("writing config to: {:?}", config_path);

  let mut file = OpenOptions::new()
    .create(true)
    .write(true)
    .truncate(true)
    .open(config_path)?;

  file.write_all(toml::to_string_pretty(&config)?.as_bytes())?;

  Ok(())
}

pub fn get_hazard_symbols() -> Result<GHSSymbols> {
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
    let mut file = OpenOptions::new().read(true).open(&filename)?;
    file.read_to_end(&mut buf)?;

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

pub fn get_available_languages() -> Result<Vec<LocalizedStringsHeader>> {
  let translation_folder = get_translation_folder();

  let mut languages: Vec<LocalizedStringsHeader> = Vec::new();

  if translation_folder.is_dir() {
    for entry in fs::read_dir(translation_folder)? {
      let path = match entry {
        Ok(entry) => entry.path(),
        Err(err) => {
          log::debug!("error when iterating over translation files: {:?}", err);
          continue;
        }
      };
      let reader = match OpenOptions::new().read(true).open(path) {
        Ok(file) => BufReader::new(file),
        Err(err) => {
          log::debug!("error when opening translation file: {:?}", err);
          continue;
        }
      };
      match serde_json::from_reader(reader) {
        Ok(lang) => languages.push(lang),
        Err(err) => {
          log::debug!("error when reading translation file: {:?}", err)
        }
      };
    }
  }

  Ok(languages)
}

pub fn get_localized_strings(language: String) -> Result<Value> {
  let mut translation_path = get_translation_folder();
  translation_path.push(&language);
  let translation_path = translation_path.with_extension("json");

  if translation_path.is_file() {
    let reader = match OpenOptions::new().read(true).open(&translation_path) {
      Ok(file) => BufReader::new(file),
      Err(err) => {
        log::error!("opening translation file '{:?}' failed: {:?}", translation_path, err);
        return Err(ConfigError::LocalizationReadError(language));
      }
    };
    match serde_json::from_reader(reader) {
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

#[inline]
fn get_translation_folder() -> PathBuf {
  let mut translation_folder = DATA_DIR.clone();
  translation_folder.push("translations");

  translation_folder
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
