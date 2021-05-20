import DEFAULT_LOCALIZATION from '../../../../assets/defaultStrings.json';
import { Observable } from 'rxjs';

const DEFAULT_STRINGS = DEFAULT_LOCALIZATION.strings;
export type LocalizedStrings = typeof DEFAULT_STRINGS;

export const I18N_SERVICE = 'II18nService';

export interface II18nService {
  getAvailableLanguages(): Observable<LocalizedStringsHeader[]>;

  getLocalizedStrings(language: string): Observable<LocalizedStrings>;
}

export interface LocalizedStringsHeader {
  name: string;
  locale: string;
}

const getDefaultStrings = () => DEFAULT_STRINGS;
export { getDefaultStrings };
