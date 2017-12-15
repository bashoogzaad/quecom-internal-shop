import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isDevMode } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from "@angular/http";
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class QuecomProvider {
        
    baseUrl: string = "https://client.quecom.nl/api/latest/customer/";
    publicKey: string = "qUHd1MpxBH9UQ8QFksIoPn0Z2tQ8uSow";
    privateKey: string = "13NP45IPRB2UDlaRqHoOsjdcT4JP4HWo64OgvSFPNFZuFdLRpXJ4gDRk5Y371C9jh0A2aybTeojpWpTCW0ZhOvudlx8bPSC0";
    debtorNumber: string = '103016';

    constructor(
        private http: Http
    ) {
        
    }
    
    private generateDate() {
        return moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
    }
    
    private buildAuthToken(httpVerb: string, contentType: string, date: string) {
        
        let quecomDate = date;
        let quecomSignature = httpVerb+"\n"+contentType+"\n"+quecomDate;
        let hmac = CryptoJS.HmacSHA256(quecomSignature, this.privateKey);
        let base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(hmac.toString()));
        let quecomKey = this.publicKey+":"+base64;
        
        return quecomKey;
    }
    
    public initRequestOptions(httpVerb: string) {
        
        let contentType: string = 'application/json';
        let date: string = this.generateDate();
    
        let headers = new Headers();
        headers.append('X-Quecom-Key', this.buildAuthToken(httpVerb, contentType, date));
        headers.append('X-Quecom-Date', date);
        headers.append('Content-Type', contentType);
        let options = new RequestOptions({ headers: headers });
        
        return options;
        
    }
    
    public getCategories() {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.baseUrl+'category', options).map(res => res.json());
    }
    
    public checkCouponCode(couponCode: string) {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.baseUrl+'coupon?code='+couponCode+'&debtor_number='+this.debtorNumber, options).map(res => res.json());
    }
    
    public getProduct(id: string) {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.baseUrl+'product/'+id, options).map(res => res.json());
    }
    
    public getProducts(limit?: number, page?: number) {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.baseUrl+'product?per_page='+limit+'&page='+page, options).map(res => res.json());
    }
    
    public getProductsPerGroup(type: string, id: string, limit: number, page: number) {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.baseUrl+'product?'+type+'='+id+'&per_page='+limit+'&page='+page+'&grouping=product', options)
                        .map(res => res.json());
    }
    
    public postOrder(b: any) {
        let options = this.initRequestOptions('POST');
        let body = JSON.stringify(b);
        return this.http.post(this.baseUrl+'order', b, options).map(res => res.json());
    }
    
}