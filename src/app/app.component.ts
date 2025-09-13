import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast/toast-container.component';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'portfolio';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private translate: TranslateService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initI18n();
    }
  }

  private initI18n(): void {
    const stored =
      typeof window !== 'undefined' && typeof localStorage !== 'undefined'
        ? localStorage.getItem('lang')
        : null;

    const browserLang =
      typeof navigator !== 'undefined' && navigator.language
        ? navigator.language.toLowerCase()
        : 'en';

    const lang = stored ?? (browserLang.startsWith('de') ? 'de' : 'en');
    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('de');
    this.translate.use(lang);
  }
}
