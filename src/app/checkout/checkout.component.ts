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
import { PimcoreProvider } from '../providers/pimcore.provider';

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
      paymentMethod: undefined,
      shippingMethod: 'same-as-invoice'
    };
  
    public shippingTimeframes: any[] = new Array();
    public shippingLocations: any[] = new Array();
  
    public shipper = "PostNL";
    public selectedShipment: any;
    public showDelivery = true;
    public successMsg;
    public errorMsg;
  
    public extraShippingCost: number = 0;
    public budget: number;
    public payShipping = true;
  
    public reloadDeliveryOptions = false;
    
    constructor(
        public cartProvider: CartProvider,
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        @Inject(DOCUMENT) private document: any,
        public router: Router,
        public globals: Globals,
        public authService: AuthService,
        public pimcoreProvider: PimcoreProvider
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
      
      this.pimcoreProvider.getBudget(this.user.id, this.user.hash).subscribe(res => {
        this.budget = res.value;
      });
      
      this.loadDeliveryOptions();
      
    }

    ngOnInit() {
        this.order = this.cartProvider.getCurrentOrder();
    }
    
    doReloadDeliveryOptions() {
        this.globals.loadingOn();
        this.loadDeliveryOptions(true);
    }
    
    loadDeliveryOptions(loader?: boolean) {
        
        this.quecomProvider.getShippingTimeframes(this.customerData.postalCode, this.customerData.houseNumber, this.customerData.country, this.customerData.houseNumberExtension).subscribe(tf => {
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
                shm['option'] = timeframe['Options']['string'];
                
                this.shippingTimeframes.push(shm);
                
              }
            }
            
            this.selectedShipment = this.shippingTimeframes[0];
            this.reloadDeliveryOptions = false;
            
            if(loader) {
                this.globals.loadingOff();
            }
            
          });
          
          this.quecomProvider.getShippingLocations(this.customerData.postalCode, this.customerData.country).subscribe(tf => {
              console.log(tf);
              if (tf['GetLocationsResult']) {
                  this.shippingLocations = tf['GetLocationsResult']['ResponseLocation'];
              }
              this.reloadDeliveryOptions = false;
          });
        
    }
    
    roundToTwo(num) {    
        return Math.round(num * 100) / 100;
    }
    
    getOrderLineSubtotal(orderLine: OrderLine) {
        return this.roundToTwo(orderLine.count*orderLine.product.price_total_netto*1.21);
    }
    
    getDeliveryCost() {
      
      if (!this.globals.hasDeliveryCost || !this.payShipping) {
        return 0.0;
      }
      
      let baseCost = 6.95;
      const extraCost = (this.selectedShipment && this.selectedShipment.cost) ? this.selectedShipment.cost : 0;
      
      for (const orderLine of this.order.orderLines) {
        if (orderLine.product.inch_size && orderLine.product.inch_size >= 55) {
          baseCost = 39.95;
        }
      }
      
      return (baseCost + extraCost) * 1.21;
    }
    
    getOrderSubtotal() {
        let subtotal = 0.0;
        for(const orderLine of this.order.orderLines) {
            subtotal += this.getOrderLineSubtotal(orderLine);
        }
        return this.roundToTwo(subtotal);
    }
    
    getOrderTotal() {
        let total = this.getOrderSubtotal();
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
    
    getRestBudget() {
      return this.budget - (this.getOrderSubtotal() - this.getDiscountTotal());
    }
    
    toggleBillingToShipment() {
        
        if (this.selected.shippingMethod == 'same-as-invoice') {
            
            this.billingToShipment = true;
            
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
            
            this.payShipping = true;
          
          this.checkAddress();
      
        } else if (this.selected.shippingMethod == 'central-office') {
            
            this.customerData.address = 'Da vincilaan';
            this.customerData.houseNumber = '7 D1';
            this.customerData.houseNumberExtension = '';
            this.customerData.postalCode = '1935';
            this.customerData.city = 'Zaventem';
            this.customerData.phoneNumber = this.customerData.phoneNumberSh;
            this.customerData.country = 'BE';
            
            this.selectedShipment = undefined;
            this.payShipping = false;
            
        } else if (this.selected.shippingMethod == 'custom-address') {
            
            this.billingToShipment = false;
            
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
            
            this.selectedShipment = undefined;
            this.payShipping = true;
            this.reloadDeliveryOptions = true;
            
        } else if (this.selected.shippingMethod == 'pickup') {
            
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
            
            this.selectedShipment = undefined;
            this.payShipping = false;
            
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
      
        this.orderPromise = this.cartProvider.placeOrder(this.customerData, this.discounts, this.selectedShipment, this.selected.paymentMethod, this.user.id, this.selected.shippingMethod).toPromise().then(res => {
          console.log(res);
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
  }
  
  public checkAddress() {
    
    if (
        this.customerData.address && this.customerData.address.toLowerCase() === 'taurusavenue' && 
        this.customerData.houseNumber && this.customerData.houseNumber === '16' && 
        this.customerData.city && this.customerData.city.toLowerCase() === 'hoofddorp' &&
        this.customerData.country === 'NL'
    ) {
        this.errorMsg = 'Je bestelling op het ingevulde adres ontvangen is niet mogelijk. Pas het adres aan.';
    } else if (
        this.customerData.address && this.customerData.address.toLowerCase() === 'da vincilaan' && 
        this.customerData.city && this.customerData.city.toLowerCase() === 'zaventem' &&
        this.customerData.country === 'BE'
    ) {
        this.errorMsg = 'Je bestelling op het ingevulde adres ontvangen is niet mogelijk. Pas het adres aan.';
    } else {
      this.errorMsg = undefined;
      
      if (this.customerData.firstName &&
        this.customerData.lastName &&
        this.customerData.address &&
        this.customerData.houseNumber &&
        this.customerData.postalCode &&
        this.customerData.city &&
        this.customerData.country) {
        this.successMsg = "De adresgegevens zijn gevalideerd.";
      } else {
        this.successMsg = undefined;
      }
      
    }
    
    this.reloadDeliveryOptions = true;
    
  }
  
  public showDeliveryOptions() {
      
      if (this.selected.shippingMethod == 'central-office' || this.selected.shippingMethod == 'pickup') {
          this.showDelivery = false;
          return false;
      }
      
    for (const orderLine of this.order.orderLines) {
        if (orderLine.product.inch_size && orderLine.product.inch_size >= 55) {
            this.selectedShipment = undefined;
            this.showDelivery = false;
          return false;
        }
      }
    return true;
  }
  
}
