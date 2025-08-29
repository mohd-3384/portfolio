// core/services/toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  kind: ToastKind;
  msgKey: string;
  durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _stream = new Subject<Toast>();
  readonly stream$ = this._stream.asObservable();

  /**
  * Emits a new toast notification event to the stream.
  *
  * @param {ToastKind} kind - The type of the toast (e.g. `"success"`, `"error"`, `"info"`).
  * @param {string} msgKey - The translation key or message identifier for the toast content.
  * @param {number} [durationMs] - Optional duration in milliseconds before the toast auto-hides.
  */
  show(kind: ToastKind, msgKey: string, durationMs?: number) {
    this._stream.next({ kind, msgKey, durationMs });
  }

  success(key: string, d?: number) { this.show('success', key, d); }
  error(key: string, d?: number) { this.show('error', key, d); }
  info(key: string, d?: number) { this.show('info', key, d); }
}
