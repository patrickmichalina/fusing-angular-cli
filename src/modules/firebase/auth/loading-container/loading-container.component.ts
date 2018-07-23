import { Component, ChangeDetectionStrategy } from '@angular/core'

// tslint:disable-next-line:no-class
@Component({
  selector: 'fng-auth-loading-container',
  styles: [
    ':host{position:absolute;top:0;bottom:0;right:0;left:0;display:flex;justify-content:center;align-items:center;display:none}:host .transc{color:white;z-index:100;position:inherit;display:flex;justify-content:center;width:100%;height:100%;align-items:center}:host .auth-spin-overlay{z-index:99;background-color:white;height:100%;width:100%;position:inherit;animation:fadeIn .2s linear;opacity:1}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}'
  ],
  template: `<div class="transc"><ng-content></ng-content></div><div class="auth-spin-overlay"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FngFirebaseAuthLoadingComponent {}
