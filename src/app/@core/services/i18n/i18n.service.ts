import { strings as de } from '../../../../assets/strings.json';
import { strings as en } from '../../../../assets/strings_en.json';

export interface i18n {
  getStrings(lang: string): any;
}

export class i18n {
  getStrings(lang: string) {
    if (lang === 'de') {
      return de;
    }
    return en;
  }
}
