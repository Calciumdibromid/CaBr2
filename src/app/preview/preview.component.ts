import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

import { Amount } from '../@core/services/substances/substances.model';
import { GlobalModel } from '../@core/models/global.model';
import { Header } from '../@core/interfaces/Header';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';

// TODO ViewSubstanceData and move
interface SimpleSubstanceData {
  name: string;
  cas?: string;
  molecularFormula: string;
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
  strings!: LocalizedStrings;

  header!: Header;

  substanceData!: SimpleSubstanceData[];

  sources: string[] = [];

  constructor(public globals: GlobalModel, private sanitizer: DomSanitizer) {
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
              molarMass: value.molarMass.modifiedData ?? value.molarMass.originalData,
              meltingPoint: value.meltingPoint.modifiedData ?? value.meltingPoint.originalData,
              boilingPoint: value.boilingPoint.modifiedData ?? value.boilingPoint.originalData,
              waterHazardClass: value.waterHazardClass.modifiedData ?? value.waterHazardClass.originalData,
              hPhrases: value.hPhrases.modifiedData ?? value.hPhrases.originalData,
              pPhrases: value.pPhrases.modifiedData ?? value.pPhrases.originalData,
              signalWord: value.signalWord.modifiedData ?? value.signalWord.originalData,
              symbols: value.symbols.modifiedData ?? value.symbols.originalData,
              lethalDose: value.lethalDose.modifiedData ?? value.lethalDose.originalData,
              mak: value.mak.modifiedData ?? value.mak.originalData,
              amount: value.amount,
            };
          }),
        ),
      )
      .subscribe((data) => (this.substanceData = data));
  }

  getPhraseNumber(phrases: [string, string][]): string[] {
    return phrases.map((p) => p[0]);
  }

  sanitizeImage(key: string): SafeResourceUrl | undefined {
    const img = this.globals.ghsSymbols.get(key);
    if (img) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(img);
    }

    return undefined;
  }

  getHPhrases(): Set<string> {
    const phraseSet = new Set<string>();
    this.substanceData.flatMap((data) => data.hPhrases).forEach((phrase) => phraseSet.add(phrase.join(':\u00A0')));
    return phraseSet;
  }

  getPPhrases(): Set<string> {
    const phraseSet = new Set<string>();
    this.substanceData.flatMap((data) => data.pPhrases).forEach((phrase) => phraseSet.add(phrase.join(':\u00A0')));
    return phraseSet;
  }

  getProviders(): string {
    return this.sources.join(', ');
  }
}
