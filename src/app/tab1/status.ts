

import { Component } from '@angular/core';
import { UserService, Tenant, House } from '../service/user.service';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import moment from "moment-timezone";
@Component({
    selector: 'app-status',
    templateUrl: 'status.html'
  })
export class StatusComponent {
  constructor( 
    public userService: UserService
    ) {
    }

}