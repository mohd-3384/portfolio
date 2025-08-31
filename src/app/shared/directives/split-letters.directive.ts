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

  /**
   * Angular lifecycle hook: After the view has been initialized,
   * wraps every non-space character inside text nodes of the host
   * element into a `<span>` with a CSS variable `--i` for animation.
   *
   * - Skips execution on the server (SSR).
   * - Collects all text nodes inside the host element.
   * - Replaces each text node with a fragment of spans and spaces.
   */
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const textNodes = this.collectTextNodes(this.el.nativeElement);
    this.replaceTextNodesWithSpans(textNodes);
  }

  /**
   * Collects all non-empty text nodes from the given host element.
   * */
  private collectTextNodes(host: HTMLElement): Text[] {
    const walker = this.doc.createTreeWalker(host, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const t = n as Text;
      if ((t.nodeValue ?? '').trim().length) textNodes.push(t);
    }
    return textNodes;
  }

  /**
   * Replaces each text node with a fragment of span-wrapped characters.
   *
  */
  private replaceTextNodesWithSpans(textNodes: Text[]) {
    let i = 0;
    textNodes.forEach(tn => {
      const frag = this.doc.createDocumentFragment();
      const str = tn.nodeValue ?? '';
      for (const ch of str) {
        frag.appendChild(this.createCharNode(ch, i++));
      }
      tn.parentNode?.replaceChild(frag, tn);
    });
  }

  /**
   * Creates a span element for a character or a plain text node for spaces.
   * */
  private createCharNode(ch: string, i: number): Node {
    if (ch === ' ') return this.doc.createTextNode(' ');
    const span = this.doc.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    span.style.setProperty('--i', String(i));
    span.style.color = 'var(--redColor)';
    return span;
  }
}
