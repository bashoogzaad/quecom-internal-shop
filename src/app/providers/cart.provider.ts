import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Subscription } from 'rxjs';

import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { Order } from "../models/order";
import { OrderLine } from "../models/order-line";
import { CustomerData } from "../models/customer-data";
import { QuecomProvider } from "./quecom.provider";

@Injectable()
export class CartProvider {
    
    //Global variables
    @LocalStorage() public order: Order;
    
    constructor(
        private localStorage: LocalStorageService,
        public quecomProvider: QuecomProvider
    ) {}
    
    getCurrentOrder(): any {
        return this.order;
    }
    
    addOrderLine(orderLine: OrderLine): void {
        this.order.orderLines.push(orderLine);
        this.order = this.order;
    }
    
    adjustOrderLine(orderLine: OrderLine, amount: number): void {
        orderLine.count += amount;
        this.order = this.order;
    }
    
    removeOrderLine(orderLine: OrderLine): void {
        this.order.orderLines.splice(this.order.orderLines.indexOf(orderLine), 1);
        this.order = this.order;
        
        if (this.order.orderLines.length == 0) {
            this.resetCart();
        }
    }
    
    resetCart(): void {
        this.order = new Order();
    }
    
    placeOrder(customerData: CustomerData, discounts?: any[]): Observable<any> {
        
        let submitOrder;
        
        let products = [];
        for (let orderLine of this.order.orderLines) {
            let productEntry = {
                product_id: orderLine.product.product_id,
                amount: orderLine.count
            }
            products.push(productEntry);
        }
        
        let shipment: Object = new Object();
        shipment['gender'] = customerData.genderSh;
        shipment['first_name'] = customerData.firstNameSh;
        shipment['last_name'] = customerData.lastNameSh;
        shipment['street'] = customerData.addressSh;
        shipment['house_number'] = customerData.houseNumberSh;
        shipment['house_number_extension'] = customerData.houseNumberExtensionSh;
        shipment['city'] = customerData.citySh;
        shipment['postal_code'] = customerData.postalCodeSh;
        shipment['country'] = customerData.countrySh;
        shipment['phone_number'] = customerData.phoneNumberSh;
        shipment['email'] = customerData.emailAddressSh;
        
        let billing: Object = new Object();
        billing['gender'] = customerData.gender;
        billing['first_name'] = customerData.firstName;
        billing['last_name'] = customerData.lastName;
        billing['street'] = customerData.address;
        billing['house_number'] = customerData.houseNumber;
        billing['house_number_extension'] = customerData.houseNumberExtension;
        billing['city'] = customerData.city;
        billing['postal_code'] = customerData.postalCode;
        billing['country'] = customerData.country;
        billing['phone_number'] = customerData.phoneNumber;
        billing['email'] = customerData.emailAddress;
        
        if (customerData.companyName) {
            billing['company_name'] = customerData.companyName;
        }
        
        submitOrder = {
                products: products,
                shipment: shipment,
                billing: billing,
                remarks: this.order.remarks,
                reference: 'FNV',
                type: "dropshipment",
                request_payment: "1"
        }
        
        if (discounts.length > 0) {
            submitOrder['discounts'] = discounts;
        }
        
        return this.quecomProvider.postOrder(submitOrder);
        
    }

}