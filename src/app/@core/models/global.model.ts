import { Header } from '../interfaces/Header';
import { Injectable } from '@angular/core';
import { SearchResult } from '../services/search/search.model';
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

  humanAndEnvironmentDanger: string[] = [];

  rulesOfConduct: string[] = [];

  inCaseOfDanger: string[] = [];

  disposal: string[] = [];

  ghsSymbols: GHSSymbols = new Map();

  setGHSSymbols(newSymbols: GHSSymbols) {
    // newSymbols is just an object
    this.ghsSymbols = new Map(Object.entries(newSymbols));
  }

}

export type GHSSymbols = Map<string, string>;
