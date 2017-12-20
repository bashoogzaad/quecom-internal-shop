import { Component, OnInit, Inject } from '@angular/core';
import { Order } from "../models/order";
import { CartProvider } from "../providers/cart.provider";
import { OrderLine } from "../models/order-line";
import { CustomerData } from "../models/customer-data";
import { ActivatedRoute, Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { QuecomProvider } from "../providers/quecom.provider";

import swal from 'sweetalert2';
import { Globals } from "../providers/globals";

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
        @Inject(DOCUMENT) private document: any,
        public router: Router,
        public globals: Globals
    ) {
        this.customerData = new CustomerData();
        this.route.paramMap.subscribe(res => {
            this.customerData.remarks = res.get('remarks');
        });
    }

    ngOnInit() {
        this.order = this.cartProvider.getCurrentOrder();
    }
    
    roundToTwo(num) {    
        return Math.round(num * 100) / 100;
    }
    
    getOrderLineSubtotal(orderLine: OrderLine) {
        return this.roundToTwo(orderLine.count*orderLine.product.price_total_netto*1.21);
    }
    
    getOrderTotal() {
        let total = 0.0;
        for(let orderLine of this.order.orderLines) {
            total += this.getOrderLineSubtotal(orderLine);
        }
        return this.roundToTwo(total);
    }
    
    getDiscountTotal() {
        let total = 0.0;
        for(let discount of this.discounts) {
            total += discount.value;
        }
        return this.roundToTwo(total);
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
                
                console.log('Order total: '+this.getOrderTotal());
                console.log('Coupon: '+this.roundToTwo(res['value']));
                
                if (this.roundToTwo(res['value']) > this.getOrderTotal()) {
                    
                    swal({
                        title: 'Weet je het zeker?',
                        text: "De kortingsbon is meer waard dan de waarde van de order. Als je doorgaat, gaat de overige waarde van de bon verloren.",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: 'green',
                        cancelButtonColor: 'red',
                        confirmButtonText: 'Voeg toe',
                        cancelButtonText: 'Annuleer'
                      }).then((result) => {
                        if (result.value) {
                            this.discounts.push({
                                value: this.getOrderTotal(),
                                coupon_code: res['coupon_code']
                            });
                            this.errorMessage = 'Kortingsbon ('+res['coupon_code']+') ter waarde van €'+res['value'].replace(".", ",")+' verwerkt.';
                            this.showError = true;
                        }
                      });
                    
                } else {
                    this.errorMessage = 'Kortingsbon ('+res['coupon_code']+') ter waarde van €'+res['value'].replace(".", ",")+' verwerkt.';
                    this.showError = true;
                    this.discounts.push({
                        value: res['value'],
                        coupon_code: res['coupon_code']
                    });
                }
                
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
            console.log(res);
            if (res[0]['url']) {
                this.document.location.href = res[0]['url'];
            } else {
                swal({
                    title: 'Bedankt voor je bestelling',
                    text: "Je bestelling is geplaatst en wordt verwerkt.",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: 'green',
                    confirmButtonText: 'Oke!'
                  }).then((result) => {
                    if (result.value) {
                        this.cartProvider.resetCart();
                        this.router.navigateByUrl('/home');
                    }
                  });
            }
        }, error => {
            console.log(error);
        });
    }

}
