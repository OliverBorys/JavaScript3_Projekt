import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getOrderHistory, clearOrderHistory, Order } from '../../../utils/local-storage-utils';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  constructor(
    private titleService: Title
  ) {}

  orders: Order[] = [];

  ngOnInit(): void {
    this.titleService.setTitle('Order history');
    this.orders = getOrderHistory();
  }

  getOrderTotal(order: Order): string {
    return order.items
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }

  handleClearOrders(): void {
    clearOrderHistory();
    this.orders = [];
  }
}
