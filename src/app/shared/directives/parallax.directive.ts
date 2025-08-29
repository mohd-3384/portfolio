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

  /**
 * Handles the scroll event and applies a parallax transform effect
 * to the host element.
 *
 * - Only runs in browser environments (skips on server-side rendering).
 * - Calculates vertical translation based on scroll position and speed factor.
 * - Updates the element's CSS transform for smooth GPU-accelerated movement.
 *
 * @remarks
 * This method is typically bound to the `window` scroll event to achieve
 * a parallax scrolling effect.
 */
  onScroll() {
    if (!this.isBrowser) return;
    const y = window.scrollY * this.speed;
    this.el.nativeElement.style.transform = `translate3d(0, ${y}px, 0)`;
    this.el.nativeElement.style.willChange = 'transform';
  }
}
