import {
  AfterViewInit, Directive, ElementRef, Inject, PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Directive({ selector: '[splitLetters]', standalone: true })
export class SplitLettersDirective implements AfterViewInit {
  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const host = this.el.nativeElement;
    const walker = this.doc.createTreeWalker(host, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let n: Node | null;

    while ((n = walker.nextNode())) {
      const t = n as Text;
      if ((t.nodeValue ?? '').trim().length) textNodes.push(t);
    }

    let i = 0;
    textNodes.forEach(tn => {
      const frag = this.doc.createDocumentFragment();
      const str = tn.nodeValue ?? '';
      for (const ch of str) {
        if (ch === ' ') { frag.appendChild(this.doc.createTextNode(' ')); continue; }
        const span = this.doc.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        span.style.setProperty('--i', String(i++));
        span.style.color = 'var(--greenColor)';
        frag.appendChild(span);
      }
      tn.parentNode?.replaceChild(frag, tn);
    });
  }
}
