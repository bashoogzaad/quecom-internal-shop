import { Component, OnInit } from '@angular/core';
import { Globals } from "../providers/globals";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

    public showTeam: boolean = false;

    constructor(
        public globals: Globals
    ) { }

    ngOnInit() {
    
        
        
    }
    
    checkDebtor() {
        return this.globals.debtorNumber;
    }

}
