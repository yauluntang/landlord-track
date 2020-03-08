import { Component } from '@angular/core';
import { UserService, Tenant, House } from '../service/user.service';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import moment from "moment-timezone";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html'
})
export class Tab1Page {

  
  public editHouse: any;
  public currentHouse: any;
  public currentHouseId: any;
  public editTenant: any;

  public payTenant: any;
  public payNote: any;
  public moment: any;
  public isPayModal: boolean;
  public refreshing: boolean;
  

  public payAmount; any;

  //public houseEditMode: boolean;

  public mode: string;

  constructor( 
    public userService: UserService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    ) {
      this.moment = moment;
      this.refreshing = false;
    }


  gotoCreateHouse(){
    this.mode = "editHouse";
    this.editHouse = new House();
  }

  back(){
    this.navCtrl.navigateForward( `tabs/tab1`);
  }


  gotoHouse( house ){
    this.navCtrl.navigateForward( `tabs/tab1/${house.id}`);
  }

  removeTenant(){
    this.userService.removeTenant( this.currentHouseId, this.editTenant ).then( res=>{
      this.editTenant = null;
      this.mode = "showHouse";
    }).catch( e=> {

    });
  }

  removeHouse(){
    this.userService.removeHouse( this.currentHouseId ).then( res=>{
      this.editHouse = null;
      this.mode = "listHouses";
    }).catch( e=> {

    });
  }

  createTenant(){
    this.userService.editTenant( this.currentHouseId, this.editTenant ).then( res=>{
      this.editTenant = null;
      this.mode = "showHouse";
    }).catch( e=> {

    });
  }


  submitEditHouse(){
    this.userService.editHouse( this.currentHouseId, this.editHouse ).then( res=>{
      if ( this.currentHouseId ){
        this.mode = "showHouse";
        this.currentHouse = this.userService.houseMap[this.currentHouseId];
      }
      else {
        this.mode = "listHouses";
      }
    }).catch( e=> {

    });
  }

  refresh(){
    this.refreshing = true;
    setTimeout( ()=>{this.refreshing = false},100);
  }

  payInFull(  ){
    this.userService.pay( this.currentHouseId, this.payTenant, this.payAmount, this.payNote ).then( res=>{
      this.isPayModal = false;
      this.refresh();
    });
  }

  closePay(){
    this.isPayModal = false;
  }

  gotoPay( tenant ){
    this.isPayModal = true;
   
    if ( tenant.remaining ){
      this.payAmount = tenant.remaining;
    }
    else {
      this.payAmount = tenant.rent;
    }
    this.payNote = "";
    this.payTenant = new Tenant();
    this.payTenant.copy(tenant);
  }



  cancelHouse(){
    this.editHouse = null;
    if ( this.currentHouseId ){
      this.mode = "showHouse";
    }
    else {
      this.mode = "listHouses";
    }
  }

  cancelTenant(){
    this.editTenant = null;
    this.mode = "showHouse";
  }

  gotoEditTenant( tenant ){
    this.editTenant = new Tenant();
    this.editTenant.copy(tenant);
    this.mode = "editTenant";

    
  }

  addTenant(){
    this.editTenant = new Tenant();
    this.mode = "editTenant";

    console.log( this.editTenant );
  }

  gotoEditHouse(){
    this.mode = "editHouse";
    this.editHouse = new House();
    this.editHouse.copy( this.currentHouse );
    //this.userService.editHouse.name = this.userService.currentHouse.name;
    //this.userService.editHouse.address = this.userService.currentHouse.address;
  }


  ionViewDidEnter(){
    this.currentHouseId = this.route.snapshot.paramMap.get("id");
    
    
    if ( this.currentHouseId === "new"){
      this.editHouse = new House();
      this.mode = "editHouse";
    }
    else if ( this.currentHouseId ){
      this.currentHouse = this.userService.houseMap[this.currentHouseId];
      this.mode = "showHouse";
    }
    else {
      this.userService.currentHouse = null;
      this.mode = "listHouses";
    }
  }

}
