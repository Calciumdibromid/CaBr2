import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scrollbutton',
  templateUrl: './scrollbutton.component.html',
  styleUrls: ['./scrollbutton.component.scss'],
})
export class ScrollbuttonComponent {
  @Input()
  target!: HTMLElement;

  @Input()
  iconFilePath!: string;

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
