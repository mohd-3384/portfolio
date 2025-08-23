import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[staggerChildren]',
  standalone: true
})
export class StaggerChildrenDirective implements AfterViewInit {
  /** Selektor der zu staffelnden Kinder */
  @Input() childSelector = ':scope > *';
  /** Verzögerung pro Kind (ms) */
  @Input() step = 80;

  constructor(private el: ElementRef<HTMLElement>) { }

  ngAfterViewInit() {
    const host = this.el.nativeElement;

    let list: HTMLElement[] = [];

    // Robust selektieren: :scope kann fehlen -> Fallback auf children
    try {
      const nodeList = host.querySelectorAll<HTMLElement>(this.childSelector);
      list = Array.prototype.slice.call(nodeList); // immer echtes Array
    } catch {
      // Fallback, wenn z.B. ':scope' nicht unterstützt wird
      if (this.childSelector.startsWith(':scope')) {
        list = Array.prototype.slice.call(host.children) as HTMLElement[];
      } else {
        list = [];
      }
    }

    if (!list.length) return;

    // Delay setzen (inline). Wir setzen *nur* transitionDelay;
    // deine Reveal-Transitions bleiben unberührt.
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      node.style.transitionDelay = `${i * this.step}ms`;

      // Sicherstellen, dass das Delay später nicht Hover-Interaktionen bremst:
      // Sobald die erste Transition vorbei ist, Delay wieder löschen.
      // (Falls du es lieber in der Reveal-Direktive zentral löschst, kannst du das hier weglassen.)
      const clear = () => {
        node.style.transitionDelay = '';
        node.removeEventListener('transitionend', clear);
      };
      node.addEventListener('transitionend', clear);
    }
  }
}
