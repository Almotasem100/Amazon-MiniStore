import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Observable, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartService } from './cart.service';
import { ToastService } from './toast.service';
import type { CartDto } from './models/cart.model';
import { AuthService } from './auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit  {
  private cart = inject(CartService);
  private router = inject(Router);
  readonly toast = inject(ToastService);
  private auth = inject(AuthService);


  currentYear = new Date().getFullYear();

  // Live cart badge count, derived from the CartService stream
  cartCount$: Observable<number>;

  constructor() {
    // Accept either cart.cart$ (Observable<CartDto>) or cart.cart$() -> Observable<CartDto>
    const stream = ((): Observable<CartDto> => {
      const anyCart = this.cart as any;
      const candidate = anyCart.cart$;

      if (typeof candidate === 'function') {
        return candidate.call(this.cart);
      }
      if (isObservable(candidate)) {
        return candidate as Observable<CartDto>;
      }

      // Fallbacks for different service shapes
      if (typeof anyCart.fetchCart === 'function') {
        return anyCart.fetchCart();
      }
      if (typeof anyCart.refresh === 'function') {
        anyCart.refresh();
      }

      // Last-resort: empty shape so the template stays safe
      return new Observable<CartDto>((sub) => sub.next({ items: [], subtotal: 0, total: 0, delivery: 0 }));
    })();

    this.cartCount$ = stream.pipe(
      map((c) => c?.items?.reduce((sum: number, it: any) => sum + (it.quantity ?? 0), 0) ?? 0)
    );

    // Ensure the backend state is loaded so the badge is correct on first paint.
    const anyCart = this.cart as any;
    if (typeof anyCart.fetchCart === 'function') {
      anyCart.fetchCart().subscribe({ error: () => {} });
    } else if (typeof anyCart.refresh === 'function') {
      anyCart.refresh();
    }
  }

  /**
   * JWT-aware navigation: go to /cart if a token exists,
   * otherwise prompt to sign in.
   */
  goToCart(): void {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.router.navigate(['/cart']);
    } else {
      this.toast.show('Please sign in to view your cart.');
      this.router.navigate(['/signin']);
    }
  }

  logout(): void {
    // Clear auth info
    this.auth.logout();

    // Clear cart state
    if ((this.cart as any).cartSubject) {
      (this.cart as any).cartSubject.next({ items: [], subtotal: 0, total: 0, delivery: 0 });
    }

    // Redirect
    this.router.navigate(['/signin']);
  }

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      console.log('scrolling', window.scrollY);
      document.body.classList.toggle('scrolled', window.scrollY > 5);
    });
  }
}
