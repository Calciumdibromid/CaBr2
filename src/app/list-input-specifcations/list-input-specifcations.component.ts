import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ListInputSpecifcations from '../interfaces/ListInputSpecifications';

@Component({
  selector: 'app-list-input-specifcations',
  templateUrl: './list-input-specifcations.component.html',
  styleUrls: ['./list-input-specifcations.component.scss']
})
export class ListInputSpecifcationsComponent implements OnInit {

  @Input()
  elements: Array<ListInputSpecifcations> = [];

  @Output()
  elementsChange: EventEmitter<Array<ListInputSpecifcations>> = new EventEmitter<Array<ListInputSpecifcations>>();

  @Input()
  title: string = '';

  addHover: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  addElement(): void {
    this.elements.push({ content: '', hover: false });
  }

  setHover(value: boolean): void {
    this.addHover = value;
  };

  setRemoveHover(value: boolean, index: number) {
    this.elements[index].hover = value;
  }

  removeElement(index: number) {
    this.elements.splice(index, 1);
  }

}
