import { promisified } from 'tauri/api/tauri';
import logger from './app/utils/logger';

export default function debugMain() {
  logger.warning("======== frontend debugging file called ========")

  testSearchSuggestions();
  testSearch();
  // testArticle();

  logger.warning("======== end of frontend debugging calls ========")
}

function testSearchSuggestions() {
  promisified({ cmd: "searchSuggestions", searchType: "chemicalName", pattern: "salzsäure" }).then((res) => {
    logger.debug(res);
  }).catch((err) => {
    logger.error(err);
  });
}

function testSearch() {
  const args = [
    { searchType: "chemicalName", pattern: "wasser" },
    { searchType: "empiricalFormula", pattern: "h2" },
    { searchType: "numbers", pattern: "701" },
  ];
  promisified({ cmd: "search", arguments: args }).then((res) => {
    logger.debug(res);
  }).catch((err) => {
    logger.error(err);
  });
}

function testArticle() {
  promisified({ cmd: "article", zvgNumber: "520030" }).then((res) => {
    logger.debug(res);
  }).catch((err) => {
    logger.error(err);
  });
}
