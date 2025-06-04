import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../apiRoot/baseUrl';

export interface BasketItemDTO {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  stockQuantity?: number;
  description?: string;
  quantity: number; 
}

export interface BasketDTO {
  id: string;
  basketItem: BasketItemDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  constructor(private http: HttpClient) {}

  getBasket(id: string): Observable<BasketDTO> {
    return this.http.get<BasketDTO>(`${baseURL}/Basket/GetBasket/${id}`);
  }

  updateBasket(basket: BasketDTO): Observable<BasketDTO> {
    return this.http.post<BasketDTO>(`${baseURL}/Basket/AddOrUpdateBasket`, basket);
  }
}