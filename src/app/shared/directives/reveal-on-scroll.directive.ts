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

  /** Dauer für die temporäre Transition (passt zu deinem SCSS) */
  @Input() durationMs = 1200;
  @Input() easing = 'cubic-bezier(.22,.61,.36,1)';

  /** Nur beim allerersten Sichtbarwerden, wenn Element direkt im Viewport ist */
  @Input() initialInViewDelayMs = 180;

  private observer?: IntersectionObserver;
  private initedAt = performance.now();

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) { }

  ngOnInit() {
    const node = this.el.nativeElement;

    // SSR/Polyfill-Guard
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.r.addClass(node, this.revealClass);
      return;
    }

    // Startzustand setzen (vor Beobachtung!)
    this.r.addClass(node, this.revealStartClass);
    this.r.removeClass(node, this.revealClass);

    // Beobachter nach 1 Frame registrieren, damit der Startzustand sicher im ersten Paint liegt
    requestAnimationFrame(() => {
      this.observer = new IntersectionObserver(async ([entry]) => {
        if (!entry.isIntersecting) return;

        // Wenn direkt im Viewport bei Page-Load: kurz warten, damit der Nutzer den Übergang sieht
        const justLoaded = (performance.now() - this.initedAt) < 600; // "kurz nach Init"
        if (justLoaded) {
          await this.waitMs(this.initialInViewDelayMs);
        }

        // Für Bilder: auf Decoding warten (sofern möglich), damit nicht während des Reveals poppt
        await this.waitForImageDecodeIfNeeded(node);

        // Temporäre Transition inline (weil deine Endklassen transition:none haben)
        const t = `opacity ${this.durationMs}ms ${this.easing}, transform ${this.durationMs}ms ${this.easing}`;
        node.style.transition = t;
        if (this.delay > 0) node.style.transitionDelay = `${this.delay}ms`;

        // Reflow erzwingen -> Browser „kennt“ den Startzustand
        void node.offsetHeight;

        // Jetzt Endzustand setzen
        this.r.addClass(node, this.revealClass);
        this.r.removeClass(node, this.revealStartClass);

        // Inline-Transition/Delay nach Ende wieder entfernen (Hover bleibt snappy)
        const total = this.delay + this.durationMs + 50;
        setTimeout(() => {
          node.style.transition = '';
          node.style.transitionDelay = '';
        }, total);

        // Einmalig (dein gewünschtes Verhalten)
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
      } catch { /* ignore */ }
      // ein Frame zusätzlich, damit decoded Bild sicher gepainted ist
      await new Promise<void>(r => requestAnimationFrame(() => r()));
    } else if (node.querySelector) {
      // Falls Reveal auf einem Wrapper liegt, aber ein <img> drin ist:
      const innerImg = node.querySelector('img') as HTMLImageElement | null;
      if (innerImg && !innerImg.complete) {
        try { await innerImg.decode(); } catch { }
        await new Promise<void>(r => requestAnimationFrame(() => r()));
      }
    }
  }
}
