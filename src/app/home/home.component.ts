import { Component, OnInit } from '@angular/core';
import { QuecomProvider } from "../providers/quecom.provider";
import { OrderLine } from "../models/order-line";
import { CartProvider } from "../providers/cart.provider";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    
    public products: any[] = new Array();
    public useCategories: boolean = true;
    
    constructor(
        public quecomProvider: QuecomProvider,
        public cartProvider: CartProvider,
        public router: Router
    ) {
        
    }

    ngOnInit() {
        
        this.quecomProvider.getProducts().subscribe(res => {
            this.products = res.products;
            for (let product of this.products) {
                if (product['ean'] === '848061070668') {
                    product['minimum_order_quantity'] = 3;
                }
            }
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

}
