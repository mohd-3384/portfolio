import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  privacy: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) { }

  /**
   * Sends the contact form payload to the backend mailer script.
   *
   * - Posts JSON data to `/sendMail.php`.
   * - Expects `{ ok: boolean; message?: string }` response.
   * - Throws an error if sending fails or backend returns `ok: false`.
   * - Maps the response to `void` on success.
   *
   * @param {ContactPayload} payload - The contact form data to send.
   * @returns {Observable<void>} Emits completion on success, error on failure.
   */
  send(payload: ContactPayload): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<{ ok: boolean; message?: string }>('/sendMail.php', payload, { headers })
      .pipe(
        map(res => this.handleResponse(res)),
        catchError(err => this.handleError(err))
      );
  }

  /** Validates the backend response and throws if not successful. */
  private handleResponse(res: { ok: boolean; message?: string }): void {
    if (!res?.ok) throw new Error(res?.message || 'Mail send failed');
  }

  /** Normalizes HttpErrorResponse into a user-friendly Error observable. */
  private handleError(err: HttpErrorResponse): Observable<never> {
    const msg = typeof err.error === 'string'
      ? err.error
      : err.error?.message || err.message || 'Http parse error';
    return throwError(() => new Error(msg));
  }

}
