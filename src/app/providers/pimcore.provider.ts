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
        let options = this.initRequestOptions();
        return this.http.get(this.globals.pimcoreUrl+'meta', options).map(res => res.json());
    }
  
    public getCustomers() {
        const options = this.initRequestOptions();
        return this.http.get(this.globals.pimcoreUrl+'customer', options).map(res => res.json());
    }
  
    public login(username: string, password: string) {
        const options = this.initRequestOptions();
        return this.http.get(this.globals.pimcoreUrl+'login?username='+username+'&password='+password, options).map(res => res.json());
    }
    
}