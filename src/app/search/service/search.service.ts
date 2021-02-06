import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {promisified} from 'tauri/api/tauri';
import {SearchArguments, SearchResult, SearchType, SearchTypeMapping} from './search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public searchTypeMappings: SearchTypeMapping[] = [
    {viewValue: 'Stoffname', value: 'chemicalName'},
    {viewValue: 'Summenformel', value: 'empiricalFormula'},
    {viewValue: 'Nummern', value: 'numbers'},
    {viewValue: 'Volltext', value: 'fullText'},
  ];

  constructor() {
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
    return from(
      promisified<string[]>({
        cmd: 'searchSuggestions',
        pattern: query,
        searchType: searchType
      })
    );
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
    return from(
      promisified<SearchResult[]>({
        cmd: 'search',
        arguments: args,
      })
    );
  }
}
