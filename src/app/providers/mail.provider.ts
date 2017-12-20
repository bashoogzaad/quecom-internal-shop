import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isDevMode } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from "@angular/http";
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { Globals } from "./globals";

@Injectable()
export class MailProvider {
        
    constructor(
        private http: Http,
        private globals: Globals
    ) {
        
    }
    
    public sendMail(data: Object) {
        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        
        this.http.post('https://formspree.io/info@gezamenlijkvoordeel.nl', JSON.stringify(data), options).subscribe(res => {
        
        
        });
        
    }
   
    
}