use std::{
  fs::OpenOptions,
  io::{BufWriter, Read, Write},
  path::PathBuf,
  sync::{mpsc, Arc, Mutex},
  thread,
};

use handlebars::Handlebars;
use lazy_static::lazy_static;
use wkhtmltopdf::{Orientation, PageSize, PdfApplication, Size};

use super::{
  error::{LoadSaveError, Result},
  types::{CaBr2Document, Saver},
};

pub struct PDF;

impl Saver for PDF {
  fn save_document(&self, filename: PathBuf, document: CaBr2Document) -> Result<()> {
    lazy_static! {
      static ref PDF_THREAD_CHANNEL: Arc<Mutex<(mpsc::SyncSender<(String, String)>, mpsc::Receiver<Result<Vec<u8>>>)>> =
        Arc::new(Mutex::new(init_pdf_application()));
    }

    let title = document.header.document_title.clone();
    match render_doc(document) {
      Err(e) => Err(e),
      Ok((page1, page2)) => {
        let channels = PDF_THREAD_CHANNEL.lock().unwrap();

        channels
          .0
          .send((page1, title))
          .expect("sending data to pdf thread failed");

        let pdf: Vec<u8> = channels.1.recv().expect("receiving data from pdf thread failed")?;

        let file = OpenOptions::new()
          .create(true)
          .write(true)
          .truncate(true)
          .open(filename)?;
        let mut writer = BufWriter::new(file);
        writer.write_all(&pdf)?;

        Ok(())
      }
    }
  }
}

/// render_doc get CaBr2Document and return html (dummy at the moment)
fn render_doc(document: CaBr2Document) -> Result<(String, String)> {
  lazy_static! {
    static ref REG: Arc<Mutex<Option<Handlebars<'static>>>> = Arc::new(Mutex::new(None));
  }

  let mut reg = REG.lock().unwrap();

  if reg.is_none() {
    *reg = Some(init_handlebars()?);
  }

  log::warn!("dummy values");

  Ok((
    reg.as_ref().unwrap().render("dummy", &serde_json::json!({"page": 1}))?,
    reg.as_ref().unwrap().render("dummy", &serde_json::json!({"page": 2}))?,
  ))
}

#[inline]
fn init_handlebars() -> Result<Handlebars<'static>> {
  let mut reg = Handlebars::new();

  reg.register_template_string("dummy", "<html><body><h1>Dummy HTML</h1>page: {{page}}</body></html>")?;

  Ok(reg)
}

fn init_pdf_application() -> (mpsc::SyncSender<(String, String)>, mpsc::Receiver<Result<Vec<u8>>>) {
  let (tauri_tx, pdf_rx) = mpsc::sync_channel(0);
  let (pdf_tx, tauri_rx) = mpsc::sync_channel(0);

  /* #region  pdf thread */

  thread::spawn(move || {
    log::debug!("[pdf_thread]: initializing pdf application");
    let mut pdf_app = match PdfApplication::new() {
      Ok(app) => app,
      Err(e) => {
        log::error!("initialization of pdf application failed");
        pdf_tx
          .send(Err(LoadSaveError::PdfError(e)))
          .expect("pdf thread could not send data");
        return;
      }
    };

    loop {
      log::trace!("[pdf_thread]: waiting for html to convert");
      let (html, title) = pdf_rx.recv().expect("pdf thread could not receive data");
      log::trace!("[pdf_thread]: got html");

      // needed for rust to resolve types
      let title: String = title;

      let mut buf = Vec::new();

      let result = match pdf_app
        .builder()
        .page_size(PageSize::A4)
        .orientation(Orientation::Portrait)
        .margin(Size::Millimeters(50))
        .title(&title)
        .build_from_html(&html)
      {
        Ok(mut pdfout) => match pdfout.read_to_end(&mut buf) {
          Ok(_) => Ok(buf),
          Err(e) => Err(LoadSaveError::IOError(e)),
        },
        Err(e) => Err(LoadSaveError::PdfError(e)),
      };

      log::trace!("[pdf_thread]: sending result");
      pdf_tx.send(result).expect("pdf thread could not send data");
      log::trace!("[pdf_thread]: finished");
    }
  });

  /* #endregion */

  (tauri_tx, tauri_rx)
}
