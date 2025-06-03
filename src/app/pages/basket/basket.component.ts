import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasketService, BasketDTO, BasketItemDTO } from '../../core/services/basket.service';
import { OrderService, OrderRequestDTO } from '../../core/services/order.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, FormsModule], // أضفنا FormsModule للتعامل مع النموذج
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {
  basket: BasketDTO = { id: '', basketItem: [] };
  userId: string = 'user123'; // ID السلة
  totalPrice: number = 0;
  orderForm: OrderRequestDTO = {
    basketID: this.userId,
    userEmail: '',
    userName: '',
    userPhone: '',
    userAddress: ''
  };
  isLoading: boolean = false;

  constructor(
    private _basketService: BasketService,
    private _orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadBasket();
    this.orderForm.basketID = this.userId; // التأكد من إن basketID متعيّن
  }

  // جلب الـ Basket
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

  // حساب إجمالي السعر
  calculateTotalPrice(): void {
    this.totalPrice = this.basket.basketItem.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  // إزالة منتج من الـ Basket
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

  // تحديث الكمية
  updateQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity < 1) return; // منع الكمية من الصفر
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

  // إنشاء طلب جديد
  buyNow(): void {
    if (this.basket.basketItem.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // التحقق من إن كل الحقول مليانة
    if (!this.orderForm.userEmail || !this.orderForm.userName || !this.orderForm.userPhone || !this.orderForm.userAddress) {
      alert('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    this._orderService.createOrder(this.orderForm).subscribe({
      next: (order) => {
        console.log('Order created:', order);
        alert('Order placed successfully!');
        // إفراغ السلة بعد الطلب
        this.basket.basketItem = [];
        this._basketService.updateBasket(this.basket).subscribe();
        this.calculateTotalPrice();
        this.isLoading = false;
        // إعادة تعيين النموذج
        this.orderForm = {
          basketID: this.userId,
          userEmail: '',
          userName: '',
          userPhone: '',
          userAddress: ''
        };
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Failed to place order. Please try again.');
        this.isLoading = false;
      }
    });
  }
}