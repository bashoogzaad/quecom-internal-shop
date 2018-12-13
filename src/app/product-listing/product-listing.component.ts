import { Component, OnInit } from '@angular/core';
import { QuecomProvider } from "../providers/quecom.provider";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorage } from "ngx-webstorage";
import { CartProvider } from "../providers/cart.provider";
import { OrderLine } from "../models/order-line";
import { Globals } from '../providers/globals';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-product-listing',
    templateUrl: './product-listing.component.html',
    styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {

    public defaultImage = 'assets/images/default.jpg';
    
    public unparsedType: string;
    public groupId: any;
    public typeObject: any;
    public isSearch = false;
    
    public limit = 25;
    public page = 1;
    public pageNumbers: number[];
    
    public products: any[] = new Array();
    public pagination: any;
    public groupMap: Map<string, string> = new Map<string, string>();

    public type: string;

    constructor(
        public route: ActivatedRoute,
        public quecomProvider: QuecomProvider,
        public router: Router,
        public cartProvider: CartProvider,
        public globals: Globals
    ) { }

    ngOnInit() {
        
        this.groupMap.set('categorie', 'category');
        this.groupMap.set('subcategorie', 'subcategory');
        this.groupMap.set('product-groep', 'product_group');
        
        this.route.paramMap.subscribe(params => {

            this.globals.loadingOn();

            if (params.get("query") !== null) {

                this.isSearch = true;
                this.loadSearchProducts(params.get("query"));

            } else {

                this.globals.loadingOn();

                if (this.router.url.split("/")[1].indexOf('producten') === -1) {
            
                    this.setType('categories');

                    this.unparsedType = this.router.url.split("/")[1];
                    const type = this.groupMap.get(this.unparsedType);
                    this.groupId = params.get('id');
                    
                    this.quecomProvider.getCategories().subscribe(res => {
                    
                        if (this.unparsedType === 'categorie') {

                            this.typeObject =  res['categories'].find(c => c.id === this.groupId);
                            this.typeObject['main_name'] = this.typeObject['name'];
                            this.typeObject['parsed'] = this.typeObject['name'].replace(/[& ]/g, '');

                        } else if (this.unparsedType === 'subcategorie') {
                            
                            for (let cat of res['categories']) {
                                for (let subcat of cat.subcategories) {
                                    subcat['cat_name'] = cat['name'];
                                } 
                            }
                            
                            this.typeObject =  res['categories'].reduce((a, b) => a.concat(b.subcategories), []).find(c => c.id === this.groupId);
                            this.typeObject['main_name'] = this.typeObject['cat_name'];
                            this.typeObject['parsed'] = this.typeObject['cat_name'].replace(/[& ]/g,'');
                        }
                        
                    });
                
                    this.route.queryParams.subscribe(qp => {
                        this.globals.loadingOn();
                        this.page = qp['page'] ? Number.parseInt(qp['page']) : 1;
                        this.loadProducts(type);
                    });
            
                } else {

                    this.setType('product-only');

                    this.route.queryParams.subscribe(qp => {
                        this.globals.loadingOn();
                        this.page = qp['page'] ? Number.parseInt(qp['page']) : 1;
                        this.loadProducts();
                    });

                }

            } 

        });
        
    }

    public setType(type: string) {
        this.type = type;
    }
    
    public fillArrayWithNumbers(n) {
        const arr = Array.apply(null, Array(n));
        return arr.map(function (x, i) { return i+1 });
    }
    
    public loadProducts(type?: string) {
        if (type) {
          
            this.quecomProvider.getProductsPerGroup(type, this.groupId, this.limit, this.page).subscribe(res => {
                this.products = this.filterProduct(res.products);
                this.pagination = res.pagination;
                this.pageNumbers = this.fillArrayWithNumbers(this.pagination.number_of_pages);
                this.globals.loadingOff();
            });
        
        } else {
            
            this.quecomProvider.getProducts(this.limit, this.page).subscribe(res => {
                this.products = this.filterProduct(res.products);
                this.pagination = res.pagination;
                this.pageNumbers = this.fillArrayWithNumbers(this.pagination.number_of_pages);
            });
        }
    }

    private filterProduct(products) {
      let prds = [];

      products.forEach((elm, id) => {
        if(elm.id !== '1475240'){
          prds.push(elm);
        }
      });

      let productsToAdd = new Array();
      let obs = new Array();
      products.forEach(pr => {

        const id = pr.product_id;

        if (pr.variations && pr.variations.length > 1) {
            pr.variations.forEach(vr => {
                if (vr.product_id != id) {
                    let ob = this.quecomProvider.getProduct(vr.product_id).map(r => {
                        productsToAdd.push(r);
                    });
                    obs.push(ob);
                }
            });
        }

      });

      if (obs.length === 0) {
          this.globals.loadingOff();
          return prds;
      }

      Observable.forkJoin(obs).subscribe(res => {
        productsToAdd.forEach(r => {
            prds.push(r);
        });
        prds.sort((a, b) => {
            return a.product_id.localeCompare(b.product_id);
        });
        this.globals.loadingOff();
      });


      return prds;

    }

    public loadSearchProducts(sq: string) {
        this.quecomProvider.getSearchResults(sq, true).subscribe(res => {
            this.products = this.filterProduct(res.products);
            this.pageNumbers = [1];
            this.pagination = 1
            this.globals.loadingOff();
        });
    }
    
    public getImageUrl(product: any) {
        if (product.image_url) {
            return product.image_url;
        } else {
            return this.defaultImage;
        }
    }
    
    public addToCart(product: any) {
        product.image_urls = product.image_urls ? product.image_urls : [];
        product.image_urls.push(product.image_url);
        
        if (product.additional_image_urls) {
            for (let img of product.additional_image_urls) {
              product.image_urls.push(img);
            }              
        }

        const orderLine = new OrderLine();
        orderLine.count = 1;
        orderLine.subtotal = orderLine.count*product.price_total_netto*1.21;
        orderLine.product = product;
        this.cartProvider.addOrderLine(orderLine);
        
        this.router.navigateByUrl('/winkelwagen');
    }

}
