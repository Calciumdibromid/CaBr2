use std::{
  fs::{self, OpenOptions},
  io::{BufWriter, Write},
  path::PathBuf,
};

use structopt::StructOpt;

use cabr2_search::gestis::{self, types::GestisResponse};

#[derive(StructOpt, Debug)]
#[structopt(name = "gestis_helper")]
struct Arguments {
  /// Extract xmls from gestis id
  #[structopt(short, long)]
  pub extract: Option<String>,
}

fn main() {
  let args = Arguments::from_args();

  if args.extract.is_some() {
    let gestis = gestis::Gestis::new(ureq::agent());
    let (res, _) = gestis.get_article(args.extract.unwrap()).unwrap();

    extract_xmls(&res).unwrap();
  }
}

fn extract_xmls(res: &GestisResponse) -> std::io::Result<()> {
  let mut folder = PathBuf::from("helper_data");
  folder.push(&res.name);
  fs::create_dir_all(&folder)?;

  println!("extracting: {}.json", res.name);

  for (chapter_name, (chapter, subchapter)) in gestis::xml_parser::CHAPTER_MAPPING.iter() {
    print!("  trying: {} ... ", chapter_name);

    match gestis::xml_parser::get_xml(res, chapter, subchapter) {
      Ok(xml) => {
        let mut filename = folder.clone();
        filename.push(chapter_name);

        let file = OpenOptions::new()
          .create(true)
          .write(true)
          .open(filename.with_extension("xml"))?;

        let mut writer = BufWriter::new(file);
        writer.write_all(xml.as_ref())?;

        println!("\x1B[32mSUCCESS\x1B[m");
      }
      Err(_) => {
        println!("\x1B[31mFAILURE\x1B[m");
        continue;
      }
    }
  }

  Ok(())
}
