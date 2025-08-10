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
      next: (c: CartDto) => {
        this.cartItems = c.items;
      },
      error: () => this.toast.show('Could not load cart')
    });
  }

  getTotalPrice(): number {
    return this.cart.getSnapshot().subtotal ?? 0;
  }

  getTotalWithDelivery(): number {
    return this.cart.getSnapshot().total ?? 0;
  }

  removeItem(rowId: number): void {
    this.cart.removeItem(rowId).subscribe({
      next: (c: CartDto) => {
        this.cartItems = c.items;
        this.toast.show('Item removed');
      },
      error: () => this.toast.show('Could not remove item')
    });
  }

  increaseQuantity(item: CartItemDto): void {
    const newQty = item.quantity + 1;
    this.updateQuantity(item, newQty);
  }

  decreaseQuantity(item: CartItemDto): void {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      this.updateQuantity(item, newQty);
    }
  }

  private updateQuantity(item: CartItemDto, quantity: number): void {
    // Instant UI feedback
    item.quantity = quantity;

    this.cart.updateQuantity(item.id, quantity).subscribe({
      next: (c: CartDto) => {
        this.cartItems = c.items;
      },
      error: () => this.toast.show('Could not update quantity')
    });
  }

  checkout(): void {
    this.cart.checkout().subscribe({
      next: () => {
        this.cartItems = [];
        this.showModal = true;
      },
      error: () => this.toast.show('Checkout failed')
    });
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
