import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[staggerChildren]',
  standalone: true
})
export class StaggerChildrenDirective implements AfterViewInit {
  @Input() childSelector = ':scope > *';
  @Input() step = 80;

  constructor(private el: ElementRef<HTMLElement>) { }

  /**
 * Angular lifecycle hook: After the view has been initialized,
 * applies staggered transition delays to child elements
 * for reveal/animation effects.
 *
 * - Collects child elements matching the given selector.
 * - Applies an increasing `transition-delay` based on index.
 * - Cleans up the style once the transition ends.
 */
  ngAfterViewInit() {
    const host = this.el.nativeElement as HTMLElement;
    const list = this.collectChildElements(host, this.childSelector);
    if (!list.length) return;
    this.applyStaggeredTransitions(list);
  }

  /**
   * Collects child elements using querySelectorAll or fallback logic.
   * */
  private collectChildElements(host: HTMLElement, selector: string): HTMLElement[] {
    try {
      return Array.from(host.querySelectorAll<HTMLElement>(selector));
    } catch {
      return selector.startsWith(':scope')
        ? Array.from(host.children) as HTMLElement[]
        : [];
    }
  }

  /**
   * Applies staggered transition delays to the provided elements.
   *
  */
  private applyStaggeredTransitions(list: HTMLElement[]) {
    list.forEach((node, i) => {
      node.style.transitionDelay = `${i * this.step}ms`;
      const clear = () => {
        node.style.transitionDelay = '';
        node.removeEventListener('transitionend', clear);
      };
      node.addEventListener('transitionend', clear);
    });
  }
}
