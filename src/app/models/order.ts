import { OrderLine } from './order-line';

export class Order {
    
    orderLines: OrderLine[];
    remarks: string;

    constructor() {
        this.orderLines = new Array();
    }
    
}