import {Component} from '@angular/core';
import {OrdersPage} from '../orders/orders';
import {UploadPage} from '../upload/upload';
import {ProductsPage} from '../products/products';
import { Data } from '../../providers/data';
import { LoadingController } from 'ionic-angular';

@Component({
templateUrl: 'tabs.html' 
})
export class TabsPage{
    tab1Root: any;
    tab2Root: any;
    tab3Root: any;

    constructor(private data: Data, private loadingCtrl: LoadingController){
        this.tab1Root = UploadPage;
        this.tab2Root = OrdersPage;
        this.tab3Root = ProductsPage;
    }

    getOrders(){
        this.data.getOrders();
    }

    getProducts(){
        this.data.getProducts();
    }

    clearForm(){
        if(this.data.saveForm){
            this.data.saveForm.reset();
            this.data.saveForm.controls['productType'].setValue('cake');
            this.data.saveForm.controls['productQuantity'].setValue('1');
            this.data.saveForm.controls['productDescription'].setValue('Yummy Cake');
        }
    }
    
}