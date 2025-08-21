import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  email = 'mohammed.abumustafa@hotmail.com';

  constructor(private router: Router) { }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  get emailObfuscated() {
    const [name, domain] = this.email.split('@');
    return `${name}&#64;${domain}`;
  }

  today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
}
