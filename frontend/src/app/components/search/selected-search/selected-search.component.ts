import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { SearchArgument, SearchType, searchTypes } from '../../../@core/services/provider/provider.model';
import { AlertService } from '../../../@core/services/alertsnackbar/alertsnackbar.service';
import { IProviderService } from '../../../@core/services/provider/provider.interface';
import Logger from '../../../@core/utils/logger';
import { translate } from '@ngneat/transloco';

const logger = new Logger('selected-search');

@Component({
  selector: 'app-selected-search',
  templateUrl: './selected-search.component.html',
  styleUrls: ['./selected-search.component.scss'],
})
export class SelectedSearchComponent {
  @Output()
  triggerSearch = new EventEmitter();

  @Input()
  providerIdentifier!: string;

  searchOptions = searchTypes;

  form: UntypedFormGroup = this.formBuilder.group({
    selections: this.formBuilder.array([this.initSelectionForm()]),
  });

  suggestionResults: Map<SearchType, string[]> = new Map(searchTypes.map((t) => [t, []]));

  addButtonHover = false;

  bpLoaded = false;

  constructor(
    private providerService: IProviderService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  get selections(): UntypedFormArray {
    return this.form?.get('selections') as UntypedFormArray;
  }

  addSearchOption(): void {
    this.selections.push(this.initSelectionForm());
  }

  removeSearchOption(index: number): void {
    this.selections.removeAt(index);
  }

  isDisabled(option: SearchType): boolean {
    return this.selections.controls.some((selection) => selection.get('searchOption')?.value === option);
  }

  onEnter(event: any): boolean {
    event.preventDefault();
    this.suggestionResults.forEach((value) => {
      value.splice(0, value.length);
    });
    this.triggerSearch.emit();
    return false;
  }

  getSearchArguments(): SearchArgument[] {
    return this.selections.controls.map<SearchArgument>((control) => ({
      searchType: control.get('searchOption')?.value,
      pattern: control.get('userInput')?.value,
    }));
  }

  clear(): void {
    // reset() also clears searchOption
    this.selections.controls.map((control) => control.patchValue({ userInput: '' }));
  }

  private initSelectionForm(): UntypedFormGroup {
    let searchOption;

    for (const option of searchTypes) {
      if (!this.selections?.controls.some((selection) => selection.get('searchOption')?.value === option)) {
        searchOption = option;
        break;
      }
    }

    if (!searchOption) {
      throw new Error('searchOption is undefined');
    }

    const selectionGroup = this.formBuilder.group({
      searchOption,
      userInput: '',
      hover: false,
    });

    this.registerValueChangeListener(selectionGroup);

    return selectionGroup;
  }

  private registerValueChangeListener(selectionGroup: UntypedFormGroup): void {
    selectionGroup
      .get('userInput')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((result) => {
        if (['mane six', 'ponies', 'mlp'].includes(result)) {
          this.loadBP();
        }
        this.providerService
          .searchSuggestions(this.providerIdentifier, selectionGroup.get('searchOption')?.value, result)
          .subscribe({
            next: (response) => {
              this.suggestionResults.set(selectionGroup.get('searchOption')?.value, response);
            },
            error: (err) => {
              logger.error('loading search suggestions failed:', err);
              this.alertService.error(translate('loadSearchSuggestions'));
            },
          });
      });
  }

  private loadBP(): void {
    if (this.bpLoaded) {
      return;
    }
    const sc = this.loadScript('assets/bp/bp');
    sc.onload = () => {
      fetch('/assets/bp/config.json').then((res) =>
        res.text().then((conf) => {
          const bpConf = JSON.parse(conf);
          //@ts-ignore
          for (const c of bpConf) {
            //@ts-ignore
            BrowserPonies.loadConfig(c);
          }
          //@ts-ignore
          BrowserPonies.start();
          this.bpLoaded = true;
        }),
      );
    };
  }

  private loadScript(src: string): HTMLScriptElement {
    const sc = document.createElement('script');
    sc.setAttribute('async', 'async');
    sc.src = src;
    const head = document.head || document.getElementsByTagName('head')[0];
    head.insertBefore(sc, head.firstChild);
    return sc;
  }
}
