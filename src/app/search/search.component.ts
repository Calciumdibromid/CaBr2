import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

import { Data, Source, SubstanceData } from '../@core/services/substances/substances.model';
import { AlertService } from '../@core/services/alertsnackbar/altersnackbar.service';
import { EditSearchResultsComponent } from './edit-search-results/edit-search-results.component';
import { GlobalModel } from '../@core/models/global.model';
import Logger from '../@core/utils/logger';
import { SearchArgument } from '../@core/services/search/search.model';
import { SelectedSearchComponent } from './selected-search/selected-search.component';
import { SubstancesService } from '../@core/services/substances/substances.service';
import { TauriService } from '../@core/services/tauri/tauri.service';

const logger = new Logger('search');

const GESTIS_URL_RE = new RegExp('https:\\/\\/gestis-api\\.dguv\\.de\\/api\\/article\\/(de|en)\\/(\\d{6})');

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
    private tauriService: TauriService,
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.substanceService
          .substanceInfo(result.zvgNumber)
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
      }
    });
  }

  openResultDialog(origData: SubstanceData): void {
    this.dialog
      .open(EditSearchResultsComponent, {
        data: origData,
        maxWidth: 1500,
        minWidth: 800,
        maxHeight: 900,
        minHeight: 300,
      })
      .afterClosed()
      .subscribe((substanceData?: SubstanceData) => {
        // substanceData is only filled if editing was successful
        if (substanceData) {
          const newData = this.globals.substanceDataSubject.getValue();
          const index = newData.indexOf(origData);
          newData[index] = substanceData;
          this.globals.substanceDataSubject.next(newData);
        }
      });
  }

  removeSubstance(event: MouseEvent, data: SubstanceData): void {
    event.preventDefault();
    event.stopPropagation();

    this.globals.substanceDataObservable
      .subscribe((value) => {
        const index = value.indexOf(data);
        value.splice(index, 1);
        this.dataSource.connect().next(value);
      });
  }

  userUrlAvailable(source: Source): boolean {
    return !GESTIS_URL_RE.test(source.url);
  }

  openSource(event: MouseEvent, source: Source): void {
    event.preventDefault();
    event.stopPropagation();
    const matches = source.url.match(GESTIS_URL_RE);
    if (matches) {
      this.tauriService.openUrl(`https://gestis.dguv.de/data?name=${matches[2]}&lang=${matches[1]}`);
    }
  }

  // TODO move to SubstanceData class
  private modifiedOrOriginal<T>(obj: Data<T>): T {
    return obj.modifiedData ?? obj.originalData;
  }
}
