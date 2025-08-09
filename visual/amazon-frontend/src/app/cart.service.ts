// src/app/cart.service.ts
import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { product: Product, quantity: number }[] = [];

  constructor() {
    // Load from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  getCartItems() {
    return this.cartItems;
  }

  addToCart(product: Product, quantity: number = 1) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  getTotalPrice() {
    const total = this.cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );
    return total;
  }

  getTotalWithDelivery(deliveryCost: number = 20) {
    return this.getTotalPrice() + deliveryCost;
  }
}
