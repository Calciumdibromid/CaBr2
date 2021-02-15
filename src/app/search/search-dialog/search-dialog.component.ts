import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SearchArgument, SearchResult } from '../../@core/services/search/search.model';
import { Observable } from 'rxjs';
import { SearchService } from '../../@core/services/search/search.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  searchResults: SearchResult[] = [];
  exactSearch = false;
  subscription: Observable<SearchResult[]> | undefined;
  selected: SearchResult | undefined;

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { arguments: SearchArgument[]; results: SearchResult[] },
    private searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.searchService.search({
      arguments: this.data.arguments,
      exact: this.exactSearch,
    });

    this.subscription.subscribe((response) => {
      this.searchResults = response;
    });
  }

  setSelected(selected: SearchResult): void {
    this.selected = selected;
  }

  submit(): void {
    if (this.selected) {
      this.data.results.push(this.selected);
      this.dialogRef.close();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleExactSearch(): void {
    this.searchResults = [];
    this.ngOnInit();
  }
}
