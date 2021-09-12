import { BehaviorSubject, from, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import * as wasm from 'cabr2_wasm';
import {
  Provider,
  ProviderMapping,
  SearchArguments,
  SearchResult,
  SearchType,
} from '../provider.model';
import { IProviderService } from '../provider.interface';
import { SubstanceData } from 'src/app/@core/models/substances.model';

@Injectable()
export class ProviderService implements IProviderService {
  providerMappingsSubject = new BehaviorSubject<ProviderMapping>(new Map());
  providerMappingsObservable = this.providerMappingsSubject.asObservable();

  constructor() {
    this.getAvailableProviders()
      .pipe(first())
      .subscribe((providers) => this.providerMappingsSubject.next(new Map(providers.map((p) => [p.identifier, p]))));
  }

  getAvailableProviders(): Observable<Provider[]> {
    return from(wasm.get_available_providers() as Promise<string>).pipe(map((providers) => JSON.parse(providers)));
  }

  searchSuggestions(provider: string, searchType: SearchType, query: string): Observable<string[]> {
    return from(wasm.search_suggestions(provider, query, JSON.stringify(searchType)) as Promise<string>).pipe(
      map((suggestions) => JSON.parse(suggestions)),
    );
  }

  search(provider: string, args: SearchArguments): Observable<SearchResult[]> {
    return from(wasm.search_results(provider, JSON.stringify(args)) as Promise<string>).pipe(
      map((results) => JSON.parse(results)),
    );
  }

  substanceData(provider: string, identifier: string): Observable<SubstanceData> {
    return from(wasm.substance_data(provider, identifier) as Promise<string>).pipe(
      map((substance) => JSON.parse(substance)),
    );
  }
}
