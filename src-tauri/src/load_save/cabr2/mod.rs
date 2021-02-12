use std::{
  fs::OpenOptions,
  io::{BufReader, BufWriter},
  path::PathBuf,
};

use super::{
  error::Result,
  types::{CaBr2Document, Loader, Saver},
};

pub struct CaBr2;

impl Loader for CaBr2 {
  fn load_document(&self, filename: PathBuf) -> Result<CaBr2Document> {
    let file = OpenOptions::new().read(true).open(filename)?;
    let reader = BufReader::new(file);

    Ok(serde_json::from_reader(reader)?)
  }
}

impl Saver for CaBr2 {
  fn save_document(&self, filename: PathBuf, document: CaBr2Document) -> Result<()> {
    let file = OpenOptions::new()
      .write(true)
      .create(true)
      .truncate(true)
      .open(filename)?;
    let writer = BufWriter::new(file);

    serde_json::to_writer(writer, &document)?;

    Ok(())
  }
}
