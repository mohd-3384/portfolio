import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[revealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() revealClass = 'reveal-in';
  @Input() revealStartClass = 'reveal-start';
  @Input() threshold = 0.15;
  @Input() delay = 0;

  @Input() durationMs = 1200;
  @Input() easing = 'cubic-bezier(.22,.61,.36,1)';

  @Input() initialInViewDelayMs = 180;

  private observer?: IntersectionObserver;
  private initedAt = performance.now();

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) { }

  /**
 * Angular lifecycle hook: Initializes the directive/component.
 *
 * - Gets the host DOM element.
 * - If `IntersectionObserver` is not available (e.g., SSR or old browsers),
 *   the element is revealed immediately.
 * - Otherwise, prepares the element with initial "hidden" classes
 *   and sets up an observer to trigger reveal animations once
 *   the element enters the viewport.
 */
  ngOnInit() {
    const node = this.el.nativeElement as HTMLElement;
    if (!this.canUseIntersectionObserver()) {
      this.showImmediately(node);
      return;
    }
    this.prepareReveal(node);
    requestAnimationFrame(() => this.startObserver(node));
  }

  /**
   * Returns whether IntersectionObserver is available in the current environment.
   * */
  private canUseIntersectionObserver(): boolean {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  }

  /**
   * Applies the final reveal state immediately (SSR or no IO support).
   * */
  private showImmediately(node: HTMLElement): void {
    this.r.addClass(node, this.revealClass);
  }

  /**
   * Adds initial classes to set up the pre-reveal state.
   * */
  private prepareReveal(node: HTMLElement): void {
    this.r.addClass(node, this.revealStartClass);
    this.r.removeClass(node, this.revealClass);
  }

  /**
   * Creates and attaches the IntersectionObserver, binding to the provided node.
   * */
  private startObserver(node: HTMLElement): void {
    this.observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) this.onIntersect(node); },
      { threshold: this.threshold }
    );
    this.observer.observe(node);
  }

  /**
   * Handles the reveal sequence once the element enters the viewport.
   * */
  private async onIntersect(node: HTMLElement): Promise<void> {
    const justLoaded = (performance.now() - this.initedAt) < 600;
    if (justLoaded) await this.waitMs(this.initialInViewDelayMs);

    await this.waitForImageDecodeIfNeeded(node);

    this.applyTransition(node);
    void node.offsetHeight;

    this.r.addClass(node, this.revealClass);
    this.r.removeClass(node, this.revealStartClass);

    this.cleanupAfterTransition(node);
    this.observer?.disconnect();
  }

  /**
   * Sets transition properties on the node based on component config.
   * */
  private applyTransition(node: HTMLElement): void {
    const t = `opacity ${this.durationMs}ms ${this.easing}, transform ${this.durationMs}ms ${this.easing}`;
    node.style.transition = t;
    if (this.delay > 0) node.style.transitionDelay = `${this.delay}ms`;
  }

  /**
   * Clears transition styles after the animation has completed.
   * */
  private cleanupAfterTransition(node: HTMLElement): void {
    const total = this.delay + this.durationMs + 50;
    setTimeout(() => {
      node.style.transition = '';
      node.style.transitionDelay = '';
    }, total);
  }

  /**
 * Angular lifecycle hook: Cleans up when the directive/component is destroyed.
 * Disconnects the IntersectionObserver to avoid memory leaks.
 */
  ngOnDestroy() { this.observer?.disconnect(); }

  /**
  * Creates a Promise that resolves after the given number of milliseconds.
  *
  * @param {number} ms - The number of milliseconds to wait.
  * @returns {Promise<void>} A Promise that resolves after the delay.
  */
  private waitMs(ms: number) {
    if (ms <= 0) return Promise.resolve();
    return new Promise<void>(res => setTimeout(res, ms));
  }

  /**
 * Ensures that an image inside the given element has been decoded
 * before continuing. This helps avoid "flash of unstyled content"
 * or reveal animations before the image is fully ready.
 *
 * - If the node itself is an `<img>`, it waits for its decode.
 * - Otherwise, it searches for the first `<img>` inside the node.
 * - Uses `requestAnimationFrame` to yield back to the browser
 *   for smoother rendering after decoding.
 *
 * @param {HTMLElement} node - The DOM node to check for images.
 * @returns {Promise<void>} A Promise that resolves when decoding is done
 *                          or immediately if no image needs decoding.
 */
  private async waitForImageDecodeIfNeeded(node: HTMLElement) {
    const img = (node as HTMLImageElement);
    if (img && img.tagName === 'IMG') {
      try {
        if (!img.complete) await img.decode();
      } catch { }
      await new Promise<void>(r => requestAnimationFrame(() => r()));
    } else if (node.querySelector) {
      const innerImg = node.querySelector('img') as HTMLImageElement | null;
      if (innerImg && !innerImg.complete) {
        try { await innerImg.decode(); } catch { }
        await new Promise<void>(r => requestAnimationFrame(() => r()));
      }
    }
  }
}
