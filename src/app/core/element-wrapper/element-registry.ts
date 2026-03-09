import { Injectable, Type } from '@angular/core';
import { ElementComponentBase } from './element-base';


/**
 * Фабрика компонентов устройств.
 * Принимает данные устройства и возвращает тип компонента (наследника DeviceComponentBase).
 */
export type ElementComponentFactory = (element: any) => Type<ElementComponentBase>;

@Injectable({
  providedIn: 'root'
})
export class ElementComponentRegistry {
  private factories = new Map<string, ElementComponentFactory>();
  private defaultFactory: ElementComponentFactory | null = null;

  /**
   * Регистрирует фабрику для конкретного типа устройства.
   */
  register(type: string, factory: ElementComponentFactory): void {
    this.factories.set(type, factory);
  }

  /**
   * Устанавливает фабрику по умолчанию, которая будет использована,
   * если для типа устройства не найдена зарегистрированная фабрика.
   */
  setDefaultFactory(factory: ElementComponentFactory): void {
    this.defaultFactory = factory;
  }

  /**
   * Возвращает тип компонента для устройства, или null, если ни одна фабрика не подошла.
   */
  getComponent(device: any): Type<ElementComponentBase> | null {
    const type = device.type;
    const factory = this.factories.get(type) || this.defaultFactory;
    return factory ? factory(device) : null;
  }
}