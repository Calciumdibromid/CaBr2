import { Component } from '@angular/core';

import { GlobalModel } from 'src/app/@core/models/global.model';

@Component({
  selector: 'app-security-things',
  templateUrl: './security-things.component.html',
  styleUrls: ['./security-things.component.scss'],
})
export class SecurityThingsComponent {
  constructor(public globals: GlobalModel) {}
}
