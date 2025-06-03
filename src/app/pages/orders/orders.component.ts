import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, OrderDTO } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: OrderDTO[] = [];
  userEmail: string = '';

  constructor(private orderService: OrderService) {}

  loadOrders(): void {
    if (!this.userEmail) {
      alert('Please enter an email');
      return;
    }

    this.orderService.getOrdersByEmail(this.userEmail).subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Orders:', orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        alert('Failed to fetch orders. Please try again.');
      }
    });
  }
}