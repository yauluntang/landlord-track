import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html'
})
export class TabsPage {

  constructor( public userService: UserService,
    private navCtrl: NavController ) {

    }
  
  ionViewDidEnter(){
    this.userService.syncHouses();
    this.userService.syncTimer();
  }

  logout(){
    this.userService.logout();
    this.navCtrl.navigateForward('/');
  }
}
