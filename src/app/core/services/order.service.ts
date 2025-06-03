import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../apiRoot/baseUrl';

export interface OrderRequestDTO {
  basketID: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  userAddress: string;
}

export interface OrderItemDTO {
  id: number;
  orderId: string;
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  stockQuantity?: number;
  description?: string;
  quantity: number;
}

export interface OrderDTO {
  id: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  orderItems: OrderItemDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(orderRequest: OrderRequestDTO): Observable<OrderDTO> {
    return this.http.post<OrderDTO>(`${baseURL}/Order`, orderRequest);
  }

  getOrderById(id: string): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${baseURL}/Order/${id}`);
  }

  getOrdersByEmail(email: string): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${baseURL}/Order/email/${email}`);
  }

  getAllOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${baseURL}/Order/all`);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${baseURL}/Order/${id}`);
  }
}