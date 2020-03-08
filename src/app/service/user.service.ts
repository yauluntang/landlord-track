import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import _ from 'lodash';
import moment from "moment-timezone";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDLtzHToigTmjt30HOMSKoW4Y0slzAYGoU",
  authDomain: "landlord-track.firebaseapp.com",
  databaseURL: "https://landlord-track.firebaseio.com",
  projectId: "landlord-track",
  storageBucket: "landlord-track.appspot.com",
  messagingSenderId: "807214392150",
  appId: "1:807214392150:web:6bfc1dae4c52738dba2cf7"
});

const Copy = ( source, target ) => {
  let returnObject;
  returnObject = _.cloneDeep( source );
  for ( let key in returnObject ){
    target[key] = returnObject[key];
  }
}


export class Tenant {
  public name: string;
  public employer: string;
  public rent: number;
  public deposit: number;
  public dueDate: Date;
  public phone: string;
  public remaining: number;

  constructor (){
    this.name = "New Name";
    this.employer = "";
    this.rent = 0;
    this.deposit = 0;
    this.dueDate = new Date();
    this.phone = "";
    this.remaining = 0;
  }

  public copy( tenant ){
    Copy( tenant, this );
  }
}


export class House {
  public name: string;
  public address: string;
  constructor(){
    this.name = "New House";
    this.address = "";
  }
  public copy( house ){
    Copy( house, this );
  }
}



