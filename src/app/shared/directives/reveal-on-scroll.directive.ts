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

  ngOnInit() {
    const node = this.el.nativeElement;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.r.addClass(node, this.revealClass);
      return;
    }

    this.r.addClass(node, this.revealStartClass);
    this.r.removeClass(node, this.revealClass);

    requestAnimationFrame(() => {
      this.observer = new IntersectionObserver(async ([entry]) => {
        if (!entry.isIntersecting) return;

        const justLoaded = (performance.now() - this.initedAt) < 600;
        if (justLoaded) {
          await this.waitMs(this.initialInViewDelayMs);
        }

        await this.waitForImageDecodeIfNeeded(node);

        const t = `opacity ${this.durationMs}ms ${this.easing}, transform ${this.durationMs}ms ${this.easing}`;
        node.style.transition = t;
        if (this.delay > 0) node.style.transitionDelay = `${this.delay}ms`;

        void node.offsetHeight;

        this.r.addClass(node, this.revealClass);
        this.r.removeClass(node, this.revealStartClass);

        const total = this.delay + this.durationMs + 50;
        setTimeout(() => {
          node.style.transition = '';
          node.style.transitionDelay = '';
        }, total);

        this.observer?.disconnect();
      }, { threshold: this.threshold });

      this.observer.observe(node);
    });
  }

  ngOnDestroy() { this.observer?.disconnect(); }

  private waitMs(ms: number) {
    if (ms <= 0) return Promise.resolve();
    return new Promise<void>(res => setTimeout(res, ms));
  }

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
