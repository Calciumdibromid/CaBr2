import { Component, OnInit } from '@angular/core';

import { GlobalModel } from '../@core/models/global.model';
import { Header } from '../@core/interfaces/Header';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  header!: Header;

  strings!: LocalizedStrings;

  constructor(
    public globals: GlobalModel,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => this.strings = strings);
  }

  ngOnInit(): void {
    this.globals.headerObservable.subscribe(data => this.header = data);
  }
}
