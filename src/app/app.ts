import { Component } from '@angular/core';

import { SimpleDemo } from './demos/simple-demo/simple-demo';

@Component({
  selector: 'app-root',
  imports: [SimpleDemo],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
