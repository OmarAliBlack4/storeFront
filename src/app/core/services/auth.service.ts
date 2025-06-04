import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../apiRoot/baseUrl';
import { ILogin, IRegister } from '../interfaces/iregister';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient : HttpClient) {}

  register(registerData: IRegister): Observable<any> {
    return this._HttpClient.post(`${baseURL}/Authontication/Register`, registerData);
  }

  login(loginData: ILogin): Observable<any> {
    return this._HttpClient.post(`${baseURL}/Authontication/Login`, loginData);
  }

  isAdmin(): boolean {
    const userData = localStorage.getItem('userData');

    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.role === "Admin";
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return false;
      }
    }

    return false;
  }
}