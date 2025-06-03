import { AuthService } from './../../core/services/auth.service';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { IRegister } from '../../core/interfaces/iregister';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/module/shared/shared.module';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

// propirity
  userName! : FormControl;
  email!:FormControl;
  password!:FormControl;
  role!:FormControl;
  registertionForm!:FormGroup;
  messages!: Message[] ;

// Constructor
  constructor(private _AuthService: AuthService ,
    private messageService: MessageService,
    private _ngxSpinnerService : NgxSpinnerService,
    ){

    this.initFormControls();
    this.initFormGroup();
  }


// Methods
//initial form Controls method
  initFormControls():void {
    this.userName = new FormControl('',[Validators.required , Validators.minLength(3)]);
    this.email = new FormControl('',[Validators.required , Validators.email]);
    this.password = new FormControl('',[Validators.required]);
    this.role = new FormControl('',[Validators.required ]);
  }

//initial form Group method
  initFormGroup() : void{
    this.registertionForm = new FormGroup(({
      userName : this.userName,
      email : this.email,
      password : this.password,
      role : this.role
    }))
  }

// Password Match Methoud
  // passwordMatch(pass: AbstractControl) : ValidatorFn{
  //   return(repass: AbstractControl) : null | {[Key : string]:boolean} =>{
  //     if (pass.value !== repass.value) {
  //       return {passNotMatch : true}
  //     }else{
  //       return null
  //     }
  //   }
  // }

//Submit Method
  submit():void{
    if(this.registertionForm.valid){
      console.log(this.registertionForm.value);
      this.registerApi(this.registertionForm.value);
    }else{
      this.registertionForm.markAllAsTouched();
      Object.keys(this.registertionForm.controls).forEach((c)=>
      this.registertionForm.controls[c].markAsDirty());
    }
  }


  //registerApi
  registerApi(data: IRegister): void {
    this._ngxSpinnerService.show();
    this._AuthService.register(data).subscribe({
      next: (res) => {
        // if(res.user.id) {
        //   this.show("success","Success" ,"Success register");
        //   this._router.navigate(['login']);
        // }
        this._ngxSpinnerService.hide();
      },
      error: (error) => {
        this.show("error","Error" ,error.error.error);
        this._ngxSpinnerService.hide();
      },
    });
  }


  //notification
  show(se : string , su : string , de:string) {
    this.messageService.add({ severity:se, summary: su, detail: de });
  }
}
