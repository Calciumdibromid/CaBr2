import DEFAULT_LOCALIZATION from '../../../../assets/defaultStrings.json';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const DEFAULT_STRINGS = DEFAULT_LOCALIZATION.strings;
export type LocalizedStrings = typeof DEFAULT_STRINGS;

@Injectable()
export abstract class II18nService {
  abstract getAvailableLanguages(): Observable<LocalizedStringsHeader[]>;

  abstract getLocalizedStrings(language: string): Observable<LocalizedStrings>;
}

export interface LocalizedStringsHeader {
  name: string;
  locale: string;
}

const getDefaultStrings = () => DEFAULT_STRINGS;
export { getDefaultStrings };
