import { Component, OnInit } from '@angular/core';
import { GlobalModel } from '../@core/models/global.model';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';
import { TauriService } from '../@core/services/tauri/tauri.service';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss'],
})
export class ReportBugComponent implements OnInit {
  strings!: LocalizedStrings;

  constructor(private tauriService: TauriService, private globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {}

  openMail(): void {
    this.tauriService.openUrl('mailto:cabr2.help@gmail.com');
  }
}
