import { promisified } from 'tauri/api/tauri';
import { SearchArguments } from './app/@core/services/search/search.model';
import { SearchService } from './app/@core/services/search/search.service';
import logger from './app/@core/utils/logger';

export default function debugMain() {
  logger.warning("======== frontend debugging file called ========");

  // testSearchSuggestions();
  // testSearch();
  // testSubstanceData();
  testLoadBeryllium();

  logger.warning("======== end of frontend debugging calls ========");
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
    ],
  };
  service.search(args).subscribe((res) => {
    logger.debug(res);
  });
}

function testSubstanceData() {
  promisified({ cmd: "getChemicalInfo", zvgNumber: "005340" })
    .then((res) => {
      logger.debug(res);
    })
    .catch((err) => {
      logger.error(err);
    });
}

function testLoadBeryllium() {
  promisified({ cmd: "loadDocument", filename: "/tmp/test.be" })
    .then((res) => {
      logger.debug(res);
    })
    .catch((err) => {
      logger.error(err);
    });
}
