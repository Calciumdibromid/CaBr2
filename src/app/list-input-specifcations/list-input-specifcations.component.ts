import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ListInputSpecifcations from '../@core/interfaces/ListInputSpecifications';

@Component({
  selector: 'app-list-input-specifcations',
  templateUrl: './list-input-specifcations.component.html',
  styleUrls: ['./list-input-specifcations.component.scss']
})
export class ListInputSpecifcationsComponent implements OnInit {

  @Input()
  elements: Array<ListInputSpecifcations> = [];

  @Input()
  title = '';

  addHover = false;

  constructor() { }

  ngOnInit(): void {
  }

  addElement(): void {
    this.elements.push({ content: '', hover: false });
  }

  removeElement(index: number): void {
    this.elements.splice(index, 1);
  }

  setHover(value: boolean): void {
    this.addHover = value;
  }

  setRemoveHover(value: boolean, index: number): void {
    this.elements[index].hover = value;
  }
}
