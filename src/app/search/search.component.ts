import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {SearchDialogComponent} from './search-dialog/search-dialog.component';
import {SearchArgument, SearchResult} from '../@core/services/search/search.model';
import {SearchService} from '../@core/services/search/search.service';
import {SelectedSearchComponent} from './selected-search/selected-search.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  res: SearchArgument[] = [];
  control = new FormControl();

  selectedResults: SearchResult[] = [];

  @ViewChild(SelectedSearchComponent)
  selectedSearch: SelectedSearchComponent | undefined;

  constructor(
    private searchService: SearchService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    // TODO get specificationjson from backend as synchron callback
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      data: {
        arguments: this.selectedSearch?.onSubmit(),
        results: this.selectedResults,
      },
      maxWidth: 1500,
      minWidth: 800,
      maxHeight: 900,
      minHeight: 300,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedResults = result;
      }
    });
  }
}
