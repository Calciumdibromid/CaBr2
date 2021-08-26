import { BehaviorSubject, Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import {
  Provider,
  ProviderMapping,
  SearchArguments,
  SearchResult,
  SearchType,
  SearchTypeMapping,
  searchTypes,
} from '../provider.model';
import { get_available_providers, search_suggestions } from 'cabr2_wasm';
import { GlobalModel } from 'src/app/@core/models/global.model';
import { IProviderService } from '../provider.interface';
import { SubstanceData } from 'src/app/@core/models/substances.model';

/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO use vars and remove this lines
@Injectable()
export class ProviderService implements IProviderService {
  searchTypeMappingsSubject = new BehaviorSubject<SearchTypeMapping[]>([]);
  searchTypeMappingsObservable = this.searchTypeMappingsSubject.asObservable();

  providerMappingsSubject = new BehaviorSubject<ProviderMapping>(new Map());
  providerMappingsObservable = this.providerMappingsSubject.asObservable();

  constructor(private globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) =>
      this.searchTypeMappingsSubject.next(searchTypes.map((t) => ({ viewValue: strings.search.types[t], value: t }))),
    );

    this.getAvailableProviders()
      .pipe(first())
      .subscribe((providers) => this.providerMappingsSubject.next(new Map(providers.map((p) => [p.identifier, p]))));
  }

  getAvailableProviders(): Observable<Provider[]> {
    return of(JSON.parse(get_available_providers()));
  }

  searchSuggestions(provider: string, searchType: SearchType, query: string): Observable<string[]> {
    return new Observable((sub) => {
      search_suggestions(provider, query, JSON.stringify(searchType))
        .then((res: string) => sub.next(JSON.parse(res)))
        .catch((err: string) => {
          console.error(err);
        sub.error(err)
      });
    });
  }

  search(provider: string, args: SearchArguments): Observable<SearchResult[]> {
    throw new Error('Method not implemented.');
  }

  substanceData(provider: string, identifier: string): Observable<SubstanceData> {
    throw new Error('Method not implemented.');
  }
}
