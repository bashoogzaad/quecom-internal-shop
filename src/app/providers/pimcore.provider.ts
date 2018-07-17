import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isDevMode } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from "@angular/http";
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { Globals } from "./globals";
import { environment } from "../../environments/environment";

@Injectable()
export class PimcoreProvider {
        
    constructor(
        private http: Http,
        private globals: Globals
    ) {
        
    }
    
    private generateDate() {
        return moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
    }
    
    public initRequestOptions() {
        
        const contentType = 'application/json';
        const date: string = this.generateDate();
    
        const headers = new Headers();
        headers.append('X-Api-Key', this.globals.apiKey);
        headers.append('X-Quecom-Date', date);
        headers.append('Content-Type', contentType);
        const options = new RequestOptions({ headers: headers });
        
        return options;
        
    }
    
    public getMetaInfo() {
        const options = this.initRequestOptions();
        return this.http.get(this.globals.pimcoreUrl+'meta', options).map(res => res.json());
    }
  
    public getCustomers() {
        const options = this.initRequestOptions();
        return this.http.get(this.globals.pimcoreUrl+'customer', options).map(res => res.json());
    }
  
    public getOrganizations() {
        const options = this.initRequestOptions();
        return this.http.get(this.globals.pimcoreUrl+'organization', options).map(res => res.json());
    }
  
    public getBudget(id: any, hash: any) {
        const options = this.initRequestOptions();
        options.headers.append('X-Pimcore-Hash', hash);
        options.headers.append('X-Pimcore-User', id);
        return this.http.get(this.globals.pimcoreUrl+'customer/budget', options).map(res => res.json());
    }
  
    public login(username: string, password: string) {
        const options = this.initRequestOptions();
        options.headers.append('username', username);
        options.headers.append('password', password);
        return this.http.get(this.globals.pimcoreUrl+'login', options).map(res => res.json());
    }

    public updateUser(postData: any, id: any, hash: any) {
        const options = this.initRequestOptions();
        options.headers.append('X-Pimcore-Hash', hash);
        options.headers.append('X-Pimcore-User', id);
        return this.http.post(this.globals.pimcoreUrl+'user/update', JSON.stringify(postData), options).map(res => res.json());
    }
  
    public register(user: any) {
        const options = this.initRequestOptions();
        return this.http.post(this.globals.pimcoreUrl+'register', JSON.stringify(user), options).map(res => res.json());
    }
  
    public getOrders(id: any, hash: any, shopName: string) {
      const options = this.initRequestOptions();
      options.headers.append('X-Pimcore-Hash', hash);
      options.headers.append('X-Pimcore-User', id);
      return this.http.get(this.globals.pimcoreUrl+'order?reference='+shopName+'-'+id+'&vkorg=2000', options).map(res => res.json());
    }

    public getInvoices(id: any, hash: any, shopName: string) {
      const options = this.initRequestOptions();
      options.headers.append('X-Pimcore-Hash', hash);
      options.headers.append('X-Pimcore-User', id);
      return this.http.get(this.globals.pimcoreUrl+'invoice?reference='+shopName+'-'+id+'&vkorg=2000', options).map(res => res.json()); 
    }
    
    public requestPassword(username: string) {
        const options = this.initRequestOptions();
        options.headers.append('username', username);
        return this.http.get(this.globals.pimcoreUrl+'password/request', options).map(res => res.json());
        
    }
    
}