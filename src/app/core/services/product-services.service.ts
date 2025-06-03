import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../apiRoot/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {

  constructor(private _httpClient:HttpClient) { }

// methods

  getProducts(): Observable<any> {
   return this._httpClient.get(`${baseURL}/Product/GetAllProduct`);
  }
}
