import { Component, OnInit } from '@angular/core';
import { getCartItems, removeFromCart, updateCartQuantity, CartItem } from '../../../utils/local-storage-utils';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterLink],
})
export class ProductGridComponent implements OnInit {
  cartItems: CartItem[] = [];

  ngOnInit(): void {
    this.loadCartItems();
    window.addEventListener('cartUpdated', this.loadCartItems.bind(this));
  }

  loadCartItems() {
    this.cartItems = getCartItems();
  }

  changeQuantity(productId: number, quantity: number): void {
    updateCartQuantity(productId, quantity);
    this.loadCartItems();
  }

  removeItem(productId: number): void {
    removeFromCart(productId);
    this.loadCartItems();
  }

  get total(): string {
    return this.cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  }
}
