import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartService } from './cart.service';
import { ToastService } from './toast.service';
import type { CartDto } from './models/cart.model'; // adjust if your model path differs

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private cart = inject(CartService);
  readonly toast = inject(ToastService);

  currentYear = new Date().getFullYear();

  // Supports either:
  //   - cart.cart$ as Observable<CartDto>
  //   - cart.cart$() returning Observable<CartDto>
  cartCount$: Observable<number>;

  constructor() {
    const stream = ((): Observable<CartDto> => {
      const anyCart = this.cart as any;
      const candidate = anyCart.cart$;
      if (typeof candidate === 'function') {
        return candidate.call(this.cart);
      }
      if (isObservable(candidate)) {
        return candidate as Observable<CartDto>;
      }
      // Fallback: try a refresh/fetch method and map its result
      if (typeof anyCart.fetchCart === 'function') {
        return anyCart.fetchCart();
      }
      if (typeof anyCart.refresh === 'function') {
        anyCart.refresh();
      }
      // Last resort: create an empty observable shape
      return new Observable<CartDto>((sub) => sub.next({ items: [], total: 0 }));
    })();

    this.cartCount$ = stream.pipe(
      map((c) => c?.items?.reduce((sum, it) => sum + (it.quantity ?? 0), 0) ?? 0)
    );

    // Ensure backend state is loaded so badge is correct on first paint.
    const anyCart = this.cart as any;
    if (typeof anyCart.fetchCart === 'function') {
      anyCart.fetchCart().subscribe({ error: () => {} });
    } else if (typeof anyCart.refresh === 'function') {
      anyCart.refresh();
    }
  }
}
