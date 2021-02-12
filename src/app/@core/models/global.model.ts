import {Injectable} from '@angular/core';
import {Header} from '../interfaces/Header';
import ListInputSpecifcations from '../interfaces/ListInputSpecifications';
import {SearchResult} from '../services/search/search.model';
import { SubstanceData } from '../services/substances/substances.model';

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

  substanceData: SubstanceData[] = [];

  humanAndEnvironmentDanger: ListInputSpecifcations[] = [];

  rulesOfConduct: ListInputSpecifcations[] = [];

  inCaseOfDanger: ListInputSpecifcations[] = [];

  disposal: ListInputSpecifcations[] = [];

}
