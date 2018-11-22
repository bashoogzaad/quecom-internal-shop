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

      this.globals.loading.subscribe(r => {
        setTimeout(() => {
            this.loading = r;
        }, 0);
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
