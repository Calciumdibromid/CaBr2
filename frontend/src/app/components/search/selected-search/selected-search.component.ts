import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';

import { SearchArgument, SearchType, searchTypes } from '../../../@core/services/provider/provider.model';
import { AlertService } from '../../../@core/services/alertsnackbar/alertsnackbar.service';
import { IProviderService } from '../../../@core/services/provider/provider.interface';
import Logger from '../../../@core/utils/logger';
import { translate } from '@ngneat/transloco';

type SearchForm = {
  searchType: FormControl<SearchType>;
  pattern: FormControl<string>;
  hover: FormControl<boolean>;
};

type SelectionForm = {
  selections: FormArray<FormGroup<SearchForm>>;
};

@Component({
  selector: 'app-selected-search',
  templateUrl: './selected-search.component.html',
  styleUrls: ['./selected-search.component.scss'],
})
export class SelectedSearchComponent implements OnInit {
  @Output()
  triggerSearch = new EventEmitter();

  @Input()
  providerIdentifier!: string;

  searchOptions = searchTypes;

  form!: FormGroup<SelectionForm>;

  suggestionResults: Map<SearchType, string[]> = new Map(searchTypes.map((t) => [t, []]));

  addButtonHover = false;

  private destroyed$ = new Subject<void>();

  private bpLoaded = false;

  private logger = new Logger(SelectedSearchComponent.name);

  constructor(
    private readonly providerService: IProviderService,
    private readonly alertService: AlertService,
    private readonly formBuilder: NonNullableFormBuilder,
  ) {}

  get selections(): FormArray<FormGroup<SearchForm>> {
    return this.form?.get('selections') as FormArray<FormGroup<SearchForm>>;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group<SelectionForm>({
      selections: this.formBuilder.array([this.initSelectionForm()]),
    });
  }

  addSearchOption(): void {
    this.selections.push(this.initSelectionForm());
  }

  removeSearchOption(index: number): void {
    this.selections.removeAt(index);
  }

  isDisabled(option: SearchType): boolean {
    return this.selections.controls.some((selection) => selection.get('searchType')?.value === option);
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
    return this.selections.value.map((value) => ({
      searchType: value.searchType as SearchType,
      pattern: value.pattern ?? '',
    }));
  }

  clear(): void {
    // reset() also clears searchOption
    this.selections.controls.map((control) => control.patchValue({ pattern: '' }));
  }

  private initSelectionForm(): FormGroup<SearchForm> {
    let searchType;

    for (const option of searchTypes) {
      if (!this.selections?.controls.some((selection) => selection.get('searchType')?.value === option)) {
        searchType = option;
        break;
      }
    }

    if (!searchType) {
      throw new Error('searchOption is undefined');
    }

    const selectionGroup = this.formBuilder.group<SearchForm>({
      searchType: this.formBuilder.control(searchType),
      pattern: this.formBuilder.control(''),
      hover: this.formBuilder.control(false),
    });

    this.registerValueChangeListener(selectionGroup);

    return selectionGroup;
  }

  private registerValueChangeListener(selectionGroup: FormGroup<SearchForm>): void {
    selectionGroup
      .get('pattern')
      ?.valueChanges.pipe(
        debounceTime(500),
        switchMap((result) => {
          if (['mane six', 'ponies', 'mlp'].includes(result)) {
            this.loadBP();
          }

          return this.providerService.searchSuggestions(
            this.providerIdentifier,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectionGroup.get('searchType')!.value, // this exist all the time! `undefined` is not possible
            result,
          );
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe({
        next: (response) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.suggestionResults.set(selectionGroup.get('searchType')!.value, response);
        },
        error: (err) => {
          this.logger.error('loading search suggestions failed:', err);
          this.alertService.error(translate('error.loadSearchSuggestions'));
        },
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
