use quick_xml::{events::Event, Reader};

use super::{
  error::Result,
  types::{ChapterMapping, GestisResponse},
};

pub fn parse_chapters(json: &GestisResponse) -> ChapterMapping {
  let mut mapping = ChapterMapping {
    boiling_point: None,
    cas_number: None,
    h_p_signal_symbols: None,
    lethal_dose: None,
    agw: None,
    mak: None,
    melting_point: None,
    molecular_formula_molar_mass: None,
    water_hazard_class: None,
  };

  // just go through the JSON once and save references to the XML strings for each required section
  for chapter in json.chapters.iter() {
    match chapter.number.as_str() {
      "0100" => {
        for subchapter in chapter.subchapters.iter() {
          if subchapter.number.as_str() == "0100" {
            mapping.cas_number = subchapter.text.as_deref();
          }
        }
      }
      "0400" => {
        for subchapter in chapter.subchapters.iter() {
          if subchapter.number.as_str() == "0400" {
            mapping.molecular_formula_molar_mass = subchapter.text.as_deref();
          }
        }
      }
      "0500" => {
        for subchapter in chapter.subchapters.iter() {
          if subchapter.number.as_str() == "0501" {
            mapping.lethal_dose = subchapter.text.as_deref();
          }
        }
      }
      "0600" => {
        for subchapter in chapter.subchapters.iter() {
          match subchapter.number.as_str() {
            "0602" => mapping.melting_point = subchapter.text.as_deref(),
            "0603" => mapping.boiling_point = subchapter.text.as_deref(),
            _ => {}
          }
        }
      }
      "1100" => {
        for subchapter in chapter.subchapters.iter() {
          match subchapter.number.as_str() {
            "1106" => mapping.water_hazard_class = subchapter.text.as_deref(),
            "1201" => mapping.agw = subchapter.text.as_deref(),
            "1203" => mapping.mak = subchapter.text.as_deref(),
            "1303" => mapping.h_p_signal_symbols = subchapter.text.as_deref(),
            _ => {}
          }
        }
      }
      _ => {}
    }
  }

  mapping
}

// XML parsing functions

/// Private extension for `quick_xml::Parser` with convenience functions.
pub trait ReaderExt<'a> {
  /// Skips the next n occurrences of the next tag.
  /// Only looks at the current level, sublevels are skipped.
  fn skip(&mut self, name: &str, times: u8) -> Result<()>;

  /// Finds the next occurrence of tag `name`.
  fn find_start(&mut self, name: &str) -> Result<Event>;

  /// Finds the next `table` tag with class attribute `class`.
  fn find_table(&mut self, class: &str) -> Result<Event>;

  /// Reads the text with internal buffer.
  fn read_text_unbuffered(&mut self, end: &str) -> Result<String>;

  /// This function should only be use to debug code.
  ///
  /// It is just a convenience function that prints all remaining tags and texts of the XML.
  #[cfg(debug_assertions)]
  fn print_to_end(&mut self) -> Result<()>;
}

impl<'a> ReaderExt<'a> for Reader<&'a [u8]> {
  fn skip(&mut self, name: &str, times: u8) -> Result<()> {
    for _ in 0..times {
      self.read_to_end_unbuffered(name)?
    }

    Ok(())
  }

  fn find_start(&mut self, name: &str) -> Result<Event> {
    let name: &[u8] = name.as_ref();
    loop {
      match self.read_event_unbuffered()? {
        Event::Start(e) => {
          if e.name() == name {
            return Ok(Event::Start(e));
          }
        }
        Event::Eof => return Ok(Event::Eof),
        _ => {}
      }
    }
  }

  fn find_table(&mut self, class: &str) -> Result<Event> {
    let class: &[u8] = class.as_ref();
    loop {
      match self.read_event_unbuffered()? {
        Event::Start(e) => {
          if e.name() == b"table"
            && e.attributes().into_iter().any(|a| {
              if let Ok(attr) = a {
                attr.key == b"class" && attr.value == class
              } else {
                false
              }
            })
          {
            return Ok(Event::Start(e));
          }
        }
        Event::Eof => return Ok(Event::Eof),
        _ => {}
      }
    }
  }

  fn read_text_unbuffered(&mut self, end: &str) -> Result<String> {
    Ok(self.read_text(end, &mut Vec::with_capacity(32))?)
  }

  #[cfg(debug_assertions)]
  fn print_to_end(&mut self) -> Result<()> {
    loop {
      match self.read_event_unbuffered()? {
        Event::Start(e) => println!("{}", self.decode(e.name())?),
        Event::Text(e) => println!("  text: '{}'", e.unescape_and_decode(self)?),
        Event::Empty(e) => println!("empty: {}", self.decode(e.name())?),
        Event::Eof => break,
        _ => {}
      }
    }

    Ok(())
  }
}
