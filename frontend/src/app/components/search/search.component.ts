import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { translate } from '@ngneat/transloco';

import {
  AddSubstanceData,
  ModifySubstanceData,
  RearrangeSubstanceData,
  RemoveSubstanceData,
} from '../../@core/states/substance-data.state';
import { Provider, ProviderMapping } from '../../@core/services/provider/provider.model';
import { Source, SubstanceData } from '../../@core/models/substances.model';
import { AlertService } from '../../@core/services/alertsnackbar/alertsnackbar.service';
import { INativeService } from '../../@core/services/native/native.interface';
import { IProviderService } from '../../@core/services/provider/provider.interface';
import Logger from '../../@core/utils/logger';

import { EditSubstanceDataComponent } from '../edit-substance-data/edit-substance-data.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { SelectedSearchComponent } from './selected-search/selected-search.component';

const logger = new Logger('search');

const GESTIS_URL_RE = new RegExp('https:\\/\\/gestis-api\\.dguv\\.de\\/api\\/article\\/(de|en)\\/(\\d{6})');

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChildren(SelectedSearchComponent)
  selectedSearchComponents!: QueryList<SelectedSearchComponent>;

  @Select((state: any) => state.substance_data.substanceData) substanceData$!: Observable<SubstanceData[]>;

  addButtonHover = false;

  providerMapping!: ProviderMapping;

  providers: Provider[] = [];

  index = 0;

  displayedColumns = ['edited', 'name', 'cas', 'source', 'actions'];

  dataSource = new MatTableDataSource<SubstanceData>([]);

  constructor(
    private providerService: IProviderService,
    private nativeService: INativeService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.substanceData$.subscribe((data) => {
      this.dataSource.connect().next(data);
    });

    this.providerService.providerMappingsObservable.subscribe((providerMap) => {
      logger.debug(providerMap);
      this.providerMapping = providerMap;
      this.providers = Array.from(providerMap.values()).filter((provider) => provider.identifier !== 'custom');
    });
  }

  openDialog(index: number): void {
    const provider = this.providers[index];
    const currentSearchComponent = this.selectedSearchComponents.find((_, i) => i === index);
    const searchArguments = currentSearchComponent?.getSearchArguments();

    const dialogRef = this.dialog.open(SearchDialogComponent, {
      data: {
        arguments: searchArguments,
        provider,
      },
      panelClass: ['unselectable', 'undragable'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.providerService.substanceData(provider.identifier, result.zvgNumber).subscribe({
          next: (value) => {
            logger.debug(value);
            this.store.dispatch(new AddSubstanceData(value));
          },
          error: (err) => {
            logger.error('could not get substance information:', err);
            this.alertService.error(translate('error.substanceLoadData'));
          },
        });

        currentSearchComponent?.clear();
      }
    });
  }

  openEditDialog(origData: SubstanceData): void {
    this.dialog
      .open(EditSubstanceDataComponent, {
        data: origData,
        maxWidth: 1500,
        minWidth: 800,
        maxHeight: 900,
        minHeight: 300,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe({
        next: (substanceData?: SubstanceData) => {
          // substanceData is only filled if editing was successful
          if (substanceData) {
            this.store.dispatch(new ModifySubstanceData(origData, substanceData));
          }
        },
        error: (err) => {
          logger.error('editing substance failed:', err);
          this.alertService.error(translate('error.editSubstance'));
        },
      });
  }

  removeSubstance(event: MouseEvent, data: SubstanceData): void {
    event.preventDefault();
    event.stopPropagation();

    this.store.dispatch(new RemoveSubstanceData(data));
  }

  sourceButtonDisabled(source: Source): boolean {
    return source.provider === 'custom' || !this.providerMapping.has(source.provider);
  }

  openSource(event: MouseEvent, source: Source): void {
    event.preventDefault();
    event.stopPropagation();
    const matches = source.url.match(GESTIS_URL_RE);
    if (matches) {
      // TODO (#526) move the url to providers
      this.nativeService.openUrl(`https://gestis.dguv.de/data?name=${matches[2]}&lang=${matches[1]}`);
    }
  }

  addCustomSubstanceData(): void {
    this.store.dispatch(new AddSubstanceData(new SubstanceData({ checked: true })));
  }

  getProviderName(source: Source): string {
    if (source.provider === 'custom') {
      return translate('search.customSubstance');
    } else {
      const provider = this.providerMapping.get(source.provider);
      return provider ? provider.name : `${source.provider} (${translate('search.unsupportedProviderInfo')})`;
    }
  }

  drop(event: CdkDragDrop<string[]> | any): void {
    this.store.dispatch(new RearrangeSubstanceData(event));
  }
}
