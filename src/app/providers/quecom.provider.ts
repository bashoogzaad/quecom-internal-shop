import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isDevMode } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from "@angular/http";
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { Globals } from "./globals";

@Injectable()
export class QuecomProvider {

    constructor(
        private http: Http,
        private globals: Globals
    ) {

    }

    private generateDate() {
        return moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
    }

    private buildAuthToken(httpVerb: string, contentType: string, date: string) {

        let quecomDate = date;
        let quecomSignature = httpVerb+"\n"+contentType+"\n"+quecomDate;
        let hmac = CryptoJS.HmacSHA256(quecomSignature, this.globals.apiKey);
        let base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(hmac.toString()));
        let quecomKey = this.globals.apiKey+":"+base64;

        return quecomKey;
    }

    public initRequestOptions(httpVerb: string) {

        let contentType: string = 'application/json';
        let date: string = this.generateDate();

        let headers = new Headers();
        headers.append('X-Api-Key', this.globals.apiKey);
        headers.append('X-Quecom-Date', date);
        headers.append('Content-Type', contentType);
        let options = new RequestOptions({ headers: headers });

        return options;

    }

    public getCategories() {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.globals.baseUrl+'category', options).map(res => res.json());
    }

    public checkCouponCode(couponCode: string) {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.globals.baseUrl+'coupon?code='+couponCode+'&debtor_number='+this.globals.debtorNumber, options).map(res => res.json());
    }

    public disableCouponCode(couponCode: string) {
        let options = this.initRequestOptions('PUT');
        let b = { coupon_code: couponCode, is_used: '1' };
        let body = JSON.stringify(b);
        return this.http.put(this.globals.baseUrl+'coupon', b, options).map(res => res.json());
    }

    public getProduct(id: string) {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.globals.baseUrl+'product/'+id, options).map(res => res.json());
    }

    public getProducts(limit?: number, page?: number) {
        let options = this.initRequestOptions('GET');
        return this.http.get(this.globals.baseUrl+'product?per_page='+limit+'&page='+page+'&orderby=price-desc', options).map(res => res.json());
    }

    public getProductsPerGroup(type: string, id: string, limit: number, page: number) {
        const options = this.initRequestOptions('GET');
        return this.http.get(this.globals.baseUrl+'product?'+type+'='+id+'&per_page='+limit+'&page='+page+'&grouping=product&orderby=price', options)
                        .map(res => res.json());
    }

    public postOrder(b: any) {
        let options = this.initRequestOptions('POST');
        let body = JSON.stringify(b);
        return this.http.post(this.globals.baseUrl+'order', b, options).map(res => res.json());
    }

    public getShippingTimeframes(postalCode: string, houseNumber: any, countryCode: string, houseNumberExt?: any) {
      const options = this.initRequestOptions('GET');
      let query = '?house_number='+houseNumber+'&postal_code='+postalCode+'&country_code='+countryCode;
      if (houseNumberExt) {
        query = query + '&house_number_extension='+houseNumberExt;
      }

      // ONLY FOR RELATIONS SHOP
      const date = new Date();
      date.setDate(date.getDate() + 2);
      query = query + '&timestamp_start=' + Math.round(date.getTime()/1000);

      console.log(query);
      return this.http.get(this.globals.baseUrl+'shipment/timeframe'+query, options).map(res => res.json());
    }

    public getShippingLocations(postalCode: string, countryCode: string) {
      const options = this.initRequestOptions('GET');
      const query = '?postal_code='+postalCode+'&country_code='+countryCode;
      return this.http.get(this.globals.baseUrl+'shipment/location'+query, options).map(res => res.json());
    }

    public checkAddress(houseNumber: any, postalCode: any, houseNumberExt?: any) {
      const options = this.initRequestOptions('GET');
      let query = '?type=postcode_nl&postal_code='+postalCode+'&house_number='+houseNumber;

      if (houseNumberExt) {
        query = query + '&house_number_extension='+houseNumberExt;
      }

      return this.http.get(this.globals.baseUrl+'address'+query, options).map(res => res.json());
    }

    public getSearchResults(sq: string, full?: boolean) {
        const options = this.initRequestOptions('POST');

        let query = {"sq" : sq};
        if(full) {
            query['full'] = true;
        }

        return this.http.post(this.globals.baseUrl + 'search', JSON.stringify(query), options).map(res => res.json());
    }

}
