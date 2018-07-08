import { Directive, ElementRef, Renderer2 } from '@angular/core'

// tslint:disable-next-line:no-class
@Directive({
  selector: 'a[fngExternalLink]'
})
export class ExternalLinkDirective {
  constructor(el: ElementRef, rd: Renderer2) {
    const anchor = el.nativeElement as HTMLAnchorElement
    rd.setAttribute(anchor, 'target', '_blank')
    rd.setAttribute(anchor, 'rel', 'noopener')
  }
}
