import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html'
})
export class SigninPage implements OnInit {

  public email:string;
  public password: string;
  public loading: boolean;
  public rememberMe: boolean;
  public errorMessage: string;

  constructor( 
    public userService: UserService,
    private navCtrl: NavController ) { 
   
  }

  ionViewDidEnter(){
    this.loading = true;
    this.userService.getUser().then( res=>{
      this.navCtrl.navigateForward('tabs')
      this.loading = false;
    }).catch(()=>{
      this.loading = false;
    });
  }

  ngOnInit() {
  }

  register(){
    this.navCtrl.navigateForward('signup');
  }

  submit(){
    console.log( 'Create User ', this.email, this.password );
    this.errorMessage = null;
    this.loading = true;
    this.userService.login( this.email, this.password, this.rememberMe ).then( res=>{
      this.navCtrl.navigateForward('tabs')
    }).catch(error=>{
      this.errorMessage = error.message;
      this.loading = false;
    });
  }

}
