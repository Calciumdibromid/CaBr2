import { strings as de } from '../../../../assets/strings.json';
import { strings as en } from '../../../../assets/strings_en.json';

export class i18n {
  static getStrings(lang: string): any {
    if (lang === 'de') {
      return de;
    }
    return en;
  }
}
