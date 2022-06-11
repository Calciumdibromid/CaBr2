import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[appAutofocus]' })
export class FocusDirective implements AfterContentInit {
  @Input('appAutofocus') isFocused!: boolean;

  constructor(private hostElement: ElementRef) {}

  ngAfterContentInit(): void {
    if (this.isFocused) {
      this.hostElement.nativeElement.focus();
    }
  }
}
