import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { getViewValue, ViewSubstanceData } from '../../@core/models/substances.model';
import { GHSSymbolMap } from 'src/app/@core/states/ghs-symbols.state';
import { GlobalModel } from '../../@core/models/global.model';
import { Header } from '../../@core/interfaces/DocTemplate';
import { SubstanceDataState } from 'src/app/@core/states/substance-data.state';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Select((state: any) => state.ghs_symbols.symbols) symbols$!: Observable<GHSSymbolMap>;

  @Select(SubstanceDataState.viewSubstanceData) substanceData$!: Observable<ViewSubstanceData[]>;

  sources$!: Observable<string>;

  header!: Observable<Header>;

  getViewValue = getViewValue;

  constructor(public globals: GlobalModel, private store: Store) {}

  ngOnInit(): void {
    this.header = this.store.select((state) => state.header.headerForm.model);

    this.sources$ = this.store
      .select((state) => state.substance_data.providers)
      .pipe(map((providers) => Array.from(providers.values()).join(', ')));
  }

  getPhraseNumber(phrases: [string, string][]): string[] {
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
