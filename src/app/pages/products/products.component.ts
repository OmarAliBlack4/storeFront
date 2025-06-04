import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProductRead } from '../../core/interfaces/IProduct';
import { ProductServicesService } from '../../core/services/product-services.service';
import { BasketService, BasketDTO, BasketItemDTO } from '../../core/services/basket.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: IProductRead[] = [];
  basket: BasketDTO = { id: '', basketItem: [] };
  userId: string;

  constructor(
    private _productService: ProductServicesService,
    private _basketService: BasketService
  ) {
    this.userId = localStorage.getItem('userId') || uuidv4();
    localStorage.setItem('userId', this.userId);
    this.basket.id = this.userId; 
  }

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

  loadBasket(): void {
    this._basketService.getBasket(this.userId).subscribe({
      next: (basket: BasketDTO) => {
        this.basket = basket || { id: this.userId, basketItem: [] };
        console.log('Basket:', this.basket);
      },
      error: (err) => {
        console.error('Error fetching basket:', err);
        this.basket = { id: this.userId, basketItem: [] };
      }
    });
  }

  addToCart(product: IProductRead): void {
    const basketItem: BasketItemDTO = {
      id: product.productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      description: product.description,
      quantity: 1
    };

    const existingItem = this.basket.basketItem.find(item => item.id === product.productId);
    if (!existingItem) {
      this.basket.basketItem.push(basketItem);
    } else {
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

  showAlert: boolean = false;
  alert(product: IProductRead) {
    this.addToCart(product);
    this.showAlert = true;

    setTimeout(()=>{
    this.showAlert = false;
    }, 1000);
  }
}