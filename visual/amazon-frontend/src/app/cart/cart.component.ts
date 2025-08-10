import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';
import { ToastService } from '../toast.service';
import { CartDto, CartItemDto } from '../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  deliveryCost = 20;
  showModal = false;

  cartItems: CartDto['items'] = [];

  constructor(private cart: CartService, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.cart.fetchCart().subscribe({
      next: (c: CartDto) => (this.cartItems = c.items),
      error: () => this.toast.show('Could not load cart')
    });
  }

  getTotalPrice(): number {
    return this.cart.getSnapshot().total ?? 0;
  }

  getTotalWithDelivery(): number {
    return this.cart.getTotalWithDelivery(this.deliveryCost);
  }

  removeItem(productId: number): void {
    this.cart.removeItem(productId).subscribe({
      next: (c: CartDto) => {
        this.cartItems = c.items;
        this.toast.show('Item removed');
      },
      error: () => this.toast.show('Could not remove item')
    });
  }

  increaseQuantity(item: CartItemDto): void {
    this.cart.updateQuantity(item.id, item.quantity + 1).subscribe({
      next: (c: CartDto) => (this.cartItems = c.items),
      error: () => this.toast.show('Could not update quantity')
    });
  }

  decreaseQuantity(item: CartItemDto): void {
    if (item.quantity > 1) {
      this.cart.updateQuantity(item.id, item.quantity - 1).subscribe({
        next: (c: CartDto) => (this.cartItems = c.items),
        error: () => this.toast.show('Could not update quantity')
      });
    }
  }

  checkout(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  confirmOrder(): void {
    this.cart.checkout().subscribe({
      next: () => {
        this.showModal = false;
        this.cartItems = [];
        this.toast.show('Your order is on the way! 🚚');
      },
      error: () => this.toast.show('Checkout failed')
    });
  }
}
