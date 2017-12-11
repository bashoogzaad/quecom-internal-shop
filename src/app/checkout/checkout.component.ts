import { Component, OnInit, Inject } from '@angular/core';
import { Order } from "../models/order";
import { CartProvider } from "../providers/cart.provider";
import { OrderLine } from "../models/order-line";
import { CustomerData } from "../models/customer-data";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { QuecomProvider } from "../providers/quecom.provider";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    public order: Order;
    public customerData: CustomerData;
    public billingToShipment: boolean = true;
    public orderPromise: Promise<any>;

    public couponCode: string;
    public errorMessage: string;
    public showError: boolean = false;

    public discounts: any[] = new Array();

    constructor(
        public cartProvider: CartProvider,
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        @Inject(DOCUMENT) private document: any
    ) {
        this.customerData = new CustomerData();
        this.route.paramMap.subscribe(res => {
            this.customerData.remarks = res.get('remarks');
        });
    }

    ngOnInit() {
        this.order = this.cartProvider.getCurrentOrder();
    }
    
    getOrderLineSubtotal(orderLine: OrderLine) {
        return orderLine.count*orderLine.product.price_total_netto*1.21;
    }
    
    getOrderTotal() {
        let total = 0.0;
        for(let orderLine of this.order.orderLines) {
            total += this.getOrderLineSubtotal(orderLine);
        }
        return total;
    }
    
    getDiscountTotal() {
        let total = 0.0;
        for(let discount of this.discounts) {
            total += discount.value;
        }
        return total;
    }
    
    getTotal() {
        return this.getOrderTotal()-this.getDiscountTotal();
    }
    
    toggleBillingToShipment() {
        
        this.billingToShipment = !this.billingToShipment;
        
        if (this.billingToShipment) {
            this.customerData.gender = this.customerData.genderSh;
            this.customerData.firstName = this.customerData.firstNameSh;
            this.customerData.lastName = this.customerData.lastNameSh;
            this.customerData.emailAddress = this.customerData.emailAddressSh;
            this.customerData.companyName = this.customerData.companyNameSh;
            this.customerData.address = this.customerData.addressSh;
            this.customerData.houseNumber = this.customerData.houseNumberSh;
            this.customerData.houseNumberExtension = this.customerData.houseNumberExtensionSh;
            this.customerData.postalCode = this.customerData.postalCodeSh;
            this.customerData.city = this.customerData.citySh;
            this.customerData.phoneNumber = this.customerData.phoneNumberSh;
            this.customerData.country = this.customerData.countrySh;
        } else {
            this.customerData.gender = undefined;
            this.customerData.firstName = undefined;
            this.customerData.lastName = undefined;
            this.customerData.emailAddress = undefined;
            this.customerData.companyName = undefined;
            this.customerData.address = undefined;
            this.customerData.houseNumber = undefined;
            this.customerData.houseNumberExtension = undefined;
            this.customerData.postalCode = undefined;
            this.customerData.city = undefined;
            this.customerData.phoneNumber = undefined;
            this.customerData.country = undefined;
        }
    }
    
    public checkCouponCode() {
        
        let obj = this.discounts.find(x => (x.coupon_code === this.couponCode));
        if (obj) {
            this.errorMessage = 'Kortingscode al gebruikt in deze bestelling.';
            this.showError = true;
            this.couponCode = undefined;
            return;
        }
        
        this.quecomProvider.checkCouponCode(this.couponCode).subscribe(res => {
            
            if (res['status']) {
                this.errorMessage = 'Kortingscode is niet gevonden of al gebruikt.';
                this.showError = true;
            } else {
                this.errorMessage = 'Kortingsbon ('+res['coupon_code']+') ter waarde van €'+res['value'].replace(".", ",")+' verwerkt.';
                this.showError = true;
                this.discounts.push({
                    value: res['value'],
                    coupon_code: res['coupon_code']
                });
            }
        });
        
        this.couponCode = undefined;
        
    }
    
    change(event: any, field: string) {
        if (this.billingToShipment) {
            this.customerData[field] = event;
        }
    }
    
    placeOrder() {
        this.orderPromise = this.cartProvider.placeOrder(this.customerData, this.discounts).toPromise().then(res => {
            this.document.location.href = res[0]['url'];
        });
    }

}
