import { Component, OnInit } from '@angular/core';
import { CartProvider } from "../providers/cart.provider";
import { LocalStorageService, LocalStorage } from "ngx-webstorage";
import { Order } from "../models/order";
import { OrderLine } from "../models/order-line";
import { Router } from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

    public order: Order;
    public remarks: string;
    
    constructor(
        public cartProvider: CartProvider,
        public router: Router
    ) { }

    ngOnInit() {
        this.order = this.cartProvider.getCurrentOrder();
    }
    
    roundToTwo(num) {    
        return Math.round(num * 100) / 100;
    }
    
    getOrderLineSubtotal(orderLine: OrderLine) {
        return this.roundToTwo(orderLine.count*orderLine.product.price_total_netto*1.21);
    }
    
    adjustOrderLine(orderLine: OrderLine, amount: number): void {
        this.cartProvider.adjustOrderLine(orderLine, amount);
    }
    
    getOrderQuantity(orderLine: OrderLine) {
        return Number(orderLine.product.minimum_order_quantity);
    }
    
    removeFromCart(orderLine: OrderLine) {
        this.cartProvider.removeOrderLine(orderLine);
    }
    
    getOrderTotal() {
        let total = 0.0;
        for(let orderLine of this.order.orderLines) {
            total += this.getOrderLineSubtotal(orderLine);
        }
        return this.roundToTwo(total);
    }
    
    goToPlaceOrder() {
        this.order.remarks = this.remarks;
        this.router.navigateByUrl('/winkelwagen/bestellen');
    }

}
