import { Component, OnInit } from '@angular/core';
import { QuecomProvider } from "../providers/quecom.provider";
import { OrderLine } from "../models/order-line";
import { CartProvider } from "../providers/cart.provider";
import { Router } from "@angular/router";
import { Globals } from "../providers/globals";

import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    
    public products: any[] = new Array();
    public useCategories: boolean = true;
    public categories: any[] = new Array();
    
    public showCouponCheck: boolean = false;
    public couponCode: string;
    public errorMessage: string = 'Spannend!!!';

    public imageUrlArray: string[] = [
        'assets/templates/mogo/images/slider/01/slider-01.jpg',
        'assets/templates/mogo/images/slider/01/slider-02.jpg',
        'assets/templates/mogo/images/slider/01/slider-03.jpg',
    ];

    constructor(
        public quecomProvider: QuecomProvider,
        public cartProvider: CartProvider,
        public router: Router,
        public globals: Globals
    ) {
        
    }
    
    toggleCouponCheck() {
        this.showCouponCheck = !this.showCouponCheck;
    }

    ngOnInit() {
        
        this.quecomProvider.getCategories().subscribe(res => {
            this.categories = res['categories'];
        });
        
    }
    
    addToCart(product: any) {
        
        let orderLine = new OrderLine();
        orderLine.count = Number(product.minimum_order_quantity);
        orderLine.subtotal = orderLine.count*product.price_total_netto*1.21;
        orderLine.product = product;
        this.cartProvider.addOrderLine(orderLine);
        
        this.router.navigateByUrl('/winkelwagen');
    }
    
    public checkCouponCode() {
        
        
        this.quecomProvider.checkCouponCode(this.couponCode).subscribe(res => {
            
            if (res['status']) {
                this.errorMessage = 'Kortingscode is niet gevonden of al gebruikt.';
            } else {
                this.errorMessage = 'Je hebt €'+res['value'].replace(".", ",")+' shoptegoed, have fun!';
            }
        });
        
        this.couponCode = undefined;
        
    }
  
    goToPage(type: string, id: number) {
        this.router.navigate(['/'+type, id]);
    }

}
