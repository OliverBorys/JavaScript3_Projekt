import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getOrderHistory, clearOrderHistory, Order } from '../../../utils/local-storage-utils';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit(): void {
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
