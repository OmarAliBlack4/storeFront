import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../apiRoot/baseUrl';
import { IProductRead } from '../interfaces/IProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {

  constructor(private _httpClient:HttpClient) { }

// methods

  getProducts(): Observable<any> {
   return this._httpClient.get(`${baseURL}/Product/GetAllProduct`);
  }

  getProductByID(id: number): Observable<any> {
    return this._httpClient.get(`${baseURL}/Product/GetAllProduct/${id}`);
  }

  addProduct(newProduct: IProductRead): Observable<any> {
    return this._httpClient.post(`${baseURL}/Product/CreateProduct
`, newProduct);
  }

  deleteProduct(id: string): Observable<any> {
    return this._httpClient.delete(`${baseURL}/Product/${id}`)
  }
}
