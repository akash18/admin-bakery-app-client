import {Component} from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
//import { UserDetails } from '@ionic/cloud-angular';
//import {Response, RequestOptions, Headers} from "@angular/http";

import { Data } from '../../providers/data';
import { OrderDetailsPage } from '../order-details/order-details';

@Component({
  templateUrl: 'orders.html'
})
export class OrdersPage {

  constructor(public data: Data, private loadingCtrl: LoadingController, private navCtrl: NavController){
  
  }

  goToDetails(order) {
    this.navCtrl.push(OrderDetailsPage, {
      order: order
    });
  }



  
}