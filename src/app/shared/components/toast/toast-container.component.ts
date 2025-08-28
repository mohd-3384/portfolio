import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrap" role="status" aria-live="polite">
      <div class="toast" *ngFor="let t of list">
        <div class="toast__bar" [class.s]="t.type==='success'" [class.e]="t.type==='error'"></div>
        <span class="toast__msg">{{ t.message }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent implements OnDestroy {
  list: Toast[] = [];
  private timers = new Map<number, any>();
  private sub = this.toast.toasts$.subscribe(t => {
    this.list.push(t);
    const h = setTimeout(() => this.remove(t.id), t.duration);
    this.timers.set(t.id, h);
  });

  constructor(private toast: ToastService) { }

  remove(id: number) {
    const i = this.list.findIndex(x => x.id === id);
    if (i > -1) this.list.splice(i, 1);
    const h = this.timers.get(id); if (h) clearTimeout(h);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.timers.forEach(clearTimeout);
  }
}
