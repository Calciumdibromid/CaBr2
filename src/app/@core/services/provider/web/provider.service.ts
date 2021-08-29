import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { get_available_providers, search_results, search_suggestions, substance_data } from 'cabr2_wasm';
import {
  Provider,
  ProviderMapping,
  SearchArguments,
  SearchResult,
  SearchType,
  SearchTypeMapping,
  searchTypes,
} from '../provider.model';
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
    return new Observable((sub) =>
      get_available_providers()
        .then((providers: string) => sub.next(JSON.parse(providers)))
        .catch((err: any) => sub.error(err)),
    );
  }

  searchSuggestions(provider: string, searchType: SearchType, query: string): Observable<string[]> {
    return new Observable((sub) => {
      search_suggestions(provider, query, JSON.stringify(searchType))
        .then((res: string) => sub.next(JSON.parse(res)))
        .catch((err: string) => {
          console.error(err);
          sub.error(err);
        });
    });
  }

  search(provider: string, args: SearchArguments): Observable<SearchResult[]> {
    return new Observable((sub) => {
      search_results(provider, JSON.stringify(args))
        .then((res: string) => sub.next(JSON.parse(res)))
        .catch((err: string) => {
          console.error(err);
          sub.error(err);
        });
    });
  }

  substanceData(provider: string, identifier: string): Observable<SubstanceData> {
    return new Observable((sub) => {
      substance_data(provider, identifier)
        .then((res: string) => sub.next(JSON.parse(res)))
        .catch((err: string) => {
          console.error(err);
          sub.error(err);
        });
    });
  }
}
