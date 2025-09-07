import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ContactService } from '../../core/services/contact.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', './contact.hints.scss'],
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private api = inject(ContactService);
  private toaster = inject(ToastService);
  private i18n = inject(TranslateService);

  isSending = false;
  sent = false;
  errorMsg = '';

  myEmail = 'contact@mohammed-abumustafa.de';
  emailObfuscated = 'contact&#64;mohammed-abumustafa.de';

  private readonly namePattern =
    /^(?:[A-Za-zÄÖÜäöüß]+(?:[ '\-][A-Za-zÄÖÜäöüß]+)*)$/;

  private readonly emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  typing: Record<'name' | 'email' | 'message', boolean> = {
    name: false,
    email: false,
    message: false,
  };

  contactForm = this.fb.nonNullable.group(
    {
      name: this.fb.nonNullable.control('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.namePattern),
        ],
        updateOn: 'blur',
      }),
      email: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.pattern(this.emailRegex)],
        updateOn: 'blur',
      }),
      message: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur',
      }),
      privacy: this.fb.nonNullable.control(false, {
        validators: [Validators.requiredTrue],
        updateOn: 'change',
      }),
    },
    { updateOn: 'blur' }
  );

  get name() { return this.contactForm.controls.name; }
  get email() { return this.contactForm.controls.email; }
  get message() { return this.contactForm.controls.message; }
  get privacy() { return this.contactForm.controls.privacy; }

  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

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

  /**
   * Validates the form before submission.
   *
   * Side effects:
   * - Marks all controls as dirty and touched when the form is invalid or a send is in progress.
   *
   * @returns {boolean} `true` if the form is invalid or currently sending; otherwise `false`.
   */
  private isInvalidForm(): boolean {
    if (this.contactForm.invalid || this.isSending) {
      Object.values(this.contactForm.controls).forEach(c => c.markAsDirty());
      this.contactForm.markAllAsTouched();
      return true;
    }
    return false;
  }

  /**
 * Handles a successful form submission.
 *
 * Side effects:
 * - Stops the sending state.
 * - Sets the sent flag.
 * - Resets the form to its initial values.
 * - Shows a success toast and scrolls to the top of the page.
 *
 * @returns {void}
 */
  private handleSuccess(): void {
    this.isSending = false;
    this.sent = true;
    this.contactForm.reset({ name: '', email: '', message: '', privacy: false });
    this.toaster.success('toast.contact.success');
    this.scrollTop();
  }

  /**
 * Handles an error that occurred during form submission.
 *
 * Side effects:
 * - Stops the sending state.
 * - Stores a user-visible error message.
 * - Shows an error toast and logs the error to the console.
 *
 * @param {Error} err - The error thrown by the submission request.
 * @returns {void}
 */
  private handleError(err: Error): void {
    this.isSending = false;
    this.errorMsg = err.message || 'Send failed';
    this.toaster.error('toast.contact.error');
    console.error(err);
  }

  /**
   * Toggles the "typing" state for a given control.
   * Used to hide validation hints while the user is actively typing.
   *
   * @param {'name' | 'email' | 'message'} ctrl - The control to update.
   * @param {boolean} isTyping - Whether the user is currently typing in that control.
   * @returns {void}
   */
  setTyping(ctrl: 'name' | 'email' | 'message', isTyping: boolean) {
    this.typing[ctrl] = isTyping;
  }

  /**
   * Determines whether the floating validation hint should be visible for a control.
   * Hints appear only after the control was touched (blurred) and is invalid.
   * For text inputs, hints are suppressed while the user is typing.
   *
   * @param {'name' | 'email' | 'message' | 'privacy'} ctrlName - The control to evaluate.
   * @returns {boolean} `true` if the hint should be shown; otherwise `false`.
   */
  isHintVisible(ctrlName: 'name' | 'email' | 'message' | 'privacy'): boolean {
    const c = this.contactForm.controls[ctrlName];
    if (!('touched' in c)) return false;
    if (ctrlName === 'privacy') return c.touched && c.invalid;
    const isTyping = this.typing[ctrlName as 'name' | 'email' | 'message'];
    return c.touched && c.invalid && !isTyping;
  }

  /**
  * Returns a localized, human-readable error message for a control.
  * Shows messages only after the control has been touched (blurred).
  *
  * Order: required → minlength → pattern → requiredTrue → generic.
  */
  getErrorText(ctrlName: 'name' | 'email' | 'message' | 'privacy'): string | null {
    const c = this.getCtrl(ctrlName);
    if (!this.shouldShowError(c)) return null;
    return (
      this.getRequiredError(ctrlName, c) ??
      ((ctrlName === 'name' || ctrlName === 'message')
        ? this.getMinLengthError(ctrlName, c)
        : null) ??
      ((ctrlName === 'name' || ctrlName === 'email')
        ? this.getPatternError(ctrlName, c)
        : null) ??
      this.getRequiredTrueError(c) ??
      this.getGenericError()
    );
  }

  /**
   * Gets a reference to a form control by name.
   *
   * @param {'name'|'email'|'message'|'privacy'} ctrlName
   * @returns The requested control.
   */
  private getCtrl(ctrlName: 'name' | 'email' | 'message' | 'privacy') {
    return this.contactForm.controls[ctrlName];
  }

  /**
   * Decides whether an error should be shown for the control.
   * It must be touched and have errors.
   *
   * @param c - The form control to evaluate.
   * @returns {boolean} True if an error should be displayed.
   */
  private shouldShowError(c: any): boolean {
    return !!(c && c.touched && c.errors);
  }

  /**
   * Returns the "required" error message if present.
   *
   * @param ctrlName - Control key.
   * @param c - Control instance.
   * @returns {string|null} Localized text or null.
   */
  private getRequiredError(
    ctrlName: 'name' | 'email' | 'message' | 'privacy',
    c: any
  ): string | null {
    return c.errors?.['required']
      ? this.i18n.instant(`contact.errors.${ctrlName}.required`)
      : null;
  }

  /**
   * Returns the "minlength" error message with dynamic values.
   *
   * @param ctrlName - Control key.
   * @param c - Control instance.
   * @returns {string|null} Localized text or null.
   */
  private getMinLengthError(
    ctrlName: 'name' | 'message',
    c: any
  ): string | null {
    const e =
      c.errors?.['minlength'] as
      | { requiredLength: number; actualLength: number }
      | undefined;
    if (!e) return null;
    return this.i18n.instant(`contact.errors.${ctrlName}.minlength`, {
      required: e.requiredLength,
      actual: e.actualLength,
    });
  }

  /**
   * Returns the "pattern" error message (email has its own key).
   *
   * @param ctrlName - Control key.
   * @param c - Control instance.
   * @returns {string|null} Localized text or null.
   */
  private getPatternError(
    ctrlName: 'name' | 'email',
    c: any
  ): string | null {
    if (!c.errors?.['pattern']) return null;
    const key =
      ctrlName === 'email'
        ? 'contact.errors.email.pattern'
        : `contact.errors.${ctrlName}.pattern`;
    return this.i18n.instant(key);
  }

  /**
   * Returns the "requiredTrue" error (checkbox) if present.
   *
   * @param c - Control instance.
   * @returns {string|null} Localized text or null.
   */
  private getRequiredTrueError(c: any): string | null {
    return c.errors?.['requiredTrue']
      ? this.i18n.instant('contact.errors.privacy.required')
      : null;
  }

  /**
   * Fallback generic validation message.
   *
   * @returns {string} Localized generic error text.
   */
  private getGenericError(): string {
    return this.i18n.instant('contact.errors.generic');
  }

}
