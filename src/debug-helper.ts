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
  promisified({ cmd: "search", searchType: "chemicalName", pattern: "salzsäure" }).then((res) => {
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
