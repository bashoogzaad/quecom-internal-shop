import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Globals } from "../providers/globals";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    public data: any = new Object();
    public messageSent: boolean = false;
    
    constructor(
        public http: Http,
        public globals: Globals
    ) {
        
    }

    ngOnInit() {
        
    }
  
    onSubmit() {
        
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        
        this.http.post('https://formspree.io/info@gezamenlijkvoordeel.nl', JSON.stringify(this.data), options).subscribe(res => {
            this.data = new Object();
            this.messageSent = true;
        });
    }

}
