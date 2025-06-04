import { Component, OnInit } from '@angular/core';
import { ProductServicesService } from '../../core/services/product-services.service';
import { IProductRead } from '../../core/interfaces/IProduct';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-panel.component.html',
  styleUrl: './product-panel.component.css'
})
export class ProductPanelComponent implements OnInit {
  products: IProductRead[] = [];
  constructor(private _productService: ProductServicesService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this._productService.getProducts().subscribe({
      next: (productsData) => {
        console.log(productsData);
        this.products = productsData;
      },
      error: (error) => {
        console.log('Failed Get ALl Products', error);
      }
    })
  }

  addProductForm: FormGroup = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    stockQuantity: new FormControl('', Validators.required),
  })

  addProduct(): void {
    this._productService.addProduct(this.addProductForm.value).subscribe(
      (res) => { console.log(res) },
      (error) => { console.log('Failed Add Prodcut', error) }
    )
  }
}
