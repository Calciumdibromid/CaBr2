import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { SearchArgument } from '../@core/services/search/search.model';
import { SearchService } from '../@core/services/search/search.service';
import { SelectedSearchComponent } from './selected-search/selected-search.component';
import { GlobalModel } from '../@core/models/global.model';
import { SubstancesService } from '../@core/services/substances/substances.service';
import { SubstanceData } from '../@core/services/substances/substances.model';
import { EditSearchResultsComponent } from './edit-search-results/edit-search-results.component';

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

  constructor(
    private searchService: SearchService,
    private substanceService: SubstancesService,
    private dialog: MatDialog,
    public globals: GlobalModel
  ) { }

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

    dialogRef.afterClosed().subscribe(() => {
      this.substanceService
        .substanceInfo(this.globals.searchResults[this.globals.searchResults.length - 1].zvgNumber)
        .subscribe((value) => {
          this.globals.substanceData.push(value);
          console.log(this.globals.substanceData);
        });
    });
  }

  openResultDialog(index: number): void {
    const dialogRef = this.dialog.open(EditSearchResultsComponent, {
      data: { index },
      maxWidth: 1500,
      minWidth: 800,
      maxHeight: 900,
      minHeight: 300,
    });
  }
}
