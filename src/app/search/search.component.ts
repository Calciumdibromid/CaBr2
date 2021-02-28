import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { tap } from 'rxjs/operators';

import { Data, SubstanceData } from '../@core/services/substances/substances.model';
import { AlertService } from '../@core/services/alertsnackbar/altersnackbar.service';
import { EditSearchResultsComponent } from './edit-search-results/edit-search-results.component';
import { GlobalModel } from '../@core/models/global.model';
import logger from '../@core/utils/logger';
import { SearchArgument } from '../@core/services/search/search.model';
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

  constructor(
    private substanceService: SubstancesService,
    private alterService: AlertService,
    private dialog: MatDialog,
    public globals: GlobalModel,
  ) { }

  ngOnInit(): void {
    this.globals.substanceDataObservable.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
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
        .subscribe((value) => {
          const cas = this.modifiedOrOriginal(value.cas);
          if (
            cas && this.globals.substanceDataSubject.getValue().some(s => cas === this.modifiedOrOriginal(s.cas))
          ) {
            // TODO i18n
            this.alterService.error('Substanz mit selber CAS Nummer existiert bereits');
            logger.warning('substance with same cas number already present:', cas);
            return;
          }
          const data = [...this.globals.substanceDataSubject.getValue(), value];
          this.dataSource.connect().next(data);
          this.globals.substanceDataSubject.next(data);
        });
    });
  }

  openResultDialog(data: SubstanceData): void {
    const index = this.globals.substanceDataSubject.getValue().indexOf(data);

    this.dialog
      .open(EditSearchResultsComponent, {
        data,
        maxWidth: 1500,
        minWidth: 800,
        maxHeight: 900,
        minHeight: 300,
      })
      .afterClosed()
      .subscribe((substanceData: SubstanceData) => {
        if (substanceData) {
          const tempData = this.globals.substanceDataSubject.getValue();
          if (tempData.some((value) => substanceData, index)) {
            tempData[index] = substanceData;
            this.globals.substanceDataSubject.next(tempData);
          }
        }
      });
  }

  removeSubstance(data: SubstanceData, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // TODO move tap thing to subscribe
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

  // TODO move to SubstanceData class
  private modifiedOrOriginal<T>(obj: Data<T>): T {
    return obj.modifiedData ?? obj.originalData;
  }
}
