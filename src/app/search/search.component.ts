import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SearchService } from './service/search.service';

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
      .subscribe(result => this.searchService.quickSearch(this.placeholder, result)
        .subscribe(response => {
          this.results = response;
        }));
  }

}
