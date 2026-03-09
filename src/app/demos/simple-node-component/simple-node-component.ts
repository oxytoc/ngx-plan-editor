import { Component } from '@angular/core';

import { ElementComponentBase } from '../../core/element-wrapper/element-base';

@Component({
  selector: 'app-simple-node-component',
  imports: [],
  templateUrl: './simple-node-component.html',
  styleUrl: './simple-node-component.scss',
})
export class SimpleNodeComponent extends ElementComponentBase {
  onClick(event: MouseEvent): void {
    this.elementClick.emit(event);
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.elementContextMenu.emit(event);
  }
}
