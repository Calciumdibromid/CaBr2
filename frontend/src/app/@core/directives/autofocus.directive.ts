import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[appAutofocus]' })
export class FocusDirective implements OnInit {
  @Input('appAutofocus') isFocused!: boolean;

  constructor(private hostElement: ElementRef) {}

  ngOnInit(): void {
    if (this.isFocused) {
      this.hostElement.nativeElement.focus();
    }
  }
}
