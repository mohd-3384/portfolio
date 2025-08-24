import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[parallax]',
  standalone: true
})
export class ParallaxDirective {

  @Input() speed = 0.18;

  private isBrowser = typeof window !== 'undefined';

  constructor(private el: ElementRef<HTMLElement>) { }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.isBrowser) return;
    const y = window.scrollY * this.speed;
    this.el.nativeElement.style.transform = `translate3d(0, ${y}px, 0)`;
    this.el.nativeElement.style.willChange = 'transform';
  }
}
