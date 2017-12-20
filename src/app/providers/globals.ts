
import { Injectable } from "@angular/core";

@Injectable()
export class Globals {
        
    public baseUrl: string = "https://client.quecom.nl/api/latest/customer/";
    
    //PERSONEEL
    public publicKey: string = "qUHd1MpxBH9UQ8QFksIoPn0Z2tQ8uSow";
    public privateKey: string = "13NP45IPRB2UDlaRqHoOsjdcT4JP4HWo64OgvSFPNFZuFdLRpXJ4gDRk5Y371C9jh0A2aybTeojpWpTCW0ZhOvudlx8bPSC0";
    public debtorNumber: string = '103016';
    public password: string = 'AMADEC2017';
    public hasCoupons: boolean = true;
    public deliveryIndication: string[] = ['Vandaag besteld*', 'Eerst volgende woensdag afhalen'];

    //RELATIES
//    public publicKey: string = "443rGisiaroQ9rVSJN9kL7es9sArN6P8";
//    public privateKey: string = "Mm9se7u2demlgmzL9StjN186D38t8f6r5m7GJMXE7q9pCpHjli78Zfiph8uQ0vEuAi8UWokj1uIy2GdIvvWodaEcs7CgKJMO";
//    public debtorNumber: string = '103017';
//    public password: string = 'AMADEAL2017';
//    public hasCoupons: boolean = false;
//    public deliveryIndication: string[] = ['Vóór 19:00 uur besteld', 'Zo spoedig mogelijk geleverd'];
    
}