import { Component } from '@angular/core';

import { GlobalModel } from 'src/app/@core/models/global.model';
import { LocalizedStrings } from 'src/app/@core/services/i18n/i18n.interface';

@Component({
  selector: 'app-security-things',
  templateUrl: './security-things.component.html',
  styleUrls: ['./security-things.component.scss'],
})
export class SecurityThingsComponent {
  strings!: LocalizedStrings;

  constructor(public globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }
}
