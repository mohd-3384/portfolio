import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  email = 'contact@mohammed-abumustafa.de';
  tel = '0176 631 248 96'

  constructor(private router: Router) { }

  /**
 * Navigates back in browser history if available,
 * otherwise redirects to the homepage (`'/'`).
 */
  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
 * Returns an obfuscated version of the email address
 * where `@` is replaced by `&#64;` to reduce spam harvesting.
 *
 * @returns {string} Obfuscated email string.
 */
  get emailObfuscated() {
    const [name, domain] = this.email.split('@');
    return `${name}&#64;${domain}`;
  }

  /**
 * Formatted current date in a locale-sensitive string.
 * Format example: "August 29, 2025".
 */
  today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
}
