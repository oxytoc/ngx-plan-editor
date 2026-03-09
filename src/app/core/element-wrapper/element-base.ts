import { Input, Output, EventEmitter, Directive, ElementRef } from '@angular/core';

import { PlanElement } from '../scene/scene';

@Directive()
export abstract class ElementComponentBase {
  @Input() element!: PlanElement;
  @Output() elementClick = new EventEmitter<MouseEvent>();
  @Output() elementContextMenu = new EventEmitter<MouseEvent>();

  constructor(public elementRef: ElementRef) {}
}