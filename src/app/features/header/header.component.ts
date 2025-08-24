import { Component, inject } from '@angular/core';
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
  cur = this.t.currentLang || 'de';
  constructor(private router: Router) { }

  async scrollTop() {
    await this.ensureHome();
    this.smoothScrollTo(document.body);
  }

  async goToSection(sectionId: string) {
    this.isMenuOpen = false;
    await this.ensureHome();
    const target = document.getElementById(sectionId);
    if (target) {
      requestAnimationFrame(() => this.smoothScrollTo(target));
    }
  }

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

  private smoothScrollTo(el: Element) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit() {
    this.t.addLangs(['de', 'en']);
    this.t.setDefaultLang('de');
    const saved = localStorage.getItem('lang') as 'de' | 'en' | null;
    if (saved) this.set(saved);
  }

  set(lang: 'de' | 'en', ev?: Event) {
    if (ev) ev.preventDefault();
    this.t.use(lang);
    this.cur = lang;
    localStorage.setItem('lang', lang);
  }

}
