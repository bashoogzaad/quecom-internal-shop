
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable()
export class Globals {
        
    public baseUrl: string = environment.apiUrl.endsWith('/') ? environment.apiUrl : environment.apiUrl+'/';
    public apiKey: string = environment.apiKey;
    public debtorNumber: string = environment.debtorNumber;
    
    //Config (later fill with api call to Pimcore)
    public name: string = "HAMA";
    public password: string = 'GezamenlijkLoyaltyVoordeel';
    public hasCoupons: boolean = true;
    public deliveryIndication: string[] = ['Vóór 19:00 uur besteld', 'Volgende dag geleverd*'];
    
}