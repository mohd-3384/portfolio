import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
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
}
