import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'legal-notice',
    loadComponent: () =>
      import('./features/legal-notice/legal-notice.component')
        .then(m => m.LegalNoticeComponent),
    title: 'Legal Notice',
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./features/privacy-policy/privacy-policy.component')
        .then(m => m.PrivacyPolicyComponent),
    title: 'Privacy Policy',
  },
  { path: '**', redirectTo: '' },
];
