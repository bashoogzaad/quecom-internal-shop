
import { Injectable } from "@angular/core";

@Injectable()
export class Globals {
        
    public baseUrl: string = "https://client.quecom.nl/api/latest/customer/";
    
    public name: string = "HAMA";
    public publicKey: string = "443rGisiaroQ9rVSJN9kL7es9sArN6P8";
    public privateKey: string = "Mm9se7u2demlgmzL9StjN186D38t8f6r5m7GJMXE7q9pCpHjli78Zfiph8uQ0vEuAi8UWokj1uIy2GdIvvWodaEcs7CgKJMO";
    public debtorNumber: string = '103017';
    public password: string = 'GezamenlijkLoyaltyVoordeel';
    public hasCoupons: boolean = true;
    public deliveryIndication: string[] = ['Vóór 19:00 uur besteld', 'Volgende dag geleverd*'];
    
}