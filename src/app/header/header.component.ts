import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Header } from '../interfaces/Header';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() header: Header = {
      documentTitle: '',
      organisation: '',
      labCourse: '',
      name: '',
      place: '',
      assistant: '',
      preparation: '',
    };

  constructor() { }

  ngOnInit(): void {
    this.header.documentTitle = 'Betriebsanweisungen nach EG Nr. 1272/2008';
    this.header.organisation = 'für chemische Laboratorien des Campus Burghausen';
    this.header.labCourse = 'Praktikum Anorganische Chemie';
  }

}
