import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { UploadPage } from '../../pages/upload/upload';
import { Data } from '../../providers/data';

@Component({
  templateUrl: 'products.html'
})
export class ProductsPage {
  constructor(public data: Data, private navCtrl: NavController){

  }

  getProductImage(product): any{
      return this.data.getProductImage(product.productImage.imagePath);
  }

  updateProductStatus(product: any, isActive: boolean){
    product.active = isActive;
    this.data.updateProductStatus(product);
  }

  editProduct(product){
    this.data.saveForm.controls['productName'].setValue(product.productName);
    this.data.saveForm.controls['productPrice'].setValue(product.productPrice);
    this.data.saveForm.controls['productType'].setValue(product.productType);
    this.data.saveForm.controls['productQuantity'].setValue(product.productQuantity);
    this.data.saveForm.controls['productDescription'].setValue(product.productDescription);
    this.navCtrl.push(UploadPage, {
      product: product,
      edit: true
    });
  }

  isActive(product: any){
    if(product.active == true){
      return true;
    }
    return false;
  }
}