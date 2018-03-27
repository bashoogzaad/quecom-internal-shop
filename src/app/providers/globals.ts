
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable()
export class Globals {
        
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
    public hasCoupons: boolean = true;
    public deliveryIndication: string[] = ['Vóór 19:00 uur besteld', 'Volgende dag geleverd*'];
    
    public init() {
        
        if (environment.production === undefined) {
            
            this.version = 'v3';
            
            const url = 'https://api.quecom.nl/customer';
            this.baseUrl = url + '/' + this.version + '/';
            this.pimcoreUrl = (url.endsWith('/') ? url.replace(new RegExp('/' + '$'), '-cms/') : (url + '-cms/')) + this.version + '/';
            
            this.apiKey = 'RwzOkfCU2GnB9Rg2OPvN7KweRokQplRn3ISmvxUL';
            this.debtorNumber = '103116';
            
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