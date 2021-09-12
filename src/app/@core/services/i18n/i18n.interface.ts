import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translation } from '@ngneat/transloco';

export interface AvailableLanguage {
  id: string;
  label: string;
}

@Injectable()
export abstract class II18nService {
  abstract getTranslation(language: string): Observable<Translation>;
}
