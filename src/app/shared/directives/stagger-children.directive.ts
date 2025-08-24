import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[staggerChildren]',
  standalone: true
})
export class StaggerChildrenDirective implements AfterViewInit {
  @Input() childSelector = ':scope > *';
  @Input() step = 80;

  constructor(private el: ElementRef<HTMLElement>) { }

  ngAfterViewInit() {
    const host = this.el.nativeElement;

    let list: HTMLElement[] = [];

    try {
      const nodeList = host.querySelectorAll<HTMLElement>(this.childSelector);
      list = Array.prototype.slice.call(nodeList);
    } catch {
      if (this.childSelector.startsWith(':scope')) {
        list = Array.prototype.slice.call(host.children) as HTMLElement[];
      } else {
        list = [];
      }
    }

    if (!list.length) return;

    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      node.style.transitionDelay = `${i * this.step}ms`;

      const clear = () => {
        node.style.transitionDelay = '';
        node.removeEventListener('transitionend', clear);
      };
      node.addEventListener('transitionend', clear);
    }
  }
}
