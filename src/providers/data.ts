import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { LoadingController, Loading, ToastController } from "ionic-angular";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import { FormGroup } from '@angular/forms';
import { EnvVariables } from '../app/environment-variables/environment-variables.token';

@Injectable()
export class Data {
  orders;
  products;
  private error: string;
  private loading: Loading;
  public saveForm: FormGroup;
  public apiEndpoint: string;

  constructor(private http: Http, private loadingCtrl: LoadingController,
              private toastCtrl: ToastController, @Inject(EnvVariables) public envVariables){
    this.http = http;
    this.apiEndpoint = envVariables.apiEndpoint;
  }

  getOrders(){
    this.createLoadingController();
    this.loading.present();
    return new Promise(resolve => {
      this.http.get(this.apiEndpoint + "orders")
        .map(res => res.json())
        .catch((e) => this.handleError(e))
        .finally(() => this.loading.dismiss())
        .subscribe(data => {
          if(data == null) {
            this.orders = [];
          }else{
            this.orders = data;
          }
          resolve(this.orders);
        });
    });
  }

  getProducts(){
    this.createLoadingController();
    this.loading.present();
    return new Promise(resolve => {
      this.http.get(this.apiEndpoint + "products")
        .map(res => res.json())
        .catch((e) => this.handleError(e))
        .finally(() => this.loading.dismiss())
        .subscribe(data => {
          if(data == null) {
            this.products = [];
          }else{
            this.products = data;
          }
          resolve(this.products);
        });
    });
  }

  getProductImage(filePath: string){
    let options = new RequestOptions( {responseType: ResponseContentType.ArrayBuffer});
    return this.http.get(this.apiEndpoint + "images/" +filePath, options)
    .map(res => {
      return new Blob([res.arrayBuffer()],{ type: res.headers.get("Content-Type") })
    });
  }

  updateProductStatus(product: Object){
    this.createLoadingController();
    this.loading.present();
    return new Promise(resolve => {
      this.http.put(this.apiEndpoint + "product",product)
         .catch((e) => this.handleError(e))
         //.map(res => res.json())
         .finally(() => this.loading.dismiss())
         .subscribe(data => {
           this.showToast(data,'Product successfully updated','Product updation failed');
         });
    });
  }

  updateOrderStatus(order: Object){
    this.createLoadingController();
    this.loading.present();
    return new Promise(resolve => {
      this.http.put(this.apiEndpoint + "order",order)
         .catch((e) => this.handleError(e))
         //.map(res => res.json())
         .finally(() => this.loading.dismiss())
         .subscribe(data => {
           this.showToast(data,'Status update successful','Status update failed');
         });
    });
  }

  private showToast(response: Response, successMsg: string, failureMsg: string) {
    if(response.status >= 200 || response.status < 300) {
      const toast = this.toastCtrl.create({
        message: successMsg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: failureMsg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.error = errMsg;
    return Observable.throw(errMsg);
  }

  private createLoadingController(){
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange: true,
        spinner: 'crescent'
    });
  }

}