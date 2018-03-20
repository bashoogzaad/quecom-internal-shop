import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { environment } from "../environments/environment";
import { Globals } from "./providers/globals";
import { PimcoreProvider } from "./providers/pimcore.provider";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    title = 'Gezamenlijk Voordeel';
    
    constructor(
        private router: Router,
        private globals: Globals,
        private pimcoreProvider: PimcoreProvider
    ) { }
    
    ngOnInit() {
        
        this.globals.init();
        
        //Subscribe on each event when route changes
        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
        
        this.pimcoreProvider.getMetaInfo().subscribe(res => {
            let primaryColor = res['primary_color']['data'];
            let secondaryColor = res['secondary_color']['data'];
            document.documentElement.style.setProperty('--color-primary-var', primaryColor);
            document.documentElement.style.setProperty('--color-secondary-var', secondaryColor);
        });
      
      this.pimcoreProvider.login("bash@gmail.com", "test").subscribe(res => {
        console.log(res);
      });
        
    }
    
}