@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userData: any;
  public uid: any;
  public houses: any;
  public houseMap: any;
  public houseSync: any;
  public tenantSync: any;


  public currentHouse: any;
  public currentHouseId: any;
  public currentTenant: any;

  public currentDate: any;
  public currentDateMoment: any;

  constructor() { 

  }

  getUser( ) {
    return new Promise( ( resolve, reject ) =>{
      firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
          this.userData = user;
          this.uid = user.uid;
          resolve( user );
        } else {
          reject();
        }
      });
    });
  }

  logout(){

    firebase.auth().signOut().then(()=> {
      // Sign-out successful.
    }).catch((error)=> {
      // An error happened.
    });
  }

  login( email, password, rememberMe ){

    let statePersistence = firebase.auth.Auth.Persistence.NONE;
    if ( rememberMe ) {
      statePersistence = firebase.auth.Auth.Persistence.LOCAL;
    }

    return new Promise( ( resolve, reject ) =>{
      firebase.auth().setPersistence( statePersistence ).then(() => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(()=>{
          this.getUser().then((user)=>{  
            resolve( user );
          }).catch((error) =>{
            reject(error);
          });
        }).catch((error) =>{
          reject(error);
        });
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  createUser( email, password ){
    return new Promise( ( resolve, reject ) =>{
      firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
        this.getUser().then((user)=>{  
          resolve( user );
        }).catch((error) =>{
          reject(error);
        });       
      }).catch((error) => {
        reject(error);
      });
    })
  }

  syncTimer(){
    setInterval(()=>{
      this.currentDateMoment = moment(new Date());
      this.currentDate = this.currentDateMoment.format("YYYY-MM-DD hh:mm:ss a");
    },250)
  }

  syncHouses(){

    const ourHouses = firebase.firestore().collection('houses').where("roles."+this.uid,"in",["owner"]);


    const today = moment(new Date());

    this.houseSync = ourHouses.onSnapshot( (res)=>{
      this.houses = [];
      this.houseMap = {};

      if ( this.tenantSync ){
        for ( let sync of this.tenantSync ){
          sync();
        }
      }
      this.tenantSync = [];

      res.forEach(doc => {


        let houseObject: any = { ...doc.data(), id: doc.id, rent:0, tenants:[] };
        this.houses.push( houseObject );
        this.houseMap[ doc.id ] = houseObject;       
        let sync = doc.ref.collection('tenant').onSnapshot( (res)=> {
          houseObject.tenants.length = 0;
          res.forEach( doc =>{
            let tenantObject: any = { ...doc.data(), id: doc.id };
            tenantObject.house = houseObject.name;
            let dueMoment = null;
            if (tenantObject.dueDate){
              dueMoment = moment(tenantObject.dueDate);
              if ( today.isSame( dueMoment, 'day' )){
                tenantObject.status = "due";
              }
              else if( today.isAfter( dueMoment, 'day' )){
                tenantObject.status = "overdue";
              }
              else {
                tenantObject.status = "normal"; 
              }
            }else {
              tenantObject.status = "unknown"; 
            }
            
            


            houseObject.tenants.push( tenantObject );
          });

          this.calcAllTenants();

        });
        this.tenantSync.push( sync );
      })
    })
  }

  convertToDate( year, month, day ){
    let date = year + '-';
    if ( month <= 9 ){
      date+='0'+(month+1)+"-";
    }
    else {
      date+=(month+1)+"-";
    }
    if ( day <= 9 ){
      date+='0'+day;
    }
    else {
      date+=day;
    }
    return date;
  }


  pay( houseId, tenant, amount, note ){
    return new Promise( ( resolve, reject ) => {
      if ( tenant.rent > 0 ){


        
        let newRemaining = 0;
        if ( tenant.remaining ){
          newRemaining = tenant.remaining;
        }
        let payMonth = 0;
        do {
          if ( newRemaining > 0 ){
            if ( amount >= newRemaining ){
              amount -= newRemaining;
              newRemaining = 0;
              payMonth ++;
            }
            else {
              newRemaining -= amount;
              amount = 0;
            }
          }

          if ( amount > 0 ){
          
            if ( amount >= tenant.rent ){
              amount -= tenant.rent;
              payMonth ++;
            }
            else {
              newRemaining = tenant.rent - amount;
              amount = 0;
            }
          }
        }while ( amount > 0 )


        console.log( newRemaining );

        tenant.remaining = newRemaining;

        let date = moment(tenant.dueDate);

        let year = date.year();
        let day = date.date();
        let month = date.month();

        console.log( "old", year, month+1, day );
        
        
        month += payMonth;

        if ( month > 11 ){
          do {
            month -= 12;
            year++;
          } while ( month > 11 )
        }


        console.log( "new", year, month+1, day );
        



        let newDate = moment( this.convertToDate( year, month, day ) );
        tenant.dueDate = newDate.format('YYYY-MM-DD');

        console.log( "new", tenant.dueDate );

        tenant.payNote = note;

        console.log( 'pay', tenant );

        firebase.firestore().collection('houses').doc( houseId ).collection('tenant').doc(tenant.id).update( {..._.omit(tenant, 'id')} ).then( () =>{
          resolve();
        }).catch(e=>{
          console.error(e);
          reject(e);
        });

      }
    });
  }


  calcAllTenants(){

  }

  /*
  newTenant(){
    let currentTenant: Tenant = new Tenant();
    currentTenant.name = "New Name";
    currentTenant.employer = "";
    currentTenant.rent = 0;
    currentTenant.deposit = 0;
    currentTenant.dueDate = new Date();
    currentTenant.phone = "";
    return currentTenant;
  }*/

  editTenant( houseId, editTenant ){
    return new Promise( ( resolve, reject ) => {

      if ( editTenant.id ){
        firebase.firestore().collection('houses').doc( houseId ).collection('tenant').doc(editTenant.id).update( _.omit(editTenant, 'id') ).then( () =>{
          resolve();
        }).catch(e=>{
          console.error(e);
          reject(e);
        });
      }
      else {
        firebase.firestore().collection('houses').doc( houseId ).collection('tenant').add( _.omit(editTenant, 'id') ).then( () =>{
          resolve()
        }).catch(e=>{
          console.error(e);
          reject(e);
        });
      }
    });
  }

  removeTenant( houseId, editTenant ){
    return new Promise( ( resolve, reject ) => {
      firebase.firestore().collection('houses').doc( houseId ).collection('tenant').doc(editTenant.id).delete().then( () =>{
        resolve();
      }).catch(e=>{
        console.error(e);
        reject(e);
      });
    });
  }

  editHouse ( houseId, editHouse ){
    return new Promise( ( resolve, reject ) => {
      if ( houseId ){
        firebase.firestore().collection('houses').doc( houseId ).update( _.omit(editHouse, 'id') ).then( () =>{
          resolve()
        }).catch( e =>{
          console.error(e);
          reject(e);
        });
      }
      else {
        firebase.firestore().collection('houses').add( {..._.omit(editHouse, 'id'), roles:{ [this.uid]: "owner" }} ).then( () =>{
          resolve()
        }).catch( e =>{
          console.error(e);
          reject(e);
        });
      }
      
    });
  
  }

  removeHouse( houseId ){
    return new Promise( ( resolve, reject ) => {
      firebase.firestore().collection('houses').doc( houseId ).delete().then( () =>{
        resolve();
      }).catch(e=>{
        console.error(e);
        reject(e);
      });
    });
  }
}
