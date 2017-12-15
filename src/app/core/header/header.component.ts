import { Component, OnInit } from '@angular/core';
import { LocalStorageService, LocalStorage } from "ngx-webstorage";
import { Order } from "../../models/order";
import { QuecomProvider } from "../../providers/quecom.provider";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public forceHideMenu: boolean = false;
    
    @LocalStorage() public order: Order;
    public toggleMenu: boolean = false;
    public toggleCustomerService: boolean = false;
    
    public useCategories: boolean = true;
    public categories: any[];
    
    constructor(
        public localStorage: LocalStorageService,
        public quecomProvider: QuecomProvider,
        public router: Router,
        public authService: AuthService
    ) { }

    ngOnInit() {
        
        if (this.useCategories) {
            this.quecomProvider.getCategories().subscribe(res => {
                this.categories = res['categories'];
            });
        }
        
        if (this.localStorage.retrieve('order') === null) {
            this.localStorage.store('order', new Order());
        }
    
    }
    
    count(): number {
        let count: number = 0;
        this.order.orderLines.forEach(ol => count += ol.count);
        return count;
    }
    
    goToPage(type: string, id: number, isMobile?: boolean) {
        this.forceHideMenu = true;
        if (isMobile) {
            this.toggleMenu = !this.toggleMenu;
        }
        this.router.navigate(['/'+type, id]);
    }
    
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}
