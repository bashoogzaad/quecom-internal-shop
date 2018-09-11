import { Component, OnInit } from '@angular/core';
import { QuecomProvider } from "../providers/quecom.provider";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorage } from "ngx-webstorage";
import { Order } from "../models/order";
import { CartProvider } from "../providers/cart.provider";
import { OrderLine } from "../models/order-line";
import { Globals } from '../providers/globals';

import swal from 'sweetalert2';
import { RequestOptions } from "@angular/http";
import { MailProvider } from "../providers/mail.provider";
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: any;
  selectedTab = "product-detail";
  couponCode = '';
  selectedImageIndex = 0;
  
  innerWidth: any;
  
  show = 'description';

  public mainSliderConfig: SwiperConfigInterface = {
        effect: 'fade',
        direction: 'horizontal',
        slidesPerView: 1,
        keyboard: false,
        mousewheel: false,
        scrollbar: false,
        navigation: true,
        pagination: false
  };
  
    amount = 1;
    minimumOrderQuantity = 1;

    constructor(
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        public cartProvider: CartProvider,
        public router: Router,
        public mailProvider: MailProvider,
        public globals: Globals
    ) {
      this.innerWidth = window.screen.width;
    }

    ngOnInit() {
        
        this.route.paramMap.subscribe(params => {
            
            this.globals.loadingOn();
            
            const productId = params.get('id');
            this.quecomProvider.getProduct(productId).subscribe(res => {
                this.product = res;
                this.amount = Number(this.product['minimum_order_quantity']);
                this.minimumOrderQuantity = this.amount;
                                
                  this.product.image_urls = this.product.image_urls ? this.product.image_urls : [];
                  this.product.image_urls.push(this.product.image_url);
                  
                  if (this.product.additional_image_urls) {
                      for (let img of this.product.additional_image_urls) {
                        this.product.image_urls.push(img);
                      }              
                  }
                  
                  this.globals.loadingOff();
              
            });
            
        });
        
    } 
    
    addToCart() {
        
        const orderLine = new OrderLine();
        orderLine.count = this.amount;
        orderLine.subtotal = orderLine.count*this.product.price_total_netto*1.21;
        orderLine.product = this.product;
        this.cartProvider.addOrderLine(orderLine);
        
        this.router.navigateByUrl('/winkelwagen');
    }
    
    getDescription(product: any) {
        var s = product.description_long;
        var idx = 0;
        var q = ['<b>', '</b>'];
        return s.replace(/\*\*/g, function() {
            var ret = q[idx];
            idx = 1 - idx;
            return ret;
        });
    }
    
    extractUniqueSellingPoints(usp: string) {
        var re = /"(.*?)"/g;
        var matches;
        
        var arr = [];
        while ((matches = re.exec(usp)) != null) {
            arr.push(matches[1]);
        }
        return arr;
    }
    
    getStockStatus(product: any) {
        if (product && product.available > 0) {
            return "Beschikbaar";
        } else {
            return "Tijdelijk niet op voorraad";
        }
    }
    
    getStockColor(product: any) {
        if (product && product.available > 0) {
            return "green";
        } else {
            return "red";
        }
    }
    
}
