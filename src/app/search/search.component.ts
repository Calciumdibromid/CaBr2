import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { SearchArgument } from '../@core/services/search/search.model';
import { SearchService } from '../@core/services/search/search.service';
import { SelectedSearchComponent } from './selected-search/selected-search.component';
import { GlobalModel } from '../@core/models/global.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild(SelectedSearchComponent)
  selectedSearch: SelectedSearchComponent | undefined;

  res: SearchArgument[] = [];
  control = new FormControl();

  constructor(
    private searchService: SearchService,
    private dialog: MatDialog,
    public globals: GlobalModel,
  ) {
  }

  ngOnInit(): void {
    // TODO get specificationjson from backend as synchron callback
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      data: {
        arguments: this.selectedSearch?.onSubmit(),
        results: this.globals.searchResults,
      },
      maxWidth: 1500,
      minWidth: 800,
      maxHeight: 900,
      minHeight: 300,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.globals.searchResults = result;
      }
    });
  }
}
