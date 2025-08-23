import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[splitLetters]',
  standalone: true
})
export class SplitLettersDirective implements AfterViewInit {

  constructor(private el: ElementRef<HTMLElement>) { }

  ngAfterViewInit() {
    const host = this.el.nativeElement;
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let n: Node | null;

    // Alle Textknoten einsammeln (H1/H2)
    while ((n = walker.nextNode())) {
      const t = n as Text;
      const val = t.nodeValue ?? '';
      if (val.trim().length) textNodes.push(t);
    }

    let i = 0; // laufender Index für --i

    textNodes.forEach(tn => {
      const frag = document.createDocumentFragment();
      const str = tn.nodeValue ?? '';

      for (const ch of str) {
        if (ch === ' ') {
          frag.appendChild(document.createTextNode(' '));
          continue;
        }
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        span.style.setProperty('--i', String(i++));
        // Startfarbe grün (wird von Animation überschrieben)
        span.style.color = 'var(--greenColor)';
        frag.appendChild(span);
      }

      // Original-Textknoten ersetzen
      tn.parentNode?.replaceChild(frag, tn);
    });
  }

}
