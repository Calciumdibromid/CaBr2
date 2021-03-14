import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { Amount, Source, SubstanceData, Unit } from '../@core/services/substances/substances.model';
import { GlobalModel } from '../@core/models/global.model';
import { Header } from '../@core/interfaces/Header';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';

// TODO ViewSubstanceData and move
interface SimpleSubstanceData {
  name: string;
  cas?: string;
  molecularFormula: string;
  molarMass: string;
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
  strings!: LocalizedStrings;

  header!: Header;

  substanceData!: SimpleSubstanceData[];

  sources: string[] = [];

  constructor(public globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {
    this.globals.headerObservable.subscribe((value) => (this.header = value));

    this.globals.substanceDataObservable
      .pipe(
        map((data) =>
          data.map<SimpleSubstanceData>((value) => {
            if (this.sources.indexOf(value.source.provider) === -1) {
              this.sources.push(value.source.provider);
            }

            return {
              name: value.name.modifiedData ?? value.name.originalData,
              cas: value.cas.modifiedData ?? value.cas.originalData,
              molecularFormula: value.molecularFormula.modifiedData ?? value.molecularFormula.originalData,
              molarMass: value.molarMass.modifiedData ?? value.molecularFormula.originalData,
              meltingPoint: value.meltingPoint.modifiedData ?? value.meltingPoint.originalData,
              boilingPoint: value.boilingPoint.modifiedData ?? value.boilingPoint.originalData,
              waterHazardClass: value.waterHazardClass.modifiedData ?? value.waterHazardClass.originalData,
              hPhrases: value.hPhrases.modifiedData ?? value.hPhrases.originalData,
              pPhrases: value.pPhrases.modifiedData ?? value.pPhrases.originalData,
              signalWord: value.signalWord.modifiedData ?? value.signalWord.originalData,
              symbols: value.symbols.modifiedData ?? value.symbols.originalData,
              lethalDose: value.lethalDose.modifiedData ?? value.lethalDose.originalData,
              mak: value.mak.modifiedData ?? value.mak.originalData,
              amount: value.amount.modifiedData ?? value.amount.originalData,
            };
          }),
        ),
      )
      .subscribe((data) => (this.substanceData = data));
  }

  getPhraseNumber(phrases: [string, string][]): string[] {
    return phrases.map((p) => p[0]);
  }

  getProviders(): string {
    return this.sources.join(', ');
  }
}
