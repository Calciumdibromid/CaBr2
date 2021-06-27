import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { GlobalModel } from '../../models/global.model';
import { IProviderService } from './provider.interface';

import {
  Provider,
  ProviderMapping,
  SearchArguments,
  SearchResult,
  SearchType,
  SearchTypeMapping,
  searchTypes,
} from './provider.model';
import { INativeService } from '../native/native.interface';
import { SubstanceData } from '../../models/substances.model';

@Injectable()
export class ProviderService implements IProviderService {
  searchTypeMappingsSubject = new BehaviorSubject<SearchTypeMapping[]>([]);
  searchTypeMappingsObservable = this.searchTypeMappingsSubject.asObservable();

  providerMappingsSubject = new BehaviorSubject<ProviderMapping>(new Map());
  providerMappingsObservable = this.providerMappingsSubject.asObservable();

  constructor(private nativeService: INativeService, private globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) =>
      this.searchTypeMappingsSubject.next(searchTypes.map((t) => ({ viewValue: strings.search.types[t], value: t }))),
    );

    this.getAvailableProviders()
      .pipe(first())
      .subscribe((providers) => this.providerMappingsSubject.next(new Map(providers.map((p) => [p.identifier, p]))));
  }

  getAvailableProviders(): Observable<Provider[]> {
    return this.nativeService.promisified('plugin:cabr2_search|get_available_providers');
  }

  searchSuggestions(provider: string, searchType: SearchType, query: string): Observable<string[]> {
    return this.nativeService.promisified('plugin:cabr2_search|search_suggestions', {
      provider,
      pattern: query,
      searchType,
    });
  }

  search(provider: string, args: SearchArguments): Observable<SearchResult[]> {
    return this.nativeService.promisified('plugin:cabr2_search|search', {
      provider,
      arguments: args,
    });
  }

  substanceData(provider: string, identifier: string): Observable<SubstanceData> {
    return this.nativeService.promisified('plugin:cabr2_search|get_substance_data', {
      provider,
      identifier,
    });
  }
}
