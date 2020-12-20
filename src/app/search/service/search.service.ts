import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { promisified } from 'tauri/api/tauri';
import { SearchArgument, SearchResult } from './search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchTypeMapping = new Map([
    ['Stoffname', 'chemicalName'],
    ['Summenformel', 'empiricalFormula'],
    ['Nummern', 'numbers'],
    ['Volltext', 'fullText'],
  ]);

  public searchOptions = Array.from(this.searchTypeMapping.keys());

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
  searchSuggestions(searchType: string, query: string): Observable<string[]> {
    return from(
      promisified<string[]>({
        cmd: 'searchSuggestions',
        pattern: query,
        searchType: this.searchTypeMapping.get(searchType)
      })
    );
  }

  /**
   * Returns a SearchResult[] with objects!.
   * 
   * For example:
   * 
   * ```ts
   * [
   *   {name: "Wasser", casNumber: "7732-18-5", zvgNumber: "001140"},
   *   {name: "Wasserstoff", casNumber: "1333-74-0", zvgNumber: "007010"},
   *   {name: "wasserstoffperoxid", casNumber: "7722-84-1", zvgNumber: "536373"}
   * ]
   * ```
   */
  search(args: SearchArgument[]): Observable<SearchResult[]> {
    return from(
      promisified<SearchResult[]>({
        cmd: 'search',
        arguments: args,
      })
    );
  }
}
