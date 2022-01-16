import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { translate } from '@ngneat/transloco';

import { Provider, SearchArgument, SearchResult } from '../../../@core/services/provider/provider.model';
import { AlertService } from '../../../@core/services/alertsnackbar/altersnackbar.service';
import { IProviderService } from '../../../@core/services/provider/provider.interface';
import Logger from '../../../@core/utils/logger';

const logger = new Logger('search-dialog');

interface Data {
  arguments: SearchArgument[];
  provider: Provider;
}

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
})
export class SearchDialogComponent implements OnInit {
  searchResults: SearchResult[] = [];
  searchFinished = false;
  searchFailed = false;
  exactSearch = false;
  subscription?: Observable<SearchResult[]>;
  selected?: SearchResult;

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,

    private providerService: IProviderService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.providerService.search(this.data.provider.identifier, {
      arguments: this.data.arguments,
      exact: this.exactSearch,
    });

    this.searchResults = [];
    this.searchFinished = false;
    this.searchFailed = false;
    this.subscription.subscribe(
      (response) => {
        this.searchResults = response;
        this.searchFinished = true;
      },
      (err) => {
        this.searchFinished = true;
        this.searchFailed = true;
        logger.error('loading search results failed:', err);
        this.alertService.error(translate('loadSearchResults'));
      },
    );
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
