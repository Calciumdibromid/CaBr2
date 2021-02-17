import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { EditSearchResultsComponent } from './edit-search-results/edit-search-results.component';
import { FormControl } from '@angular/forms';
import { GlobalModel } from '../@core/models/global.model';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

import { Data, SubstanceData } from '../@core/services/substances/substances.model';
import { SearchArgument, SearchResult } from '../@core/services/search/search.model';
import { SearchService } from '../@core/services/search/search.service';
import { SelectedSearchComponent } from './selected-search/selected-search.component';
import { SubstancesService } from '../@core/services/substances/substances.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild(SelectedSearchComponent)
  selectedSearch: SelectedSearchComponent | undefined;

  res: SearchArgument[] = [];
  control = new FormControl();

  substanceData: SubstanceData[] = [];

  displayedColumns = ['name', 'cas', 'actions'];

  dataSource!: MatTableDataSource<SearchResult>;

  constructor(
    private searchService: SearchService,
    private substanceService: SubstancesService,
    private dialog: MatDialog,
    public globals: GlobalModel,
  ) {
    this.dataSource = new MatTableDataSource(this.globals.searchResults);
  }

  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource(this.globals.searchResults);
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

    dialogRef.afterClosed().subscribe(() => {
      this.substanceService
        .substanceInfo(this.globals.searchResults[this.globals.searchResults.length - 1].zvgNumber)
        .subscribe((value) => {
          this.globals.substanceData.push(value);
          console.log(this.globals.substanceData);
        });
      this.dataSource.data = this.dataSource.data;
    });
  }

  openResultDialog(data: SearchResult): void {
    const index = this.globals.searchResults.indexOf(data);

    const dialogRef = this.dialog.open(EditSearchResultsComponent, {
      data: { index },
      maxWidth: 1500,
      minWidth: 800,
      maxHeight: 900,
      minHeight: 300,
    });
  }

  removeSubstance(data: SearchResult, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const index = this.globals.searchResults.indexOf(data);
    this.globals.substanceData.splice(index, 1);
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;
  }
}
