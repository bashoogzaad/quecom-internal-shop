import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isDevMode } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from "@angular/http";
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { Globals } from "./globals";

@Injectable()
export class PimcoreProvider {
        
    constructor(
        private http: Http,
        private globals: Globals
    ) {
        
    }
    
    
    
}