import { AuthService } from './../../core/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { ILogin } from '../../core/interfaces/iregister';

import { Router } from '@angular/router';
import { SharedModule } from '../../shared/module/shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
// propirity
  userName! :FormControl;
  password!:FormControl;
  loginForm!:FormGroup;

//constructor
  constructor(private _authService :AuthService,
    private _router: Router
  ){
    this.initialFormControls();
    this.initialFormGroup();
  }

//Methods
  //initial form controls method
  initialFormControls():void{
    this.userName = new FormControl('',[Validators.required , Validators.minLength(2)]);
    this.password = new FormControl('',[Validators.required , Validators.minLength(6)]);
  }

  //initial form group method
  initialFormGroup():void{
    this.loginForm = new FormGroup({
      userName : this.userName,
      password : this.password
    });
  };

//submit method
  onSubmit():void{
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.loginApi(this.loginForm.value);
    }else{
      console.log("rerr");
    }
  }


//loginApi method
loginApi(data: ILogin): void {
  this._authService.login(data).subscribe({
    next: (res) => {
      console.log(res);
      
      localStorage.setItem('userData', JSON.stringify(res));

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (userData?.role === 'Admin') {
        // this._router.navigate(['/products-panel']);
      } else {
        this._router.navigate(['/']);
      }
    },
    error: (err) => {
      console.log(err);
    },
  });
}


}
