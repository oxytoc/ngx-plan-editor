import {
  Component,
  Input,
  ViewContainerRef,
  ComponentRef,
  OnChanges,
  SimpleChanges,
  Type,
  ElementRef,
  Renderer2,
  NgZone,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementComponentBase } from './element-base';
import { PlanElement } from '../scene/scene';
import { StandartElementComponent } from './element-standart';
import { TransformService } from '../services/transform';

@Component({
  selector: 'app-element-wrapper',
  templateUrl: './element-wrapper.html',
  imports: [CommonModule],
  standalone: true,
  styles: [':host { position: absolute; }'],
  host: {
    class: 'element-wrapper',
  },
})
export class ElementWrapper implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef }) containerRef!: ViewContainerRef;

  @Input({ required: true }) componentType: Type<ElementComponentBase> | null =
    StandartElementComponent;
  @Input() elementData!: PlanElement;
  @Input() x = 0;
  @Input() y = 0;

  private componentRef?: ComponentRef<ElementComponentBase>;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private startTransformX = 0;
  private startTransformY = 0;
  private onMouseMoveBound: (event: MouseEvent) => void;
  private onMouseUpBound: (event: MouseEvent) => void;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private transformService: TransformService,
  ) {
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onMouseUpBound = this.onMouseUp.bind(this);
  }

  ngAfterViewInit(): void {
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['componentType'] || changes['elementData']) {
      this.loadComponent();
    }
    if (changes['x'] || changes['y']) {
      this.updatePosition();
    }
  }

  private loadComponent(): void {
    if (!this.componentType || !this.containerRef) return;

    this.containerRef.clear();
    ((this.componentRef = this.containerRef.createComponent(this.componentType)), {});

    this.componentRef.instance.element = this.elementData;

    this.componentRef.instance.elementClick.subscribe((event) => {
    });
    this.componentRef.instance.elementContextMenu.subscribe((event) => {
      event.preventDefault();
    });

    const deviceElement = this.componentRef.instance.elementRef.nativeElement;
    this.renderer.listen(deviceElement, 'mousedown', (event: MouseEvent) =>
      this.onMouseDown(event),
    );
    this.renderer.setAttribute(deviceElement, 'draggable', 'false');
  }

  private updatePosition(): void {
    console.log('pos');
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      `translate(${this.x}px, ${this.y}px)`,
    );
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startTransformX = this.x;
    this.startTransformY = this.y;

    this.isDragging = true;
    this.transformService.onElementDragStart();

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.onMouseMoveBound);
      window.addEventListener('mouseup', this.onMouseUpBound);
    });
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const scale = this.transformService.panzoomInstance.getTransform().scale;
    const dxScreen = event.clientX - this.startX;
    const dyScreen = event.clientY - this.startY;
    const dxScene = dxScreen / scale;
    const dyScene = dyScreen / scale;
    this.x = this.startTransformX + dxScene;
    this.y = this.startTransformY + dyScene;

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      `translate(${this.x}px, ${this.y}px)`,
    );
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.transformService.onElementDragEnd();

      window.removeEventListener('mousemove', this.onMouseMoveBound);
      window.removeEventListener('mouseup', this.onMouseUpBound);
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    window.removeEventListener('mousemove', this.onMouseMoveBound);
    window.removeEventListener('mouseup', this.onMouseUpBound);
  }
}
