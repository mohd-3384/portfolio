import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ContactService } from '../../core/services/contact.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private api = inject(ContactService);
  private toaster = inject(ToastService);

  isSending = false;
  sent = false;
  errorMsg = '';

  myEmail = 'contact@mohammed-abumustafa.de';
  emailObfuscated = 'contact&#64;mohammed-abumustafa.de';

  private readonly namePattern =
    /^(?:[A-Za-zÄÖÜäöüß]+(?:[ '\-][A-Za-zÄÖÜäöüß]+)*)$/;

  private readonly emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  contactForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [
      Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern),
    ]),
    email: this.fb.nonNullable.control('', [
      Validators.required, Validators.pattern(this.emailRegex),
    ]),
    message: this.fb.nonNullable.control('', [
      Validators.required, Validators.minLength(3),
    ]),
    privacy: this.fb.nonNullable.control(false, [Validators.requiredTrue]),
  });

  get name() { return this.contactForm.controls.name; }
  get email() { return this.contactForm.controls.email; }
  get message() { return this.contactForm.controls.message; }
  get privacy() { return this.contactForm.controls.privacy; }

  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  /**
   * Handles the contact form submission.
   *
   * - Resets state and error messages.
   * - Validates the form; if invalid, shows an info toast.
   * - If valid, sends data via API and handles success/error cases.
   */
  onSubmit() {
    this.errorMsg = '';
    this.sent = false;

    if (this.isInvalidForm()) {
      this.toaster.info('toast.contact.invalid');
      return;
    }

    this.isSending = true;
    this.api.send(this.contactForm.getRawValue()).subscribe({
      next: () => this.handleSuccess(),
      error: (err: Error) => this.handleError(err),
    });
  }

  /** Marks all controls as touched/dirty and returns true if form is invalid or sending. */
  private isInvalidForm(): boolean {
    if (this.contactForm.invalid || this.isSending) {
      Object.values(this.contactForm.controls).forEach(c => c.markAsDirty());
      this.contactForm.markAllAsTouched();
      return true;
    }
    return false;
  }

  /** Handles successful form submission: resets form, sets flags, shows toast. */
  private handleSuccess(): void {
    this.isSending = false;
    this.sent = true;
    this.contactForm.reset({ name: '', email: '', message: '', privacy: false });
    this.toaster.success('toast.contact.success');
    this.scrollTop();
  }

  /** Handles submission error: sets error message, shows toast, logs error. */
  private handleError(err: Error): void {
    this.isSending = false;
    this.errorMsg = err.message || 'Send failed';
    this.toaster.error('toast.contact.error');
    console.error(err);
  }
}
