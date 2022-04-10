import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { getViewValue, ViewSubstanceData } from '../../@core/models/substances.model';
import { GHSSymbolMap } from 'src/app/@core/states/ghs-symbols.state';
import { Header } from '../../@core/interfaces/DocTemplate';
import { StringListStateModel } from 'src/app/@core/interfaces/string-list-state-model.interface';
import { SubstanceDataState } from 'src/app/@core/states/substance-data.state';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Select((state: any) => state.ghs_symbols.symbols) symbols$!: Observable<GHSSymbolMap>;

  @Select(SubstanceDataState.viewSubstanceData) substanceData$!: Observable<ViewSubstanceData[]>;

  humanAndEnvironmentDanger$!: Observable<string[]>;

  rulesOfConduct$!: Observable<string[]>;

  inCaseOfDanger$!: Observable<string[]>;

  disposal$!: Observable<string[]>;

  header!: Observable<Header>;

  sources$!: Observable<string>;

  getViewValue = getViewValue;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.header = this.store.select((state) => state.header.headerForm.model);

    this.sources$ = this.store
      .select((state) => state.substance_data.providers)
      .pipe(map((providers) => Array.from(providers.values()).join(', ')));

    this.humanAndEnvironmentDanger$ = this.store
      .select<StringListStateModel>((state) => state.human_and_environment_danger)
      .pipe(map((state) => state.form.model?.elements ?? []));

    this.rulesOfConduct$ = this.store
      .select<StringListStateModel>((state) => state.rules_of_conduct_state)
      .pipe(map((state) => state.form.model?.elements ?? []));

    this.inCaseOfDanger$ = this.store
      .select<StringListStateModel>((state) => state.in_case_of_danger)
      .pipe(map((state) => state.form.model?.elements ?? []));

    this.disposal$ = this.store
      .select<StringListStateModel>((state) => state.disposal)
      .pipe(map((state) => state.form.model?.elements ?? []));
  }

  getPhraseNumber(phrases: Parameters<(phraseNumber: string, phrase: string) => void>[]): string[] {
    return phrases.map((p) => p[0]);
  }

  getHPhrases(): Observable<Set<string>> {
    return this.substanceData$.pipe(
      map((value) => {
        const phraseSet = new Set<string>();
        value?.flatMap((data) => data.hPhrases).forEach((phrase) => phraseSet.add(phrase.join(':\u00A0')));
        return phraseSet;
      }),
    );
  }

  getPPhrases(): Observable<Set<string>> {
    return this.substanceData$.pipe(
      map((value) => {
        const phraseSet = new Set<string>();
        value?.flatMap((data) => data.pPhrases).forEach((phrase) => phraseSet.add(phrase.join(':\u00A0')));
        return phraseSet;
      }),
    );
  }
}
