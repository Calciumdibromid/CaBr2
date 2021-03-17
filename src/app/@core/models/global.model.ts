import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { I18nService, LocalizedStrings } from '../services/i18n/i18n.service';
import { Header } from '../interfaces/Header';
import { SearchResult } from '../services/provider/provider.model';
import { SubstanceData } from './substances.model';

@Injectable()
export class GlobalModel {
  ghsSymbols: GHSSymbols = new Map();

  localizedStringsSubject = new BehaviorSubject<LocalizedStrings>(I18nService.getDefaultStrings());
  localizedStringsObservable = this.localizedStringsSubject.asObservable();

  headerSubject = new BehaviorSubject<Header>({
    assistant: '',
    documentTitle: '',
    labCourse: '',
    name: '',
    organisation: '',
    place: '',
    preparation: '',
  });
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
