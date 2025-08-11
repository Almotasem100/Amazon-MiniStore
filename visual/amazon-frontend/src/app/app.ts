import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Observable, isObservable, filter, map } from 'rxjs';

import { CartService } from './cart.service';
import { ToastService } from './toast.service';
import type { CartDto } from './models/cart.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  private cart = inject(CartService);
  private router = inject(Router);
  readonly toast = inject(ToastService);
  private auth = inject(AuthService);

  currentYear = new Date().getFullYear();
  cartCount$: Observable<number>;
  pageTitle = 'Our Products';
  pageSubtitle = 'Welcome to our mini-store! Shop the best tech and more.';
  isCartPage = false;
  isAuthPage = false; // new flag

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
      if (typeof anyCart.fetchCart === 'function') {
        return anyCart.fetchCart();
      }
      if (typeof anyCart.refresh === 'function') {
        anyCart.refresh();
      }
      return new Observable<CartDto>((sub) =>
        sub.next({ items: [], subtotal: 0, total: 0, delivery: 0 })
      );
    })();

    this.cartCount$ = stream.pipe(
      map(
        (c) =>
          c?.items?.reduce((sum: number, it: any) => sum + (it.quantity ?? 0), 0) ?? 0
      )
    );

    const anyCart = this.cart as any;
    if (typeof anyCart.fetchCart === 'function') {
      anyCart.fetchCart().subscribe({ error: () => {} });
    } else if (typeof anyCart.refresh === 'function') {
      anyCart.refresh();
    }
  }

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      document.body.classList.toggle('scrolled', window.scrollY > 5);
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;

        if (url.startsWith('/cart')) {
          this.isCartPage = true;
          this.isAuthPage = false;
          this.pageTitle = 'Your Cart';
          this.pageSubtitle = 'Review your items before checkout.';
        } else if (url.startsWith('/signin') || url.startsWith('/signup')) {
          this.isCartPage = false;
          this.isAuthPage = true;
          this.pageTitle = 'Welcome to Amazon Mini-Store';
          this.pageSubtitle = 'Your one-stop shop for the latest tech & gadgets.';
        } else {
          this.isCartPage = false;
          this.isAuthPage = false;
          this.pageTitle = 'Our Products';
          this.pageSubtitle = 'Welcome to our mini-store! Shop the best tech and more.';
        }
      });
  }

  goToCart(): void {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.router.navigate(['/cart']);
    } else {
      this.toast.show('Please sign in to view your cart.');
      this.router.navigate(['/signin']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.auth.logout();
    if ((this.cart as any).cartSubject) {
      (this.cart as any).cartSubject.next({
        items: [],
        subtotal: 0,
        total: 0,
        delivery: 0,
      });
    }
    this.router.navigate(['/signin']);
  }
}
