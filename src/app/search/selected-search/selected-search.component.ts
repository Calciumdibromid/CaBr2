import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { SearchArgument, SearchType, SearchTypeMapping } from '../../@core/services/search/search.model';
import { AlertService } from '../../@core/services/alertsnackbar/altersnackbar.service';
import { GlobalModel } from '../../@core/models/global.model';
import { LocalizedStrings } from '../../@core/services/i18n/i18n.service';
import Logger from '../../@core/utils/logger';
import { SearchService } from '../../@core/services/search/search.service';

const logger = new Logger('selected-search');

@Component({
  selector: 'app-selected-search',
  templateUrl: './selected-search.component.html',
  styleUrls: ['./selected-search.component.scss'],
})
export class SelectedSearchComponent implements OnInit {
  @Output()
  triggerSearch = new EventEmitter();

  strings!: LocalizedStrings;

  searchOptions: SearchTypeMapping[] = this.searchService.searchTypeMappings;

  availableSearchTypes: SearchType[] = this.searchService.searchTypeMappings.map(value => value.value);

  form: FormGroup = this.formBuilder.group({
    selections: this.formBuilder.array([this.initSelectionForm()]),
  });

  suggestionResults: Map<SearchType, string[]> = new Map([
    ['chemicalName', []],
    ['empiricalFormula', []],
    ['numbers', []],
    ['fullText', []],
  ]);

  addButtonHover = false;

  constructor(
    private globals: GlobalModel,
    private searchService: SearchService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => this.strings = strings);
  }

  ngOnInit(): void {
  }

  initSelectionForm(): FormGroup {
    const selectionGroup = this.formBuilder.group({
      searchOption: this.availableSearchTypes.shift(),
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
    this.availableSearchTypes.push(this.selections.at(index).get('searchOption')?.value);
    this.selections.removeAt(index);
  }

  isDisabled(option: string): boolean {
    return this.selections.controls.filter(value => value.get('searchOption')?.value === option).length > 0;
  }

  onEnter(event: any): boolean {
    event.preventDefault();
    this.suggestionResults.forEach((value) => {
      value.splice(0, value.length);
    });
    this.triggerSearch.emit();
    return false;
  }

  // TODO handle change in searchTypeSelection

  onSubmit(): SearchArgument[] {
    return this.selections.controls.map<SearchArgument>(control => ({
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
        this.searchService
          .searchSuggestions(selectionGroup.get('searchOption')?.value, result)
          .subscribe((response) => {
            this.suggestionResults.set(
              selectionGroup.get('searchOption')?.value,
              response
            );
          },
            (err) => {
              logger.error('loading search suggestions failed:', err);
              this.alertService.error(this.strings.error.loadSearchSuggestions);
            });
      });
  }
}
