import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  private router = inject(Router);
  isMenuOpen = false;

  goToSection(id: string) {
    this.isMenuOpen = false;

    if (this.router.url !== '/' && !this.router.url.startsWith('/?')) {
      this.router.navigateByUrl('/').then(() => {
        setTimeout(() => this.scrollIntoView(id), 0);
      });
    } else {
      this.scrollIntoView(id);
    }
  }

  goHome() {
    this.isMenuOpen = false;
    if (this.router.url !== '/') {
      this.router.navigateByUrl('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private scrollIntoView(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setTimeout(() => this.scrollIntoView(id), 100);
    }
  }
}
