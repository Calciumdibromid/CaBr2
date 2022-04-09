use tokio::fs;

use super::{CaBr2, Loader, Saver};

async fn test_common(filename: &str) {
  let contents = fs::read(format!("tests/assets/{filename}_v0.cb2")).await.unwrap();

  let doc = CaBr2.load_document(contents).await.unwrap();

  let res = CaBr2.save_document(doc).await.unwrap();

  let new_contents = fs::read(format!("tests/assets/{filename}_v1.cb2")).await.unwrap();

  assert_eq!(new_contents, res);
}

#[tokio::test]
async fn test_knallerbsen() {
  test_common("Knallerbsen").await;
}

#[tokio::test]
async fn test_all() {
  test_common("all").await;
}

#[tokio::test]
async fn test_empty() {
  test_common("empty").await;
}
