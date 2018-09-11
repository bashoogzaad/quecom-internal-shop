import { Component, OnInit, HostListener } from '@angular/core';
import { LocalStorageService, LocalStorage } from "ngx-webstorage";
import { Order } from "../../models/order";
import { QuecomProvider } from "../../providers/quecom.provider";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";
import { CartProvider } from '../../providers/cart.provider';
import { Globals } from "../../providers/globals";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public scrolledY: boolean = false;
  public forceHideMenu: boolean = false;

  @LocalStorage() public order: Order;
  public toggleMenu: boolean = false;
  public toggleCustomerService: boolean = false;

  public useCategories: boolean = true;
  public categories: any[];

  public showUser = false;
  public showMenuu = false;

  public searchResults = [];
  public searchFocus = false;

  private bubble;

  constructor(
    public localStorage: LocalStorageService,
    public quecomProvider: QuecomProvider,
    public router: Router,
    public authService: AuthService,
    public globals: Globals,
    public cartProvider: CartProvider
  ) { }

  @HostListener('window:scroll', ['$event'])
  doSomething(event) {
    this.scrolledY = window.pageYOffset > 0;
  }

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
    let count = 0;
    this.order.orderLines.forEach(ol => count += ol.count);
    return count;
  }

  goToDefaultPage(type: string) {
    this.forceHideMenu = true;
    this.showMenuu = false;
    this.showUser = false;
    this.router.navigate(['/'+type]);
  }

  goToPage(type: string, id: number, isMobile?: boolean) {
    this.forceHideMenu = true;
    if (isMobile) {
      this.toggleMenu = !this.toggleMenu;
    }
    this.router.navigate(['/'+type, id]);
  }

  logout() {
    this.forceHideMenu = true;
    this.authService.logout();
    this.router.navigate(['/inloggen']);
  }

  goToSearchPage(event: Event) {
    event.preventDefault();
    let sq = (<HTMLInputElement>document.querySelector('.custom-search')).value.trim();

    if(sq !== ''){
      this.blur();
      this.router.navigate(['/search', sq.toLowerCase()]);
    }
  }

  liveSearch(evnt: any) {
    clearTimeout(this.bubble);

    let keyMap = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40];

    if(keyMap.indexOf(evnt.keyCode) > 0) {
      return;
    }

    this.bubble = setTimeout(()=> {
      this.quecomProvider.getSearchResults(evnt.srcElement.value.trim()).subscribe(res => {
        this.searchResults = res;
      });
    }, 300);
  }

  clearSearchAndGoToProduct(productId) {
    this.clearSearch();
    this.router.navigate(['/product', productId]);
  }

  clearSearch() {
    this.searchResults = [];
    this.searchFocus = false;
    let form: HTMLInputElement = document.querySelector('.custom-search');
    form.value = '';
    form.blur();
  }

  blur() {
    setTimeout(() => {
      this.searchFocus = false;
      this.clearSearch();
    }, 200);
  }

  getCartCount() {
    return this.cartProvider.getCurrentOrder().orderLines ? this.cartProvider.getCurrentOrder().orderLines.length : 0;
  }

}
