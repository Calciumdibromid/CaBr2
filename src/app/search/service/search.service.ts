import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, throwError } from "rxjs";
import { promisified } from 'tauri/api/tauri';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor() {
    }

    public static handleError(err: HttpErrorResponse | any) {
        return throwError(err.message || 'Error: Unable to complete search');
    }

    quickSearch(searchType: string, query: string): Observable<string[]> {
        return from(
            promisified<string[]>({
                cmd: 'quickSearchSuggestions',
                pattern: query,
                searchType: this.mapper(searchType)
            })
        );
    }

    // TODO have fun @crapStone ;)
    mapper(searchType: string): string {
        if (searchType === 'Stoffname') {
            return 'chemicalName';
        }
        
        if (searchType === 'Summenformel') {
            return 'empiricalFormula';
        }
        
        if (searchType === 'Nummern') {
            return 'numbers';
        }
        
        if (searchType === 'Volltext') {
            return 'fullText';
        }
        throw new Error('Something went wrong...');
    }
}
