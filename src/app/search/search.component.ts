import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, defaultIfEmpty } from 'rxjs/operators'
import { SearchService } from './service/search.service';
import { SearchResult } from './service/search.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchQuery: string = '';
  results: string[] = [];
  control = new FormControl();
  filteredResults: Observable<string[]> = new Observable;

  searchOptions = this.searchService.searchOptions;

  placeholder: string = this.searchOptions[0];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(result => this.searchService.searchSuggestions(this.placeholder, result)
        .subscribe(response => {
          this.results = response;
        })
      );
  }
}
