use std::{
  fs::{self, OpenOptions},
  io::{BufWriter, Write},
  path::PathBuf,
};

use structopt::StructOpt;

use search::{
  gestis::{self, types::GestisResponse},
  types::Provider,
};

#[derive(StructOpt, Debug)]
#[structopt(name = "gestis_helper")]
struct Arguments {
  /// Extract xmls from gestis id
  #[structopt(short, long)]
  pub extract: Option<String>,

  /// Parse and print substance with gestis id
  #[structopt(short, long)]
  pub parse: Option<String>,
}

#[tokio::main]
async fn main() {
  pretty_env_logger::init();

  let args = Arguments::from_args();

  if args.parse.is_some() {
    let gestis = gestis::Gestis::new(reqwest::ClientBuilder::new().build().unwrap());

    let res = gestis.get_substance_data(args.parse.unwrap()).await.unwrap();

    println!("{res:#?}");
  } else if args.extract.is_some() {
    let gestis = gestis::Gestis::new(reqwest::ClientBuilder::new().build().unwrap());
    let (res, _) = gestis.get_raw_substance_data(args.extract.unwrap()).await.unwrap();

    extract_xmls(&res).unwrap();
  }
}

fn extract_xmls(res: &GestisResponse) -> std::io::Result<()> {
  let mut folder = PathBuf::from("gestis_helper");
  folder.push(&res.name);
  fs::create_dir_all(&folder)?;

  let mut response_file = folder.clone();
  response_file.push("_response.json");
  let file = OpenOptions::new().write(true).create(true).open(response_file)?;
  let writer = BufWriter::new(file);
  serde_json::to_writer_pretty(writer, res)?;

  println!("extracting: {}.json", res.name);

  let mapping = gestis::functions::parse_chapters(res);

  for (chapter_name, xml) in [
    ("boiling_point", mapping.boiling_point),
    ("cas_number", mapping.cas_number),
    ("h_p_signal_symbols", mapping.h_p_signal_symbols),
    ("lethal_dose", mapping.lethal_dose),
    ("mak1", mapping.mak1),
    ("mak2", mapping.mak2),
    ("melting_point", mapping.melting_point),
    ("molecular_formula", mapping.molecular_formula),
    ("water_hazard_class", mapping.water_hazard_class),
  ] {
    print!("  trying: {} ... ", chapter_name);

    match xml {
      Some(xml) => {
        let mut filename = folder.clone();
        filename.push(chapter_name);

        let mut file = OpenOptions::new()
          .create(true)
          .write(true)
          .open(filename.with_extension("xml"))?;

        file.write_all(xml.as_bytes())?;

        println!("\x1B[32mSUCCESS\x1B[m");
      }
      None => {
        println!("\x1B[31mNO_XML\x1B[m");
        continue;
      }
    }
  }

  Ok(())
}
