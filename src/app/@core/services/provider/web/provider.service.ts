import {
  Provider,
  ProviderMapping,
  SearchArguments,
  SearchResult,
  SearchType,
  SearchTypeMapping,
} from '../provider.model';

import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
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

  getAvailableProviders(): Observable<Provider[]> {
    throw new Error('Method not implemented.');
  }
  searchSuggestions(provider: string, searchType: SearchType, query: string): Observable<string[]> {
    throw new Error('Method not implemented.');
  }
  search(provider: string, args: SearchArguments): Observable<SearchResult[]> {
    throw new Error('Method not implemented.');
  }
  substanceData(provider: string, identifier: string): Observable<SubstanceData> {
    throw new Error('Method not implemented.');
  }
}
