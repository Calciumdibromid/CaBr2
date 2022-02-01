import { Component } from '@angular/core';

import TEMPLATES from '../../assets/docsTemplate.json';

@Component({
  selector: 'app-onepager',
  templateUrl: './onepager.component.html',
  styleUrls: ['./onepager.component.scss'],
})
export class OnePagerComponent {
  // TODO find a better way in the future
  DOCS_TEMPLATE = TEMPLATES.docsTemplate;
}
