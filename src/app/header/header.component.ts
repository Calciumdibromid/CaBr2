import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Header} from '../@core/interfaces/Header';
import {GlobalModel} from '../@core/models/global.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public globals: GlobalModel,
  ) {
  }

  ngOnInit(): void {
  }
}
