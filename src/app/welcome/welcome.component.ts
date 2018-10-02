import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Globals } from "../providers/globals";
import { Router } from "@angular/router";
import {QuecomProvider} from "../providers/quecom.provider";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

    public products;
    public showProducts = false;

    constructor(
        public authService: AuthService,
        public globals: Globals,
        public router: Router,
        private provider: QuecomProvider,
    ) {
        if (this.authService.isLoggedIn) {
            this.router.navigate(['/home']);
        }
    }
    
    ngOnInit() {
      this.provider.getProducts(50, 1).subscribe(res => {
        this.products = res.products;
      });
    }

  public getImageUrl(product: any) {
    if (product.image_url) {
      return product.image_url;
    } else {
      return '';
    }
  }

}
