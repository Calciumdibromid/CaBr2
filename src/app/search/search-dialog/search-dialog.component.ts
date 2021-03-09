import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SearchArgument, SearchResult } from '../../@core/services/search/search.model';
import { AlertService } from 'src/app/@core/services/alertsnackbar/altersnackbar.service';
import Logger from 'src/app/@core/utils/logger';
import { Observable } from 'rxjs';
import { SearchService } from '../../@core/services/search/search.service';

const logger = new Logger('search-dialog');

import { strings } from '../../../assets/strings.json';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  searchResults: SearchResult[] = [];
  searchFinished = false;
  searchFailed = false;
  exactSearch = false;
  subscription: Observable<SearchResult[]> | undefined;
  selected: SearchResult | undefined;

  strings = strings;

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { arguments: SearchArgument[]; results: SearchResult[] },
    private searchService: SearchService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.searchService.search({
      arguments: this.data.arguments,
      exact: this.exactSearch,
    });

    this.searchResults = [];
    this.searchFinished = false;
    this.searchFailed = false;
    this.subscription.subscribe((response) => {
      this.searchResults = response;
      this.searchFinished = true;
    },
      (err) => {
        this.searchFinished = true;
        this.searchFailed = true;
        logger.error('loading search results failed:', err);
        this.alertService.error(strings.error.loadSearchResults);
      });
  }

  setSelected(selected: SearchResult): void {
    this.selected = selected;
  }

  close(abort: boolean): void {
    if (abort) {
      this.selected = undefined;
    }
    this.dialogRef.close(this.selected);
  }

  toggleExactSearch(): void {
    this.ngOnInit();
  }
}
