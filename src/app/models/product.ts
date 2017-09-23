import {Image} from '../models/image';

export class Product {
    productName: string;
    productPrice: number;
    productType: string;
    productDescription: string;
    productQuantity: number;
    productImage: Image;
    productImageClientUri: any;

    constructor(productName: string, productPrice: number, productType: string, productDescription: string, 
        productQuantity: number, productImage: Image){
            this.productName = productName;
            this.productPrice = productPrice;
            this.productDescription = productDescription;
            this.productQuantity = productQuantity;
            this.productType = productType;
            this.productImage = productImage;
    }

    public setProductImage(productImage: Image){
        this.productImage = productImage;
    }

}

