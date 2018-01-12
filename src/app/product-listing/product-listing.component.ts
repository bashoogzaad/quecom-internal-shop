import { Component, OnInit } from '@angular/core';
import { QuecomProvider } from "../providers/quecom.provider";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorage } from "ngx-webstorage";
import { OrderLine } from "../models/order-line";
import { CartProvider } from "../providers/cart.provider";

@Component({
    selector: 'app-product-listing',
    templateUrl: './product-listing.component.html',
    styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {

    public defaultImage: string = 'assets/images/default.jpg';
    
    public unparsedType: string;
    public groupId: any;
    
    public limit: number = 12;
    public page: number = 1;
    public pageNumbers: number[];
    
    public products: any[] = new Array();
    public pagination: any;
    public groupMap: Map<string, string> = new Map<string, string>();

    constructor(
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        public router: Router,
        public cartProvider: CartProvider
    ) { }

    ngOnInit() {
        
        this.groupMap.set('categorie', 'category');
        this.groupMap.set('subcategorie', 'subcategory');
        this.groupMap.set('product-groep', 'product_group');
        
        this.route.paramMap.subscribe(params => {
            
            if (this.router.url.split("/")[1] !== 'producten') {
            
                this.unparsedType = this.router.url.split("/")[1];
                let type = this.groupMap.get(this.unparsedType);
                this.groupId = params.get('id');
                
                this.route.queryParams.subscribe(qp => {
                    this.page = qp['page'] ? Number.parseInt(qp['page']) : 1;
                    this.loadProducts(type);
                });
            
            } else {
                this.route.queryParams.subscribe(qp => {
                    this.page = qp['page'] ? Number.parseInt(qp['page']) : 1;
                    this.loadProducts();
                });
            }
            
        });
        
    }
    
    public fillArrayWithNumbers(n) {
        var arr = Array.apply(null, Array(n));
        return arr.map(function (x, i) { return i+1 });
    }
    
    public loadProducts(type?: string) {
        
        if (type) {
        
            this.quecomProvider.getProductsPerGroup(type, this.groupId, this.limit, this.page).subscribe(res => {
                this.products = res.products;
                this.pagination = res.pagination;
                this.pageNumbers = this.fillArrayWithNumbers(this.pagination.number_of_pages);
            });
        
        } else {
            
            this.quecomProvider.getProducts(this.limit, this.page).subscribe(res => {
                this.products = res.products;
                this.pagination = res.pagination;
                this.pageNumbers = this.fillArrayWithNumbers(this.pagination.number_of_pages);
            });
            
        }
        
    }
    
    public getImageUrl(product: any) {
        if (product.image_url) {
            return product.image_url;
        } else {
            return this.defaultImage;
        }
    }
    
    public addToCart(product: any) {
        
        let orderLine = new OrderLine();
        orderLine.count = Number(product.minimum_order_quantity);
        orderLine.subtotal = orderLine.count*product.price_total_netto*1.21;
        orderLine.product = product;
        this.cartProvider.addOrderLine(orderLine);
        
        this.router.navigateByUrl('/winkelwagen');
    }

}
