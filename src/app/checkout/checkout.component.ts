import { AuthService } from '../auth.service';
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
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    public limit1 = 5;
    public limit2 = 2;
  
    public order: Order;
    public customerData: CustomerData;
    public billingToShipment = true;
    public orderPromise: Promise<any>;

    public couponCode: string;
    public errorMessage: string;
    public showError = false;

    public discounts: any[] = new Array();
  
    public user: any;
    public step = 1;
  
    public paymentMethods = new Array();
  
    public selected = {
      paymentMethod: undefined
    };
  
    public shippingTimeframes: any[] = new Array();
    public shippingLocations: any[] = new Array();
  
    public selectedShipment: any;
    public successMsg;
    public errorMsg;
  
    constructor(
        public cartProvider: CartProvider,
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        @Inject(DOCUMENT) private document: any,
        public router: Router,
        public globals: Globals,
        public authService: AuthService
    ) {
      
        this.paymentMethods =   [
          { id: 1, name: 'iDeal' },
          { id: 2, name: 'Bancontant' }
        ];
      
        this.customerData = new CustomerData();
        this.route.paramMap.subscribe(res => {
            this.customerData.remarks = res.get('remarks');
        });
      
        this.user = this.authService.user;
        if (this.user.street) {
            this.customerData.genderSh = this.user.gender;
            this.customerData.firstNameSh = this.user.first_name;
            this.customerData.lastNameSh = this.user.last_name;
            this.customerData.emailAddressSh = this.user.username;
//            this.customerData.companyName = this.customerData.companyNameSh;
            this.customerData.addressSh = this.user.street;
            this.customerData.houseNumberSh = this.user.house_number;
            this.customerData.houseNumberExtensionSh = this.user.house_number_extension;
            this.customerData.postalCodeSh = this.user.postal_code;
            this.customerData.citySh = this.user.city;
            this.customerData.phoneNumberSh = this.user.phone_number;
            this.customerData.countrySh = this.user.country;
          
            if (this.billingToShipment) {
              this.billingToShipment = !this.billingToShipment;
              this.toggleBillingToShipment();
            }
          
        }
      
      this.quecomProvider.getShippingTimeframes(this.user.postal_code, this.customerData.houseNumberSh, this.user.country, this.user.house_number_extension).subscribe(tf => {
        console.log(tf);
        for (const t of tf['Timeframes']['Timeframe']) {
          for (const timeframe of t['Timeframes']['TimeframeTimeFrame']) {
            
            const parts = t['Date'].split('-');
            const date = new Date(parts[2], parts[1]-1, parts[0]);
            
            const startDate = new Date(date.getTime());
            startDate.setHours(timeframe['From'].split(':')[0]);
            startDate.setMinutes(timeframe['From'].split(':')[1]);
            
            const endDate = new Date(date.getTime());
            endDate.setHours(timeframe['To'].split(':')[0]);
            endDate.setMinutes(timeframe['To'].split(':')[1]);
            
            const shm = new Object();
            shm['timeframe_start'] = startDate;
            shm['timeframe_end'] = endDate;
            
            shm['cost'] = timeframe['Options']['string'] == 'Evening' ? 2 : 0;
            
            this.shippingTimeframes.push(shm);
            
          }
        }
        
        this.selectedShipment = this.shippingTimeframes[0];
        
      });
      
      this.quecomProvider.getShippingLocations(this.user.postal_code, this.user.country).subscribe(tf => {
        console.log(tf);
        this.shippingLocations = tf['GetLocationsResult']['ResponseLocation'];
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
    
    getDeliveryCost() {
      
      if (!this.globals.hasDeliveryCost) {
        return 0.0;
      }
      
      return 6.95;
    }
    
    getOrderSubtotal() {
        let subtotal = 0.0;
        for(const orderLine of this.order.orderLines) {
            subtotal += this.getOrderLineSubtotal(orderLine);
        }
        return this.roundToTwo(subtotal);
    }
    
    getOrderTotal() {
        let total = 0.0;
        for(let orderLine of this.order.orderLines) {
            total += this.getOrderLineSubtotal(orderLine);
        }
      
        total = total + this.getDeliveryCost();
      
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
      
      this.checkAddress();
      
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
            if (res[0]['url']) {
                this.cartProvider.resetCart();
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
  
  stepper(num: number) {
    this.step = this.step + num;
    window.scrollTo(0,0);
  }
  
  public loadMore(): void {
    this.limit1 += 5;
    this.limit2 += 2;
    console.log(this.selectedShipment)
  }
  
  public checkAddress() {
    
    if (this.customerData.address && this.customerData.address.toLowerCase() === 'taurusavenue' && 
        this.customerData.houseNumber && this.customerData.houseNumber === '16' && 
        this.customerData.city && this.customerData.city.toLowerCase() === 'hoofddorp') {
      this.errorMsg = 'Je bestelling op het ingevulde adres ontvangen is niet mogelijk. Pas het adres aan.';
    } else {
      this.errorMsg = undefined;
    }
    
    if (this.customerData.firstName &&
        this.customerData.lastName &&
        this.customerData.address &&
        this.customerData.houseNumber &&
        this.customerData.houseNumberExtension &&
        this.customerData.postalCode &&
        this.customerData.city &&
        this.customerData.phoneNumber &&
        this.customerData.country) {
      this.successMsg = "De ingevoerde gegevens zijn "
    }
    
  }
  
}
