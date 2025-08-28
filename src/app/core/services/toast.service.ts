import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';
export interface Toast { id: number; message: string; type: ToastType; duration: number; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private id = 0;
  private _toasts = new Subject<Toast>();
  toasts$: Observable<Toast> = this._toasts.asObservable();

  show(message: string, type: ToastType = 'info', duration = 3500) {
    this._toasts.next({ id: ++this.id, message, type, duration });
  }
  success(m: string, d?: number) { this.show(m, 'success', d); }
  error(m: string, d?: number) { this.show(m, 'error', d); }
  info(m: string, d?: number) { this.show(m, 'info', d); }
}
