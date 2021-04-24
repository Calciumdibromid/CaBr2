import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: '<div><img src="assets/loading.gif" alt="Loading" border="0" /></div>',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input()
  width!: string;

  constructor() {}

  ngOnInit(): void {}
}
