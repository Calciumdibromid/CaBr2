import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { EditSearchResultsComponent } from './edit-search-results/edit-search-results.component';
import { FormControl } from '@angular/forms';
import { GlobalModel } from '../@core/models/global.model';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

import { Data, SubstanceData } from '../@core/services/substances/substances.model';
import { SearchArgument } from '../@core/services/search/search.model';
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

  dataSource!: MatTableDataSource<SubstanceData>;
  foo!: SubstanceData[];

  constructor(
    private searchService: SearchService,
    private substanceService: SubstancesService,
    private dialog: MatDialog,
    public globals: GlobalModel,
  ) {}

  ngOnInit(): void {
    // TODO get specificationjson from backend as synchron callback
    this.globals.substanceDataObservable.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      // this.foo = data;
    });
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
        .subscribe(value => {
          const data = this.globals.substanceDataSubject.getValue();
          data.push(value);
          this.dataSource.connect().next(data);
          this.globals.substanceDataSubject.next(data);
        });
    });
  }

  openResultDialog(data: SubstanceData): void {
    const index = this.globals.substanceDataSubject.getValue().indexOf(data);

    this.dialog
      .open(EditSearchResultsComponent, {
        data: { index },
        maxWidth: 1500,
        minWidth: 800,
        maxHeight: 900,
        minHeight: 300,
      })
      .afterClosed()
      .subscribe(() => {
        // this hack is needed to update the table view
        this.dataSource.data = this.dataSource.data;
      });
  }

  removeSubstance(data: SubstanceData, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.globals.substanceDataObservable
      .pipe(
        tap((value) => {
          const index = value.indexOf(data);
          value.splice(index, 1);
        }),
      )
      .subscribe((value) => {
        this.dataSource.connect().next(value);
      });
  }
}
