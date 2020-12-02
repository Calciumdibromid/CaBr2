import { Component, Input, OnInit } from '@angular/core';
import { Header } from '../interfaces/Header';
import ListInputSpecifcations from '../interfaces/ListInputSpecifications';
import { descriptions } from '../../assets/descriptions.json';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss']
})
export class PrintPreviewComponent implements OnInit {

  @Input()
  header: Header = {
    documentTitle: '',
    organisation: '',
    labCourse: '',
    name: '',
    place: '',
    assistant: '',
    preparation: '',
  };

  descriptions = descriptions;

  @Input()
  humanAndEnvironmentDanger: ListInputSpecifcations[] = [];

  @Input()
  rulesOfConduct: ListInputSpecifcations[] = [];

  @Input()
  inCaseOfDanger: ListInputSpecifcations[] = [];

  @Input()
  disposal: ListInputSpecifcations[] = [];

  @Input()
  searchResults: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
