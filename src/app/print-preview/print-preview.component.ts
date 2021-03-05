import { Component, OnInit } from '@angular/core';
import { GlobalModel } from '../@core/models/global.model';

import { strings } from '../../assets/strings.json';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss']
})
export class PrintPreviewComponent implements OnInit {

  strings = strings;

  constructor(
    public globals: GlobalModel,
  ) {
  }

  ngOnInit(): void {
  }

}
