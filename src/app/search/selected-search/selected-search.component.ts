import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import {
  SearchArgument,
  SearchType,
  SearchTypeMapping,
  searchTypes,
} from '../../@core/services/provider/provider.model';
import { AlertService } from '../../@core/services/alertsnackbar/altersnackbar.service';
import { GlobalModel } from '../../@core/models/global.model';
import { LocalizedStrings } from '../../@core/services/i18n/i18n.service';
import Logger from '../../@core/utils/logger';
import { ProviderService } from '../../@core/services/provider/provider.service';

const logger = new Logger('selected-search');

@Component({
  selector: 'app-selected-search',
  templateUrl: './selected-search.component.html',
  styleUrls: ['./selected-search.component.scss'],
})
export class SelectedSearchComponent {
  @Output()
  triggerSearch = new EventEmitter();

  strings!: LocalizedStrings;

  searchOptions!: SearchTypeMapping[];

  form: FormGroup = this.formBuilder.group({
    selections: this.formBuilder.array([this.initSelectionForm()]),
  });

  suggestionResults: Map<SearchType, string[]> = new Map(searchTypes.map((t) => [t, []]));

  addButtonHover = false;

  bpLoaded = false;

  constructor(
    private globals: GlobalModel,
    private providerService: ProviderService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
    this.providerService.searchTypeMappingsObservable.subscribe((mapping) => (this.searchOptions = mapping));
  }

  initSelectionForm(): FormGroup {
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

  get selections(): FormArray {
    return this.form?.get('selections') as FormArray;
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

  onSubmit(): SearchArgument[] {
    return this.selections.controls.map<SearchArgument>((control) => ({
      searchType: control.get('searchOption')?.value,
      pattern: control.get('userInput')?.value,
    }));
  }

  clear(): void {
    this.selections.controls.map((control) => control.patchValue({ userInput: '' }));
  }

  private registerValueChangeListener(selectionGroup: FormGroup): void {
    selectionGroup
      .get('userInput')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((result) => {
        if (result === 'mane six') {
          this.load();
        }
        this.providerService.searchSuggestions('gestis', selectionGroup.get('searchOption')?.value, result).subscribe(
          (response) => {
            this.suggestionResults.set(selectionGroup.get('searchOption')?.value, response);
          },
          (err) => {
            logger.error('loading search suggestions failed:', err);
            this.alertService.error(this.strings.error.loadSearchSuggestions);
          },
        );
      });
  }

  private load(): void {
    if (this.bpLoaded) {
      return;
    }
    const sc = this.loadScript('assets/bp/bp.js');
    sc.onload = () => {
      const ts = this.loadScript('assets/bp/config.js');
      ts.onload = () => {
        //@ts-ignore
        BrowserPonies.start();
        this.bpLoaded = true;
      };
    };
  }

  private loadScript(src: string): HTMLScriptElement {
    const sc = document.createElement('script');
    sc.setAttribute('async', 'async');
    // sc.setAttribute('type', 'text/javascript');
    sc.src = src;
    const head = document.head || document.getElementsByTagName('head')[0];
    head.insertBefore(sc, head.firstChild);
    return sc;
  }
}
