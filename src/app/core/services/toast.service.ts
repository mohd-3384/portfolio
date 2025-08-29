import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';
export interface Toast { id: number; message: string; type: ToastType; duration: number; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private id = 0;
  private _toasts = new Subject<Toast>();
  toasts$: Observable<Toast> = this._toasts.asObservable();

  /**
 * Displays a toast notification with the given message, type, and duration.
 *
 * @param {string} message - The message to display in the toast.
 * @param {ToastType} [type='info'] - The type of the toast (`success`, `error`, or `info`).
 * @param {number} [duration=3500] - Duration in milliseconds for which the toast should be visible.
 */
  show(message: string, type: ToastType = 'info', duration = 3500) {
    this._toasts.next({ id: ++this.id, message, type, duration });
  }

  /**
 * Displays a success toast notification.
 *
 * @param {string} m - The success message to display.
 * @param {number} [d] - Optional duration in milliseconds for which the toast should be visible.
 */
  success(m: string, d?: number) { this.show(m, 'success', d); }


  /**
   * Displays an error toast notification.
   *
   * @param {string} m - The error message to display.
   * @param {number} [d] - Optional duration in milliseconds for which the toast should be visible.
   */
  error(m: string, d?: number) { this.show(m, 'error', d); }

  /**
   * Displays an informational toast notification.
   *
   * @param {string} m - The information message to display.
   * @param {number} [d] - Optional duration in milliseconds for which the toast should be visible.
   */
  info(m: string, d?: number) { this.show(m, 'info', d); }
}
