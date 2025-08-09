import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);
  private hideTimer?: any;

  show(msg: string, ms = 1800) {
    this.message.set(msg);
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => this.message.set(null), ms);
  }
}
