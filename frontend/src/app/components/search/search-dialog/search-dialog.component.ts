import { catchError, Observable, of } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { translate } from '@ngneat/transloco';

import { Provider, SearchArgument, SearchResult } from '../../../@core/services/provider/provider.model';
import { AlertService } from '../../../@core/services/alertsnackbar/alertsnackbar.service';
import { IProviderService } from '../../../@core/services/provider/provider.interface';
import Logger from '../../../@core/utils/logger';

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
  searchResults$?: Observable<SearchResult[]>;

  searchFailed = false;

  exactSearch = false;

  selected?: SearchResult;

  private logger = new Logger(SearchDialogComponent.name);

  constructor(
    public readonly dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: Data,

    private readonly providerService: IProviderService,
    private readonly alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.searchFailed = false;
    this.searchResults$ = this.providerService
      .search(this.data.provider.identifier, {
        arguments: this.data.arguments,
        exact: this.exactSearch,
      })
      .pipe(
        catchError((err) => {
          this.searchFailed = true;
          this.logger.error('loading search results failed:', err);
          this.alertService.error(translate('error.loadSearchResults'));
          return of([]);
        }),
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
    // this.exactSearch is toggled inside the HTML
    this.ngOnInit();
  }
}
