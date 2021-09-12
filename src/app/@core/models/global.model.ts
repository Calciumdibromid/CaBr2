import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import DocsTemplate from '../interfaces/DocTemplate';
import { Header } from '../interfaces/Header';
import { SearchResult } from '../services/provider/provider.model';
import { SubstanceData } from './substances.model';

@Injectable()
export class GlobalModel {
  ghsSymbols: GHSSymbols = new Map();
  ghsSymbolKeys: string[] = [];

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

  constructor(private sanitizer: DomSanitizer) {}

  setGHSSymbols(newSymbols: GHSSymbols) {
    this.ghsSymbols = newSymbols;
    this.ghsSymbolKeys = Array.from(newSymbols.keys());

    this.ghsSymbolKeys.sort();
  }

  loadTemplate(docsTemplate: DocsTemplate): void {
    this.headerSubject.next({ ...docsTemplate.header });
    this.humanAndEnvironmentDangerSubject.next(docsTemplate.humanAndEnvironmentDanger);
    this.rulesOfConductSubject.next(docsTemplate.rulesOfConduct);
    this.inCaseOfDangerSubject.next(docsTemplate.inCaseOfDanger);
    this.disposalSubject.next(docsTemplate.disposal);

    this.substanceDataSubject.next([]);
  }
}

export type GHSSymbols = Map<string, SafeResourceUrl>;
