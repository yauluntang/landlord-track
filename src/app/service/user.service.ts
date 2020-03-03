import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
const app = firebase.initializeApp({
  apiKey: "AIzaSyDLtzHToigTmjt30HOMSKoW4Y0slzAYGoU",
  authDomain: "landlord-track.firebaseapp.com",
  databaseURL: "https://landlord-track.firebaseio.com",
  projectId: "landlord-track",
  storageBucket: "landlord-track.appspot.com",
  messagingSenderId: "807214392150",
  appId: "1:807214392150:web:6bfc1dae4c52738dba2cf7"
});

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { 

  }

  createUser( email, password ){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }
}
