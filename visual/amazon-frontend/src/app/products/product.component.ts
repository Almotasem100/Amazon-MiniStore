import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { CartService } from '../cart.service';

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
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => { 
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to fetch products!');
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to your cart.`);
  }
}
