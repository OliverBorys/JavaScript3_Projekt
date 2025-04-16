import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from '../../../utils/local-storage-utils';
import { HeaderService, HeaderState } from '../header.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-header',
  standalone: true,
  imports: [NgIf, NgFor, RouterModule],
  templateUrl: './cart-header.component.html',
  styleUrls: ['./cart-header.component.css'],
})
export class CartHeaderComponent implements OnInit, OnDestroy {
  @Input() isHeaderWhite = false;
  cartItems = getCartItems();
  state!: HeaderState;
  private stateSub!: Subscription;
  timeout: any;
  private removeClickListener: () => void = () => {};

  constructor(
    public headerService: HeaderService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.stateSub = this.headerService.state$.subscribe((state) => {
      this.state = state;
    });

    window.addEventListener('cartUpdated', this.handleCartUpdate);

    // Close cart on outside click
    this.removeClickListener = this.renderer.listen(
      'document',
      'mousedown',
      this.handleClickOutside
    );
  }

  ngOnDestroy() {
    this.stateSub?.unsubscribe();
    window.removeEventListener('cartUpdated', this.handleCartUpdate);
    this.removeClickListener();
  }

  handleClickOutside = (event: MouseEvent) => {
    setTimeout(() => {
      const cart = this.el.nativeElement.querySelector('.cart-drawer');
      if (
        this.state?.isCartOpen &&
        cart &&
        !cart.contains(event.target as Node)
      ) {
        this.headerService.toggleCart(false);
      }
    }, 0);
  };

  handleCartUpdate = (event: any) => {
    this.cartItems = getCartItems();
    if (event.detail.openCart) {
      this.headerService.toggleCart(true);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => this.headerService.toggleCart(false),
        3000
      );
    }
  };

  trackById(index: number, item: any): number {
    return item.id;
  }

  onCartButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleCart();
  }

  toggleCart() {
    this.headerService.toggleCart();
  }

  handleRemove(event: Event, productId: number) {
    event.stopPropagation();
    removeFromCart(productId);
    this.cartItems = getCartItems();
    this.headerService.toggleCart(true);
  }

  changeQuantity(event: Event, productId: number, quantity: number) {
    event.stopPropagation();
    updateCartQuantity(productId, quantity);
    this.cartItems = getCartItems();
    this.headerService.toggleCart(true);
  }

  get total() {
    return this.cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }
}
