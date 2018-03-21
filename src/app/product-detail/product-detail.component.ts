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

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

    product: any;
    selectedTab: string = "product-detail";
    couponCode: string = '';

    amount: number = 1;
    minimumOrderQuantity: number = 1;

    constructor(
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        public cartProvider: CartProvider,
        public router: Router,
        public mailProvider: MailProvider,
        public globals: Globals
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
                
                console.log(res);
                
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
    
    orderBolCoupon() {
        
        this.quecomProvider.checkCouponCode(this.couponCode).subscribe(res => {
            
            let couponCode = this.couponCode;
            
            if (res['status']) {
                swal('Niet geldig', 'Kortingsbon niet gevonden of reeds verbruikt.', 'error');
            } else {
            
                if (res['value'] != 300.00) {
                    swal('Niet mogelijk', 'Deze kortingsbon heeft niet de juiste waarde om om te wisselen voor een Bol.com cadeaukaart.', 'error');
                } else {
                    
                    swal({
                        title: 'Weet je het zeker?',
                        text: "Door het verzilveren van je kortingsbon voor een Bol.com cadeaukaart vervalt je kortingsbon.",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: 'green',
                        cancelButtonColor: 'red',
                        confirmButtonText: 'Akkoord',
                        cancelButtonText: 'Annuleer'
                      }).then((result) => {
                        if (result.value) {
                            this.orderingBolCoupon(couponCode);
                        }
                      });
                    
                }
            
            }
            
            this.couponCode = '';
            
        });
        
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
    
    public async orderingBolCoupon(couponCode: string) {
        
        const steps = ['1', '2', '3'];
        const values = [];
        let currentStep;
        
        swal.setDefaults({
            input: 'text',
            confirmButtonText: 'Volgende &rarr;',
            cancelButtonText: 'Terug',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: 'red',
            progressSteps: steps
        });
        
        var stepData = [];
        stepData[0] = 'Voor- & achternaam';
        stepData[1] = 'E-mailadres';
        stepData[2] = 'Telefoonnummer';
        
        for (currentStep = 0; currentStep < 3;) {
            
            const result = await swal({
              title: stepData[currentStep],
              inputValue: values[currentStep] ? values[currentStep] : '',
              showCancelButton: true,
              currentProgressStep: currentStep
            });
          
            if (result.value) {
                values[currentStep] = result.value
                currentStep++;
                if (currentStep === 3) {
                    swal.resetDefaults();
                    this.quecomProvider.disableCouponCode(couponCode).subscribe(r => {
                        console.log(r);
                        this.mailProvider.sendMail({ name: values[0], emailaddress: values[1], phone_number: values[2], message: 'Kortingsbon '+this.couponCode+" verzilverd voor Bol.com cadeaukaart." });
                        swal('Gelukt!', 'Je Bol.com cadeaukaart ligt de eerstvolgende woensdag klaar bij de receptie', 'success');
                    }, err => {
                        console.log(err);
                    });
                    break;
                }
            } else if (result.dismiss === swal.DismissReason.cancel) {
                if (currentStep !== 0) {
                    currentStep--;
                } else {
                    swal.resetDefaults();
                    break;
                }
            }
            
        }
    }

}
