import {Component, HostBinding, Inject, OnInit, Renderer2} from '@angular/core';
import {name, version} from '../../package.json';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  name = name;
  version = version;

  private isDark = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.renderer.setAttribute(this.document.body, 'class', 'theme-light');
  }

  @HostBinding('class')
  get themeMode(): string {
    return this.isDark ? 'theme-dark' : 'theme-light';
  }

  switchMode(isDarkMode: boolean): void {
    const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
    this.isDark = isDarkMode;
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }
}
