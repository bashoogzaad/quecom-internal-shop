
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class Globals {
        
    //Session variables
    @LocalStorage() public language;
    public loading = new BehaviorSubject(false);
    
    //Environment variables
    public baseUrl: string;
    public pimcoreUrl: string;
    public apiKey: string;
    public debtorNumber: string;
    public version: string;
    
    //Config (later fill with api call to Pimcore)
    public theme: string;
    public name: string = "HAMA";
    public password: string = 'GezamenlijkLoyaltyVoordeel';
    public hasCoupons: boolean = false;
    public deliveryIndication: string[] = ['Vóór 19:00 uur besteld', 'Volgende dag geleverd*'];
    public hasDeliveryCost: boolean = false;
    public hasBudget: boolean = false;
    public categoriesOnHome: boolean = false;
    public loginType: string = 'simple';
    public pickupAtAmacomAllowed: boolean = true;

    public initDone = new BehaviorSubject(false);
    
    public loadingOn() {
        this.loading.next(true);
    }
    
    public loadingOff() {
        this.loading.next(false);
    }
    
    public init() {
        
        if (!this.language) {
            this.language = 'NL';
        }
        
        if (environment.production === undefined) {
            
            this.version = 'v3';
            this.name = "SONYSTAFF";

            const url = 'https://api.quecom.nl/customer';
            this.baseUrl = url + '/' + this.version + '/';
            this.pimcoreUrl = (url.endsWith('/') ? url.replace(new RegExp('/' + '$'), '-cms/') : (url + '-cms/')) + this.version + '/';
            
            this.apiKey = 'CeWgpOSVF9ok6SgsmN0XFDkbQeBoxZMXlJjNZgGD';
            this.debtorNumber = '102094';
            
        } else {
            
            this.version = environment.version;
            
            const url = environment.apiUrl.endsWith('/') ? environment.apiUrl.replace('/', '') : environment.apiUrl;
            this.baseUrl = url + '/' + this.version + '/';
            this.pimcoreUrl = (url.endsWith('/') ? url.replace(new RegExp('/' + '$'), '-cms/') : (url + '-cms/')) + this.version + '/';
            
            this.apiKey = environment.apiKey;
            this.debtorNumber = environment.debtorNumber;
            
        }

    }
    
}
