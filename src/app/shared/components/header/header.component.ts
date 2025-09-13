import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  isMenuOpen = false;
  private t = inject(TranslateService);
  cur: 'de' | 'en' = 'de';
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /**
 * Scrolls smoothly to the top of the page.
 * Ensures that the user is on the homepage before scrolling.
 */
  async scrollTop() {
    await this.ensureHome();
    this.smoothScrollTo(document.body);
  }

  /**
 * Navigates to a section on the homepage by its element ID.
 * Automatically closes the menu before navigating.
 *
 * @param {string} sectionId - The ID of the target section element.
 */
  async goToSection(sectionId: string) {
    this.isMenuOpen = false;
    await this.ensureHome();
    const target = document.getElementById(sectionId);
    if (target) {
      requestAnimationFrame(() => this.smoothScrollTo(target));
    }
  }

  /**
 * Ensures that the current route is the homepage (`'/'`).
 * If not, navigates to `'/'` and waits for navigation to complete.
 *
 * @private
 * @returns {Promise<void>} Resolves when navigation is complete.
 */
  private async ensureHome(): Promise<void> {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      return;
    }
    await this.router.navigateByUrl('/');
    await this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      first()
    );
  }

  /**
 * Smoothly scrolls to a given element.
 *
 * @private
 * @param {Element} el - The DOM element to scroll to.
 */
  private smoothScrollTo(el: Element) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit() {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || '';
    const browser = (typeof navigator !== 'undefined' && navigator.language.slice(0, 2)) || 'de';
    const active = (saved === 'de' || saved === 'en') ? saved : (browser === 'en' ? 'en' : 'de');
    this.t.use(active);
    this.cur = active;
  }

  /**
 * Switches the application language and persists it in local storage.
 *
 * @param {'de' | 'en'} lang - The language to switch to.
 * @param {Event} [ev] - Optional DOM event, prevented if provided.
 */
  set(lang: 'de' | 'en', ev?: Event) {
    if (ev) ev.preventDefault();
    this.t.use(lang);
    (this as any).cur = lang;

    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('lang', lang);
      } catch { }
    }
  }
}
