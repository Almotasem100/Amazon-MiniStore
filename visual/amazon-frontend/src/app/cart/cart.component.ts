import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../cart.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  deliveryCost = 20;
  showModal = false;

  constructor(private cartService: CartService, private toast: ToastService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getTotalWithDelivery(): number {
    return this.cartService.getTotalWithDelivery(this.deliveryCost);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.cartItems = this.cartService.getCartItems();
    this.toast.show('Removed from cart');
  }

  checkout() {
    if (this.cartItems.length === 0) return;
    this.showModal = true;
  }

  confirmOrder() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.showModal = false;
    this.toast.show('Your order is on the way!');
  }
}
