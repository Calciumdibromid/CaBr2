import {Injectable} from '@angular/core';
import {Header} from '../interfaces/Header';
import ListInputSpecifcations from '../interfaces/ListInputSpecifications';
import {SearchResult} from '../services/search/search.model';

@Injectable()
export class GlobalModel {
  header: Header = {
    assistant: '',
    documentTitle: '',
    labCourse: '',
    name: '',
    organisation: '',
    place: '',
    preparation: '',
  };

  searchResults: SearchResult[] = [];

  humanAndEnvironmentDanger: ListInputSpecifcations[] = [];

  rulesOfConduct: ListInputSpecifcations[] = [];

  inCaseOfDanger: ListInputSpecifcations[] = [];

  disposal: ListInputSpecifcations[] = [];

}
