import {Component, Inject} from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import {Observable} from "rxjs";
import {LoadingController, Loading, ToastController, NavParams} from "ionic-angular";
import {Camera} from '@ionic-native/camera';
import {File, FileEntry} from "@ionic-native/file";
import { Validators, FormBuilder} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import {Product} from '../../app/models/product';
import {Image} from '../../app/models/image';
import { Data } from '../../providers/data';
import { EnvVariables } from '../../app/environment-variables/environment-variables.token';

@Component({
  templateUrl: 'upload.html'
})
export class UploadPage {
  public error: string;
  private loading: Loading;
  private product: Product;
  private uploadApi: string;
  private saveApi: string;
  private isEdit: boolean;

  formErrors = {
    'productName': [],
    'productPrice': [],
    'productType': [],
    'productDescription': [],
    'productQuantity': []
  };

  validationMessages = {
    'productName': {
      'required':      'Product name is required.'
    },
    'productPrice': {
      'required':      'Product price is required.'
    },
    'productType': {
      'required':      'Product type is required.'
    },
    'productDescription': {
      'required':      'Product description is required.'
    },
    'productQuantity': {
      'required':      'Product quantity is required.'
    }
  };

  constructor(private http: Http,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private file: File, private formBuilder: FormBuilder, 
              private provider: Data, private navParams: NavParams, @Inject(EnvVariables) public envVariables) {

      this.uploadApi = envVariables.apiEndpoint + "upload";
      this.saveApi = envVariables.apiEndpoint + "save";
      this.product = new Product(null,null,null,null,null,null);

      if(!this.provider.saveForm){
        this.provider.saveForm = this.formBuilder.group({
          productName: ['', Validators.required],
          productPrice: ['', Validators.required],
          productType: ['cake', Validators.required],
          productDescription: ['Yummy cake', Validators.required],
          productQuantity: ['1', Validators.required]
        });
      }
      
       if(navParams.get('edit') && navParams.get('product')){
           this.product = navParams.get('product');
           this.isEdit = true;
       }

      this.provider.saveForm.valueChanges
      .debounceTime(400)
      .subscribe(data => {
        //this.data = data;
        this.onValueChanged(data);
      });
      
  }

  onValueChanged(data: any) {
    if (!this.provider.saveForm) { return; }
    const form = this.provider.saveForm;
    for (const field in this.formErrors) {
      // clear previous error message
      this.formErrors[field] = [];
      this.provider.saveForm[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field].push(messages[key]);
        }
      }
    }
  }

  clearErrorMessages(){
    this.error = null;
      for (const field in this.formErrors) {
        // clear previous error message
        this.formErrors[field] = [];
      }
  }
 
  saveProduct(){
    this.clearErrorMessages();
    this.product.productName = this.provider.saveForm.get('productName').value;
    this.product.productPrice = this.provider.saveForm.get('productPrice').value;
    this.product.productType = this.provider.saveForm.get('productType').value;
    this.product.productDescription = this.provider.saveForm.get('productDescription').value;
    this.product.productQuantity = this.provider.saveForm.get('productQuantity').value;
   
    this.saveProductData(this.product, this.saveApi);
  }

  takePhoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.product.productImageClientUri = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.product.productImageClientUri = imageData;
      //console.log("IMAGE URL ---- "+imageData);
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  private uploadPhoto(imageFileUri: any): void {
    this.error = null;

    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
     let loading: Loading;
     loading = this.loadingCtrl.create({
        content: 'Streaming...'
      });

    loading.present();
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], {type: file.type});
      const formData = new FormData();
      formData.append('file', imgBlob, file.name);
      loading.dismiss();
      //this.product.productImage = file;
      this.uploadProductImage(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  private uploadProductImage(formData: FormData) {
    this.createLoadingController();
    this.loading.present();
    this.http.post(this.uploadApi, formData)
      .catch((e) => this.handleError(e))
      .map(response => response.text())
      .finally(() => this.loading.dismiss())
      .subscribe(data => {
        this.product.setProductImage(new Image(data));
      });
  }

  private saveProductData(body: any, postApi: string) {
    this.createLoadingController();
    this.loading.present();
    this.http.post(postApi, body)
      .catch((e) => this.handleError(e))
      .map(response => response)
      .finally(() => this.loading.dismiss())
      .subscribe(data => {
        this.showToast(data);
      });
  }

  private showToast(response: Response) {
    if(response.status >= 200 || response.status < 300) {
      const toast = this.toastCtrl.create({
        message: 'Upload successful',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'Upload failed',
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