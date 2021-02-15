use std::{
  collections::HashMap,
  env,
  fs::OpenOptions,
  io::{Read, Write},
  path::PathBuf,
};

use super::{
  error::Result,
  types::{GHSSymbols, JsonConfig, TomlConfig},
};

pub fn get_config() -> Result<JsonConfig> {
  let config_path = get_config_path();
  log::debug!("loading config from: {:?}", config_path);

  let mut file = match OpenOptions::new().read(true).open(config_path) {
    Ok(file) => file,
    Err(e) => match e.kind() {
      std::io::ErrorKind::NotFound => {
        save_config(TomlConfig::default().into())?;
        return get_config();
      }
      _ => return Err(e.into()),
    },
  };
  let mut buf = String::new();
  file.read_to_string(&mut buf)?;

  Ok(toml::from_str::<TomlConfig>(&buf)?.into())
}

pub fn save_config(config: JsonConfig) -> Result<()> {
  let config_path = get_config_path();
  log::debug!("saving config to: {:?}", config_path);

  let mut file = OpenOptions::new()
    .create(true)
    .write(true)
    .truncate(true)
    .open(config_path)?;

  file.write_all(toml::to_string_pretty::<TomlConfig>(&config.into())?.as_bytes())?;

  Ok(())
}

pub fn get_hazard_symbols() -> Result<GHSSymbols> {
  // symbols from: https://unece.org/transportdangerous-goods/ghs-pictograms
  let symbol_folder = get_program_path().with_file_name("ghs_symbols");
  log::debug!("loading ghs symbols from: {:?}", symbol_folder);

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
  get_program_path().with_file_name("config.toml")
}

#[inline]
fn get_program_path() -> PathBuf {
  PathBuf::from(env::args().next().unwrap())
}
