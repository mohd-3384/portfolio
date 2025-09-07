import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast/toast-container.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'portfolio';

  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.initI18n();
  }

  private initI18n(): void {
    const stored = localStorage.getItem('lang');
    const browserLang =
      typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.language
        ? navigator.language.toLowerCase()
        : 'en';

    const lang = (stored ?? (browserLang.startsWith('de') ? 'de' : 'en'));

    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('de');
    this.translate.use(lang);
  }
}
