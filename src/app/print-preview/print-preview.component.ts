import { Component, OnInit } from '@angular/core';
import { descriptions } from '../../assets/descriptions.json';
import { GlobalModel } from '../@core/models/global.model';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss']
})
export class PrintPreviewComponent implements OnInit {

  descriptions = descriptions;

  constructor(
    public globals: GlobalModel,
  ) {
  }

  ngOnInit(): void {
  }

}
