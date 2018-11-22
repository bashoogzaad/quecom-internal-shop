import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Subscription } from 'rxjs/Subscription';

import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { Order } from "../models/order";
import { OrderLine } from "../models/order-line";
import { CustomerData } from "../models/customer-data";
import { QuecomProvider } from "./quecom.provider";
import { Globals } from './globals';
import { UserSuccessComponent } from '../user-success/user-success.component';

@Injectable()
export class CartProvider {
    
    //Global variables
    @LocalStorage() public order: Order;
    
    constructor(
        private localStorage: LocalStorageService,
        public quecomProvider: QuecomProvider,
        public globals: Globals,
        public authService: AuthService
    ) {}
    
    getCurrentOrder(): any {
        return this.order;
    }
  
    addOrderLine(orderLine: OrderLine): void {
        let push = true;
        this.order.orderLines.forEach((ol) => {
          if(ol.product.id === orderLine.product.id) {
            this.adjustOrderLine(ol, 1);
            push = false;
          }
        });

        if(push) {
          this.order.orderLines.push(orderLine);
          this.order = this.order;
        }
    }

    adjustOrderLine(orderLine: OrderLine, amount: number): void {
        orderLine.count += amount;
        this.order = this.order;
    }
    
    removeOrderLine(orderLine: OrderLine): void {
        this.order.orderLines.splice(this.order.orderLines.indexOf(orderLine), 1);
      this.order = this.order;

    }
    
    resetCart(): void {
        this.order = new Order();
    }

    placeOrder(customerData: CustomerData, discounts?: any[], selectedShipment?: any, paymentMethod?: any, id?: any, shippingMethod?: any): Observable<any> {
        return this.doPlaceOrder(customerData, discounts, selectedShipment, paymentMethod, id, shippingMethod);
    }

    doPlaceOrder(customerData: CustomerData, discounts?: any[], selectedShipment?: any, paymentMethod?: any, id?: any, shippingMethod?: any): Observable<any> {

        let submitOrder;

        const products = [];
        for (const orderLine of this.order.orderLines) {
          const productEntry = {
            product_id: orderLine.product.product_id,
            amount: orderLine.count
          }

          products.push(productEntry);
        }
        
        const billing: Object = new Object();
        billing['first_name'] = customerData.firstNameSh;
        billing['last_name'] = customerData.lastNameSh;
        billing['street'] = customerData.addressSh;
        billing['house_number'] = customerData.houseNumberSh;
        billing['house_number_extension'] = customerData.houseNumberExtensionSh;
        billing['city'] = customerData.citySh;
        
        if (customerData.postalCodeSh !== undefined && customerData.postalCodeSh.length === 6) {
            customerData.postalCodeSh = customerData.postalCodeSh.substr(0, 4)+' '+customerData.postalCodeSh.substr(4, 2);
        }
        
        billing['postal_code'] = customerData.postalCodeSh;
        billing['country'] = 'NL';
        billing['phone_number'] = customerData.phoneNumberSh;
        billing['email'] = customerData.emailAddressSh;
        
        if (customerData.companyName) {
            billing['company_name'] = customerData.companyName;
        }
        
        const shipment: Object = new Object();
        shipment['gender'] = customerData.gender;
        shipment['first_name'] = customerData.firstName;
        shipment['last_name'] = customerData.lastName;
        shipment['street'] = customerData.address;
        shipment['house_number'] = customerData.houseNumber;
        shipment['house_number_extension'] = customerData.houseNumberExtension;
        shipment['city'] = customerData.city;

        if (customerData.postalCode !== undefined && customerData.postalCode.length === 6) {
            customerData.postalCode = customerData.postalCode.substr(0, 4)+' '+customerData.postalCode.substr(4, 2);
        }
        
        shipment['postal_code'] = customerData.postalCode;
        shipment['country'] = 'NL';
        shipment['phone_number'] = customerData.phoneNumber;
        shipment['email'] = customerData.emailAddress;
        
        let reference = this.globals.name;

        submitOrder = {
            products: products,
            shipment: shipment,
            billing: billing,
            remarks: this.order.remarks,
            reference: reference+'-'+id,
            type: 'dropshipment',
            request_payment: '1',
            calculate_shipping_cost: '0',
            ecommerce_user_id: id
        };
        
        if (discounts.length > 0) {
            submitOrder['discounts'] = discounts;
        }
      
        if (selectedShipment) {
            submitOrder['selected_shipment'] = selectedShipment;
        }
      
        if (paymentMethod) {
            submitOrder['payment_method'] = paymentMethod;
        }
      
        if (shippingMethod && shippingMethod == 'pickup') {
            submitOrder['route'] = 'ZAFH01';
        }

        return this.quecomProvider.postOrder(submitOrder);

    }

}
