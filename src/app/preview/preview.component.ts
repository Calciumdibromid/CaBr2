import {Component, OnInit} from '@angular/core';
import {descriptions} from '../../assets/descriptions.json';
import {GlobalModel} from '../@core/models/global.model';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  descriptions = descriptions;

  constructor(
    public globals: GlobalModel,
  ) { }

  ngOnInit(): void {
  }

}
