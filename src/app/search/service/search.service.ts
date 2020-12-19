import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { promisified } from 'tauri/api/tauri';

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

    quickSearch(searchType: string, query: string): Observable<string[]> {
        return from(
            promisified<string[]>({
                cmd: 'quickSearchSuggestions',
                pattern: query,
                searchType: this.searchTypeMapping.get(searchType)
            })
        );
    }
}
