import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderDTO, OrderService } from '../../core/services/order.service';


@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderDTO[] = [];
  filteredOrders: OrderDTO[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  filterEmail: string = '';
  sortBy: 'asc' | 'desc' = 'desc';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilterAndSort();
        this.isLoading = false;
        console.log('Orders:', orders);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.isLoading = false;
        console.error('Error fetching orders:', err);
      }
    });
  }

  applyFilterAndSort(): void {
    let filtered = this.orders;
    if (this.filterEmail) {
      filtered = this.orders.filter(order =>
        order.userEmail.toLowerCase().includes(this.filterEmail.toLowerCase())
      );
    }

    this.filteredOrders = filtered.sort((a, b) => {
      const comparison = a.id.localeCompare(b.id);
      return this.sortBy === 'desc' ? -comparison : comparison;
    });
  }

  onFilterChange(): void {
    this.applyFilterAndSort();
  }

  toggleSort(): void {
    this.sortBy = this.sortBy === 'desc' ? 'asc' : 'desc';
    this.applyFilterAndSort();
  }

  deleteOrder(id: string): void {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.orders = this.orders.filter(order => order.id !== id);
        this.applyFilterAndSort();
        this.isLoading = false;
        alert('Order deleted successfully!');
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete order. Please try again.';
        this.isLoading = false;
        console.error('Error deleting order:', err);
      }
    });
  }
}