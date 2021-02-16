use std::{
  io::Read,
  path::PathBuf,
  sync::{mpsc, Arc, Mutex},
  thread,
};

use lazy_static::lazy_static;
use wkhtmltopdf::{Orientation, PdfApplication, Size};

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
      Err(e) => Err(LoadSaveError::RenderError(e.to_string())),
      Ok(html) => {
        let channels = PDF_THREAD_CHANNEL.lock().unwrap();

        channels
          .0
          .send((html, title))
          .expect("sending data to pdf thread failed");

        let pdf = channels.1.recv().expect("receiving data from pdf thread failed");

        log::debug!("{:?}", pdf);

        Ok(())
      }
    }
  }
}

const HTML_TEST: &str = r#"<html><head>Title</head><body><div>foo</div></body></html>"#;

/// render_doc get CaBr2Document and return html (dummy at the moment)
fn render_doc(_document: CaBr2Document) -> Result<String> {
  log::warn!("dummy values");
  return Ok(HTML_TEST.to_string());
}

fn init_pdf_application() -> (mpsc::SyncSender<(String, String)>, mpsc::Receiver<Result<Vec<u8>>>) {
  let (tauri_tx, pdf_rx) = mpsc::sync_channel(0);
  let (pdf_tx, tauri_rx) = mpsc::sync_channel(0);

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
        .orientation(Orientation::Landscape)
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

  (tauri_tx, tauri_rx)
}
