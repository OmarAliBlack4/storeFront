import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProductRead } from '../../core/interfaces/IProduct';
import { ProductServicesService } from '../../core/services/product-services.service';
import { BasketService, BasketDTO, BasketItemDTO } from '../../core/services/basket.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: IProductRead[] = [];
  basket: BasketDTO = { id: '', basketItem: [] };
  userId: string = 'user123';

  constructor(
    private _productService: ProductServicesService,
    private _basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.loadBasket(); 
  }


  getProducts(): void {
    this._productService.getProducts().subscribe({
      next: (data: IProductRead[]) => {
        this.products = data;
        console.log('Products:', data);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  // جلب الـ Basket
  loadBasket(): void {
    this._basketService.getBasket(this.userId).subscribe({
      next: (basket: BasketDTO) => {
        this.basket = basket || { id: this.userId, basketItem: [] };
        console.log('Basket:', this.basket);
      },
      error: (err) => {
        console.error('Error fetching basket:', err);
        this.basket = { id: this.userId, basketItem: [] }; // إذا ما فيش Basket، ننشئ واحد جديد
      }
    });
  }

  // إضافة منتج للـ Basket
  addToCart(product: IProductRead): void {
  const basketItem: BasketItemDTO = {
    id: product.productId,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    stockQuantity: product.stockQuantity,
    description: product.description,
    quantity: 1 // الكمية الافتراضية
  };

  const existingItem = this.basket.basketItem.find(item => item.id === product.productId);
  if (!existingItem) {
    this.basket.basketItem.push(basketItem);
  } else {
    // زيادة الكمية لو المنتج موجود
    existingItem.quantity += 1;
  }

  this._basketService.updateBasket(this.basket).subscribe({
    next: (updatedBasket: BasketDTO) => {
      this.basket = updatedBasket;
      console.log('Basket updated:', updatedBasket);
    },
    error: (err) => {
      console.error('Error updating basket:', err);
    }
  });
}
}