import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { CartProvider } from "../providers/cart.provider";
import { LocalStorageService, LocalStorage } from "ngx-webstorage";
import { Order } from "../models/order";
import { OrderLine } from "../models/order-line";
import { Globals } from '../providers/globals';
import { PimcoreProvider } from '../providers/pimcore.provider';
import { Router } from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

    public order: Order;
    public remarks: string;
    
    public user: any;
    public budget: number;
    
    constructor(
        public cartProvider: CartProvider,
        public router: Router,
        public globals: Globals,
        public pimcoreProvider: PimcoreProvider,
        public authService: AuthService
    ) {}

    ngOnInit() {
      this.order = this.cartProvider.getCurrentOrder();

      console.log(this.order);

      if (this.globals.loginType === 'none' && this.globals.hasBudget) {
        this.user = this.authService.user;
        this.pimcoreProvider.getBudget(this.user.id, this.user.hash).subscribe(res => {
            this.budget = res.value;
        });
      }
      
    }
    
    roundToTwo(num) {    
        return Math.round(num * 100) / 100;
    }
    
    getOrderLineSubtotal(orderLine: OrderLine) {
        return this.roundToTwo(orderLine.count*orderLine.product.price_total_netto*1.21);
    }
    
    adjustOrderLine(orderLine: OrderLine, amount: number): void {
        if (orderLine.count+amount !== 0) {
          this.cartProvider.adjustOrderLine(orderLine, amount);
        } else {
          this.removeFromCart(orderLine);
        }
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
    
    getDeliveryCost() {
      return 6.95
    }
    
    goToPlaceOrder() {
        this.order.remarks = this.remarks;
        this.router.navigateByUrl('/winkelwagen/bestellen');
    }

}
