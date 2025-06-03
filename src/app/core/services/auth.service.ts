import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../apiRoot/baseUrl';
import { ILogin, IRegister } from '../interfaces/iregister';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // constructor
  constructor(private _HttpClient : HttpClient) {}

  //method
  register(registerData:IRegister ) : Observable<any>{
    return this._HttpClient.post(`${baseURL}/Authontication/Register`,registerData);
  }
  login(loginData:ILogin) :Observable<any>{
    return this._HttpClient.post(`${baseURL}/Authontication/Login`,loginData);
  }
}
