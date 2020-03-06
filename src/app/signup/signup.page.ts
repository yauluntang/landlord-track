import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html'
})
export class SignupPage implements OnInit {

  public name: string;
  public email:string;
  public password: string;
  public confirmPassword: string;
  public errorMessage: string;

  constructor(  public userService: UserService,
    private navCtrl: NavController  ) { }

  ngOnInit() {
  }

  submit(){
    if ( this.confirmPassword === this.password ){
      console.log( 'Create User ', this.email, this.password );
      this.userService.createUser( this.email, this.password ).then((res)=>{
        this.navCtrl.navigateForward('tabs');
      }).catch(error=>{
        this.errorMessage = error.message;  
      });
    }
    else {
      this.errorMessage = "Confirm password is incorrect"
    }
    
  }

  back(){
    this.navCtrl.navigateForward('/')
  }

}
