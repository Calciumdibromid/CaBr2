import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { IProviderService, PROVIDER_SERVICE } from '../../@core/services/provider/provider.interface';
import { SearchArgument, SearchResult } from '../../@core/services/provider/provider.model';
import { AlertService } from '../../@core/services/alertsnackbar/altersnackbar.service';
import { GlobalModel } from '../../@core/models/global.model';
import { LocalizedStrings } from '../../@core/services/i18n/i18n.interface';
import Logger from '../../@core/utils/logger';

const logger = new Logger('search-dialog');

interface Data {
  arguments: SearchArgument[];
  providerIdentifier: string;
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
  subscription: Observable<SearchResult[]> | undefined;
  selected: SearchResult | undefined;

  strings!: LocalizedStrings;

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,

    private globals: GlobalModel,
    @Inject(PROVIDER_SERVICE) private providerService: IProviderService,
    private alertService: AlertService,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {
    this.subscription = this.providerService.search(this.data.providerIdentifier, {
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
        this.alertService.error(this.strings.error.loadSearchResults);
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
