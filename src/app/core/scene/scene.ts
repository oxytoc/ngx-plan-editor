import { AfterViewInit, Component, ElementRef, Input, Type, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementWrapper } from '../element-wrapper/element-wrapper';
import { ElementComponentRegistry } from '../element-wrapper/element-registry';
import { ElementComponentBase } from '../element-wrapper/element-base';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TransformService } from '../services/transform';

export interface PlanElement {
  id: number;
  x: number;
  y: number;
  type: string;
  data: Record<string, string>;
}

@Component({
  selector: 'app-scene',
  imports: [ElementWrapper, CommonModule],
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
})
export class Scene implements AfterViewInit {
  @ViewChild('scene') sceneElementRef!: ElementRef;
  @Input() elements: PlanElement[] = [];
  @Input() bgImageUrl: string = '';

  constructor(
    private registry: ElementComponentRegistry,
    private sanitizer: DomSanitizer,
    private transformService: TransformService,
  ) {}

  ngAfterViewInit(): void {
    this.transformService.createPanzoomInstance(this.sceneElementRef);
  }

  getComponentType(element: PlanElement): Type<ElementComponentBase> | null {
    return this.registry.getComponent(element);
  }

  get safeBgImageUrl(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${this.bgImageUrl}')`);
  }

  ngOnDestroy(): void {}
}
