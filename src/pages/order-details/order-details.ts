import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Data } from '../../providers/data';

@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {

  order;
  orderDetails;
  total: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public data: Data) {
    this.order = this.navParams.get('order');
    this.orderDetails = this.order.orderDetails;
    this.calculateTotal();
  }

  calculateTotal(){
    for(let i=0; i<this.orderDetails.length; i++) {
      this.total += ( this.orderDetails[i].product.productPrice * this.orderDetails[i].quantityRequired );
    }
  }

  updateOrderStatus(status: string){
    console.log(this.order.status);
    this.order.status = status;
    console.log(this.order.status);
    this.data.updateOrderStatus(this.order);
  }

  isDelivered(){
    if (this.order.status=="Delivered"){
      return true ;
    } 
    return false ;
  }
}