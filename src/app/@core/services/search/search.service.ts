import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { GlobalModel } from '../../models/global.model';
import { TauriService } from '../tauri/tauri.service';

import { SearchArguments, SearchResult, SearchType, SearchTypeMapping, searchTypes } from './search.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchTypeMappingsSubject = new BehaviorSubject<SearchTypeMapping[]>([]);
  searchTypeMappingsObservable = this.searchTypeMappingsSubject.asObservable();

  constructor(private tauriService: TauriService, private globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) =>
      this.searchTypeMappingsSubject.next(searchTypes.map((t) => ({ viewValue: strings.search.types[t], value: t }))),
    );
  }

  /**
   * Returns a string[] with names to use in an search query.
   *
   * For example:
   *
   * ```ts
   * [
   *   "wasser",
   *   "wasserstoff",
   *   "wasserstoffperoxid"
   * ]
   * ```
   */
  searchSuggestions(searchType: SearchType, query: string): Observable<string[]> {
    return this.tauriService.promisified({
      cmd: 'searchSuggestions',
      pattern: query,
      searchType,
    });
  }

  /**
   * Returns a SearchResult[] with objects!.
   *
   * For example:
   *
   * ```ts
   * // TODO
   * ```
   *
   * returns:
   *
   * ```ts
   * [
   *   {name: "Wasser", casNumber: "7732-18-5", zvgNumber: "001140"},
   *   {name: "Wasserstoff", casNumber: "1333-74-0", zvgNumber: "007010"},
   *   {name: "wasserstoffperoxid", casNumber: "7722-84-1", zvgNumber: "536373"}
   * ]
   * ```
   */
  search(args: SearchArguments): Observable<SearchResult[]> {
    return this.tauriService.promisified({
      cmd: 'search',
      arguments: args,
    });
  }
}
