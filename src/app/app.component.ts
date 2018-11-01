import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, NavigationStart} from "@angular/router";
import { Globals } from "./providers/globals";
import { PimcoreProvider } from "./providers/pimcore.provider";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    public loading = true;
    public title = 'Gezamenlijk Voordeel';
    
    constructor(
        private router: Router,
        public globals: Globals,
        private pimcoreProvider: PimcoreProvider
    ) {
      this.globals.init();

      const script = document.createElement('script');
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + this.globals.gaid;
      script.async = true;
      document.head.appendChild(script);

      this.router.events.filter(event => event instanceof NavigationStart).subscribe(event => {
        const url = event['url'];
        if (url !== null && url !== undefined && url !== '' && url.indexOf('null') < 0) {
          // @ts-ignore
          gtag('config', this.globals.gaid, {'page_path': url, 'send_page_view': true });
        }
      });
    }
    
    ngOnInit() {


        //Subscribe on each event when route changes
        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
        
        this.pimcoreProvider.getMetaInfo().subscribe(res => {
          
          console.log("Got response from Pimcore: ");
          console.log(res);
          
          const primaryColor = res['primary_color']['data'];
          const secondaryColor = res['secondary_color']['data'];
          document.documentElement.style.setProperty('--color-primary-var', primaryColor);
          document.documentElement.style.setProperty('--color-secondary-var', secondaryColor);
          
          if (res['theme']) {
            const theme = res['theme']['data'];
            this.globals.theme = theme;
          }
          
          if (res['shop_name']) {
            this.globals.name = res['shop_name']['data'];
          }
          
          if (res['has_coupons']) {
            this.globals.hasCoupons = res['has_coupons']['data'] === true;
          }
          
          if (res['password'] && res['login_type']  && res['login_type']['data'] === 'simple') {
            this.globals.password = res['password']['data'];
          }
          
          if (res['has_delivery_cost']) {
            this.globals.hasDeliveryCost = res['has_delivery_cost']['data'] === true;
          }
          
          this.loading = false;
          
          this.globals.loading.subscribe(r => {
              setTimeout(() => {
                  this.loading = r;
              }, 0);
          })
          
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
