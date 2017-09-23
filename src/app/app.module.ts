import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import {Camera} from '@ionic-native/camera';
import {File} from "@ionic-native/file";
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OrdersPage } from '../pages/orders/orders';
import { UploadPage } from '../pages/upload/upload';
import { ProductsPage } from '../pages/products/products';

import { TabsPage } from '../pages/tabs/tabs';
import { Data } from '../providers/data';
import { OrderDetailsPage } from '../pages/order-details/order-details';
import { EnvironmentsModule } from '../app/environment-variables/environment-variables.module';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': ''
  },
  'push': {
    'sender_id': '',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#ff0000',
        'sound': true
      }
    }
  }
}; 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OrdersPage,
    UploadPage,
    TabsPage,
    OrderDetailsPage,
    ProductsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    EnvironmentsModule,
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OrdersPage,
    UploadPage,
    TabsPage,
    OrderDetailsPage,
    ProductsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    Data,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
