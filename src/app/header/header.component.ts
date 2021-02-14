import { Component, OnInit } from '@angular/core';
import { GlobalModel } from '../@core/models/global.model';

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
