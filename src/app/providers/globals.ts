
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
    public name: string = "HAMA";
    public password: string = 'GezamenlijkLoyaltyVoordeel';
    public hasCoupons: boolean = true;
    public deliveryIndication: string[] = ['Vóór 19:00 uur besteld', 'Volgende dag geleverd*'];
    
    public init() {
        
        if (environment.production === undefined) {
            
            this.version = 'v3';
            
            let url = 'https://api.quecom.nl/customer';
            this.baseUrl = url + '/' + this.version + '/';
            this.pimcoreUrl = (url.endsWith('/') ? url.replace(new RegExp('/' + '$'), '-cms/') : (url + '-cms/')) + this.version + '/';
            
            this.apiKey = 'HeE5um89GIXFwm38d2f6RURcwcwf5uXyScR1wEdx';
            this.debtorNumber = '102490';
            
        } else {
            
            this.version = environment.version;
            
            let url = environment.apiUrl.endsWith('/') ? environment.apiUrl.replace('/', '') : environment.apiUrl;
            this.baseUrl = url + '/' + this.version + '/';
            this.pimcoreUrl = (url.endsWith('/') ? url.replace(new RegExp('/' + '$'), '-cms/') : (url + '-cms/')) + this.version + '/';
            
            this.apiKey = environment.apiKey;
            this.debtorNumber = environment.debtorNumber;
            
        }
            
    }
    
}