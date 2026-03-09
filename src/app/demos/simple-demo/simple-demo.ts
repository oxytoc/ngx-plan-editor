import { Component } from '@angular/core';

import { PlanElement, Scene } from '../../core/scene/scene';
import { SimpleNodeComponent } from '../simple-node-component/simple-node-component';
import { ElementComponentRegistry } from '../../core/element-wrapper/element-registry';

interface PlanDevice extends PlanElement {}

@Component({
  selector: 'app-simple-demo',
  imports: [Scene],
  templateUrl: './simple-demo.html',
  styleUrl: './simple-demo.scss',
})
export class SimpleDemo {
  devices: PlanDevice[] = [
    { id: 1, type: 'router', x: 100, y: 100, data: { label: 'Main Router' } },
    { id: 2, type: 'switch', x: 300, y: 200, data: { label: 'Switch' } },
  ];

  constructor(private registry: ElementComponentRegistry) {}

  ngOnInit() {
    this.registry.register('router', () => SimpleNodeComponent);
    this.registry.register('switch', () => SimpleNodeComponent);
    this.registry.setDefaultFactory(() => SimpleNodeComponent)
  }
}
