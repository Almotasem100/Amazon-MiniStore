import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { ToastService } from '../toast.service';

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  price: number;
  category?: string | null;
  quantity?: number | null;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private productsApi: ProductService,
    private cart: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.productsApi.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show('Failed to fetch products.');
      }
    });

    this.cart.fetchCart().subscribe({ error: () => {} });
  }

  addToCart(p: Product): void {
    this.cart.addItem(p.id, 1).subscribe({
      next: () => this.toast.show(`Added “${p.name}” to cart`),
      error: () => this.toast.show('Could not add to cart')
    });
  }
}
