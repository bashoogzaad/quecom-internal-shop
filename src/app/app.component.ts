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
    
    public loading = true;
    title = 'Gezamenlijk Voordeel';
    
    constructor(
        private router: Router,
        public globals: Globals,
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
          const primaryColor = res['primary_color']['data'];
          const secondaryColor = res['secondary_color']['data'];
          document.documentElement.style.setProperty('--color-primary-var', primaryColor);
          document.documentElement.style.setProperty('--color-secondary-var', secondaryColor);
          
          const theme = res['theme']['data'];
          this.globals.theme = theme;
          this.globals.name = res['shop_name']['data'];
          
          console.log(res['has_coupons']['data']);
          this.globals.hasCoupons = res['has_coupons']['data'] === true;
          
          if (res['password'] && res['login_type']  && res['login_type']['data'] === 'simple') {
            this.globals.password = res['password']['data'];
          }
          
        });
      
    }
  
    getId() {
      
      if (this.globals.theme === 'nexgeek') {
        return 'PageContainer';
      } else if (this.globals.theme === 'mogo') {
        return 'theme';
      }
      
    }
    
}
