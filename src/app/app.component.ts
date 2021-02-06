import {Component} from '@angular/core';
import {name, version} from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  name = name;
  version = version;
}
