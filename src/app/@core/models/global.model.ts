import { BehaviorSubject } from 'rxjs';
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

  // new shit

  headerSubject = new BehaviorSubject<Header>(
    {
      assistant: '',
      documentTitle: '',
      labCourse: '',
      name: '',
      organisation: '',
      place: '',
      preparation: '',
    }
  );
  headerObservable = this.headerSubject.asObservable();

  searchResultSubject = new BehaviorSubject<SearchResult[]>([]);
  searchResultObservable = this.searchResultSubject.asObservable();

  substanceDataSubject = new BehaviorSubject<SubstanceData[]>([]);
  substanceDataObservable = this.substanceDataSubject.asObservable();

  humanAndEnvironmentDangerSubject = new BehaviorSubject<string[]>([]);
  humanAndEnvironmentDangerObservable = this.humanAndEnvironmentDangerSubject.asObservable();

  rulesOfConductSubject = new BehaviorSubject<string[]>([]);
  rulesOfConductObservable = this.rulesOfConductSubject.asObservable();

  inCaseOfDangerSubject = new BehaviorSubject<string[]>([]);
  inCaseOfDangerObservable = this.inCaseOfDangerSubject.asObservable();

  disposalSubject = new BehaviorSubject<string[]>([]);
  disposalObservable = this.disposalSubject.asObservable();

  ghsSymbolsSubject = new BehaviorSubject<GHSSymbols>(new Map<string, string>());
  ghsSymbolsObservable = this.ghsSymbolsSubject.asObservable();

  setGHSSymbols(newSymbols: GHSSymbols) {
    // newSymbols is just an object
    this.ghsSymbols = new Map(Object.entries(newSymbols));
  }
}

export type GHSSymbols = Map<string, string>;
