import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private router: Router) { }

  /** Klick auf Logo: zurück zum Anfang der Startseite */
  async scrollTop() {
    await this.ensureHome();
    this.smoothScrollTo(document.body);
  }

  /** Einheitlich für Desktop & Mobile: zum Abschnitt scrollen */
  async goToSection(sectionId: string) {
    this.isMenuOpen = false;
    await this.ensureHome();              // ggf. erst nach / navigieren
    const target = document.getElementById(sectionId);
    if (target) {
      // kleines Delay, damit Layout nach dem Route-Wechsel sicher gerendert ist
      requestAnimationFrame(() => this.smoothScrollTo(target));
    }
  }

  /** Wenn nicht auf Home, erst zur Startseite navigieren und Navigation-Ende abwarten */
  private async ensureHome(): Promise<void> {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      return;
    }
    await this.router.navigateByUrl('/');
    // Warten bis Navigation abgeschlossen ist
    await this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      first()
    );
  }

  private smoothScrollTo(el: Element) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
