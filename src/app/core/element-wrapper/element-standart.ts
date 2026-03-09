import { Component } from '@angular/core';

import { ElementComponentBase } from './element-base'

@Component({
  selector: 'app-standart-element',
  template: '',
  styles: [],
})
export class StandartElementComponent extends ElementComponentBase {
  onClick(event: MouseEvent): void {
    this.elementClick.emit(event);
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.elementContextMenu.emit(event);
  }
}