import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { Toast, ToastService } from '../../../core/services/toast.service';

type ToastView = Toast & { fading?: boolean };

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastView[] = [];
  private sub?: Subscription;

  constructor(private toastSvc: ToastService) { }

  /**
 * Angular lifecycle hook: Initializes the component.
 *
 * - Subscribes to the toast service stream.
 * - Pushes incoming toasts into the local list for rendering.
 * - Each toast automatically fades out after its duration
 *   (default: 3500ms) and is removed from the list after
 *   an additional short fade-out delay (200ms).
 */
  ngOnInit(): void {
    this.sub = this.toastSvc.stream$.subscribe(t => {
      const item: ToastView = { ...t };
      this.toasts.push(item);

      const ttl = t.durationMs ?? 3500;
      timer(ttl).subscribe(() => {
        item.fading = true;
        timer(200).subscribe(() => {
          this.toasts = this.toasts.filter(x => x !== item);
        });
      });
    });
  }

  /**
 * Angular lifecycle hook: Cleans up resources when the component is destroyed.
 * Unsubscribes from the toast service stream to prevent memory leaks.
 */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
