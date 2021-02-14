import { promisified } from 'tauri/api/tauri';
import { SearchArguments } from './app/@core/services/search/search.model';
import { SearchService } from './app/@core/services/search/search.service';
import logger from './app/@core/utils/logger';
import { TauriService } from './app/@core/services/tauri/tauri.service';

const debugMain = () => {
  logger.warning('======== frontend debugging file called ========');

  // testSearchSuggestions();
  // testSearch();
  // testSubstanceData();
  // testLoadBeryllium();

  logger.warning('======== end of frontend debugging calls ========');
};

export default debugMain;

const service = new SearchService(new TauriService());

const testSearchSuggestions = () => {
  service.searchSuggestions('chemicalName', 'salzsäure').subscribe((res) => {
    logger.debug(res);
  });
};

const testSearch = () => {
  const args: SearchArguments = {
    // exact: true,
    arguments: [
      { searchType: 'chemicalName', pattern: 'wasser' },
      { searchType: 'empiricalFormula', pattern: 'h2' },
      { searchType: 'numbers', pattern: '701' },
    ],
  };
  service.search(args).subscribe((res) => {
    logger.debug(res);
  });
};

const testSubstanceData = () => {
  promisified({ cmd: 'getSubstanceData', zvgNumber: '005340' })
    .then((res) => {
      logger.debug(res);
    })
    .catch((err) => {
      logger.error(err);
    });
};

const testLoadBeryllium = () => {
  promisified({ cmd: 'loadDocument', filename: '/tmp/test.be' })
    .then((res) => {
      logger.debug(res);
    })
    .catch((err) => {
      logger.error(err);
    });
};
