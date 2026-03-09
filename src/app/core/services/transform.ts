import { ElementRef, Injectable, OnDestroy } from '@angular/core';

import panzoom, { PanZoom } from 'panzoom';

@Injectable({
  providedIn: 'root',
})
export class TransformService implements OnDestroy {
  private _panzoomInstance: any;

  get panzoomInstance(): PanZoom {
    return this._panzoomInstance;
  }

  createPanzoomInstance(sceneElementRef: ElementRef): PanZoom | undefined {
    if (!sceneElementRef) return;

    const element = sceneElementRef.nativeElement;

    if (!element) return;

    this._panzoomInstance = panzoom(element, {
      bounds: true,
      boundsPadding: 0.1,
      maxZoom: 5,
      minZoom: 0.5,
      beforeMouseDown: (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isDevice = target.closest('.element-wrapper') !== null;

        return isDevice;
      },
    })

    return this._panzoomInstance;
  }

  onElementDragStart(): void {
    if (this._panzoomInstance && this._panzoomInstance.pause) {
      this._panzoomInstance.pause();
    }
  }

  onElementDragEnd(): void {
    if (this._panzoomInstance && this._panzoomInstance.resume) {
      this._panzoomInstance.resume();
    }
  }

  ngOnDestroy(): void {
    if (this._panzoomInstance) {
      this._panzoomInstance.dispose();
    }
  }
}
