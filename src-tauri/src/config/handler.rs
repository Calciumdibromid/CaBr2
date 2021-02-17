use std::{
  collections::HashMap,
  fs::{create_dir_all, OpenOptions},
  io::{Read, Write},
  path::PathBuf,
};

use super::{
  error::Result,
  types::{GHSSymbols, JsonConfig, TomlConfig},
  DATA_DIR, PROJECT_DIRS,
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

#[inline]
fn get_config_path() -> PathBuf {
  let mut conf_dir = PROJECT_DIRS.config_dir().to_path_buf();

  if !conf_dir.exists() {
    create_dir_all(&conf_dir).unwrap();
  }

  conf_dir.push("config.toml");

  conf_dir
}
