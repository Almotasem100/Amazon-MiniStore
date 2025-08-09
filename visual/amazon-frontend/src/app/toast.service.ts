import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _msg = signal<string | null>(null);
  message = this._msg.asReadonly();

  show(text: string, ms = 1800) {
    this._msg.set(text);
    window.clearTimeout((this as any)._to);
    (this as any)._to = window.setTimeout(() => this._msg.set(null), ms);
  }
}
