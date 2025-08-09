import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { CartService } from './cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();

  // header cart badge
  cartCount = signal<number>(0);

  private sub?: Subscription;

  constructor(public toast: ToastService, private cart: CartService) {}

  ngOnInit(): void {
    // initialize and stay in sync with cart count
    this.cartCount.set(this.cart.getCount());
    this.sub = this.cart.count$.subscribe((n) => this.cartCount.set(n));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
