import { Component, OnInit } from '@angular/core';
import { QuecomProvider } from "../providers/quecom.provider";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorage } from "ngx-webstorage";
import { Order } from "../models/order";
import { CartProvider } from "../providers/cart.provider";
import { OrderLine } from "../models/order-line";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

    product: any;
    selectedTab: string = "product-detail";

    amount: number = 1;
    minimumOrderQuantity: number = 1;

    constructor(
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        public cartProvider: CartProvider,
        public router: Router
    ) { }

    ngOnInit() {
        
        this.route.paramMap.subscribe(params => {
            
            let productId = params.get('id');
            this.quecomProvider.getProduct(productId).subscribe(res => {
                this.product = res;
                if (this.product['ean'] === '848061070668') {
                    this.product['minimum_order_quantity'] = 3;
                }
                this.amount = Number(this.product['minimum_order_quantity']);
                this.minimumOrderQuantity = this.amount;
                
            });
            
        });
        
    } 
    
    addToCart() {
        
        let orderLine = new OrderLine();
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
