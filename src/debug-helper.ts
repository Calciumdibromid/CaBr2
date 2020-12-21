import { promisified } from 'tauri/api/tauri';
import { SearchArguments } from './app/search/service/search.model';
import { SearchService } from './app/search/service/search.service';
import logger from './app/utils/logger';

export default function debugMain() {
  logger.warning("======== frontend debugging file called ========")

  testSearchSuggestions();
  testSearch();
  // testArticle();

  logger.warning("======== end of frontend debugging calls ========")
}

const service = new SearchService();

function testSearchSuggestions() {
  service.searchSuggestions("chemicalName", "salzsäure").subscribe((res) => {
    logger.debug(res);
  });
}

function testSearch() {
  const args: SearchArguments = {
    // exact: true,
    arguments: [
      { searchType: "chemicalName", pattern: "wasser" },
      { searchType: "empiricalFormula", pattern: "h2" },
      { searchType: "numbers", pattern: "701" },
    ]
  };
  service.search(args).subscribe((res) => {
    logger.debug(res);
  });
}

function testArticle() {
  promisified({ cmd: "article", zvgNumber: "520030" }).then((res) => {
    logger.debug(res);
  }).catch((err) => {
    logger.error(err);
  });
}
