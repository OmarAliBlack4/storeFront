import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasketService, BasketDTO, BasketItemDTO } from '../../core/services/basket.service';
import { OrderService, OrderRequestDTO } from '../../core/services/order.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {
  basket: BasketDTO = { id: '', basketItem: [] };
  userId: string;
  totalPrice: number = 0;
  orderForm: OrderRequestDTO = {
    basketID: '',
    userEmail: '',
    userName: '',
    userPhone: '',
    userAddress: ''
  };
  isLoading: boolean = false;

  constructor(
    private _basketService: BasketService,
    private _orderService: OrderService
  ) {
    this.userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', this.userId);
    this.orderForm.basketID = this.userId;
  }

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket(): void {
    this._basketService.getBasket(this.userId).subscribe({
      next: (basket: BasketDTO) => {
        this.basket = basket || { id: this.userId, basketItem: [] };
        this.calculateTotalPrice();
        console.log('Basket:', this.basket);
      },
      error: (err) => {
        console.error('Error fetching basket:', err);
        this.basket = { id: this.userId, basketItem: [] };
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.basket.basketItem.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  removeFromBasket(itemId: number): void {
    this.basket.basketItem = this.basket.basketItem.filter(item => item.id !== itemId);
    this._basketService.updateBasket(this.basket).subscribe({
      next: (updatedBasket: BasketDTO) => {
        this.basket = updatedBasket;
        this.calculateTotalPrice();
        console.log('Basket updated:', updatedBasket);
      },
      error: (err) => {
        console.error('Error updating basket:', err);
      }
    });
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity < 1) return;
    const item = this.basket.basketItem.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this._basketService.updateBasket(this.basket).subscribe({
        next: (updatedBasket: BasketDTO) => {
          this.basket = updatedBasket;
          this.calculateTotalPrice();
          console.log('Basket updated:', updatedBasket);
        },
        error: (err) => {
          console.error('Error updating basket:', err);
        }
      });
    }
  }

  buyNow(): void {
    if (this.basket.basketItem.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!this.orderForm.userEmail || !this.orderForm.userName || !this.orderForm.userPhone || !this.orderForm.userAddress) {
      alert('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    this._orderService.createOrder(this.orderForm).subscribe({
      next: (order) => {
        console.log('Order created:', order);
        alert('Order placed successfully!');
        this.basket.basketItem = [];
        this._basketService.updateBasket(this.basket).subscribe();
        this.calculateTotalPrice();
        this.isLoading = false;
        this.orderForm = {
          basketID: this.userId,
          userEmail: '',
          userName: '',
          userPhone: '',
          userAddress: ''
        };
        this.userId = uuidv4();
        localStorage.setItem('userId', this.userId);
        this.orderForm.basketID = this.userId;
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Failed to place order. Please try again.');
        this.isLoading = false;
      }
    });
  }
}