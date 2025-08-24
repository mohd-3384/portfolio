import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  isSending = false;
  sent = false;
  errorMsg = '';
  myEmail = 'mohammed.abumustafa@hotmail.com';
  emailObfuscated = 'mohammed.abumustafa&#64;hotmail.com';

  private readonly namePattern = /^(?:[A-Za-zÄÖÜäöüß]+(?:[ '\-][A-Za-zÄÖÜäöüß]+)*)$/;

  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  contactForm = this.fb.nonNullable.group(
    {
      name: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern)],
        updateOn: 'change',
      }),
      email: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.pattern(this.emailRegex)],
        updateOn: 'change',
      }),
      message: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change',
      }),
      privacy: this.fb.nonNullable.control(false, {
        validators: [Validators.requiredTrue],
        updateOn: 'change',
      }),
    },
    { updateOn: 'change' }
  );

  get name() { return this.contactForm.controls.name; }
  get email() { return this.contactForm.controls.email; }
  get message() { return this.contactForm.controls.message; }
  get privacy() { return this.contactForm.controls.privacy; }


  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  async onSubmit() {
    this.errorMsg = '';
    this.sent = false;

    if (this.contactForm.invalid) {
      Object.values(this.contactForm.controls).forEach(c => c.markAsDirty());
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    try {
      // TODO: echten Versand einbauen
      await new Promise((res) => setTimeout(res, 1200));

      this.sent = true;
      this.contactForm.reset({
        name: '',
        email: '',
        message: '',
        privacy: false,
      });
    } catch {
      this.errorMsg = 'Sending failed. Please try again.';
    } finally {
      this.isSending = false;
    }
  }
}
