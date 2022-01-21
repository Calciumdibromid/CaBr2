import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { Amount, getViewValue, ViewSubstanceData } from '../../@core/models/substances.model';
import { GHSSymbolMap } from 'src/app/@core/states/ghs-symbols.state';
import { GlobalModel } from '../../@core/models/global.model';
import { Header } from '../../@core/interfaces/DocTemplate';
import { IProviderService } from '../../@core/services/provider/provider.interface';
import { ProviderMapping } from '../../@core/services/provider/provider.model';
import { SubstanceDataState } from 'src/app/@core/states/substance-data.state';

// TODO ViewSubstanceData and move
interface SimpleSubstanceData {
  name: string;
  cas?: string;
  molecularFormula?: string;
  molarMass?: string;
  meltingPoint?: string;
  boilingPoint?: string;
  waterHazardClass?: string;
  hPhrases: [string, string][];
  pPhrases: [string, string][];
  signalWord?: string;
  symbols: string[];
  lethalDose?: string;
  mak?: string;
  amount?: Amount;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Select((state: any) => state.ghs_symbols.symbols) symbols$!: Observable<GHSSymbolMap>;

  @Select(SubstanceDataState.viewSubstanceData) substanceData$!: Observable<ViewSubstanceData[]>;

  @Select((state: any) => state.substance_data.providers) sources$!: Observable<Set<string>>;

  header!: Observable<Header>;

  substanceData!: SimpleSubstanceData[];

  providerMapping!: ProviderMapping;

  sources: Set<string> = new Set();

  getViewValue = getViewValue;

  constructor(public globals: GlobalModel, private providerService: IProviderService, private store: Store) {
    this.providerService.providerMappingsObservable.subscribe((providers) => (this.providerMapping = providers));

    this.header = this.store.select((state) => state.header.headerForm.model);

    this.sources$.subscribe((sources) => {
      this.sources = sources;
    });
  }

  ngOnInit(): void {}

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

  getProviders(): string {
    return Array.from(this.sources.values()).join(', ');
  }
}
