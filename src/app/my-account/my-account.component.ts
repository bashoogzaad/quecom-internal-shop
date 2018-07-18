import { AuthService } from '../auth.service';
import { Globals } from '../providers/globals';
import { PimcoreProvider } from '../providers/pimcore.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  public current = 'dashboard';
  public user: any;
  public budget: any;
  public showBudget = false;
  
  public orders: any;
  public invoices: any;
  public currentOrder;

  public oldPass: string;
  public newPass1: string;
  public newPass2: string;
  
  constructor(
    public globals: Globals,
    public authService: AuthService,
    public pimcoreProvider: PimcoreProvider
  ) {
    
  }

  ngOnInit() {

    this.globals.initDone.subscribe(r => {
  
      let shopName = this.globals.name;

      this.user = this.authService.user;
      this.pimcoreProvider.getBudget(this.user.id, this.user.hash).subscribe(res => {
        this.budget = res;
      });

      this.pimcoreProvider.getOrders(this.user.id, this.user.hash, shopName).subscribe(res => {
        this.orders = res['quecom_order'].filter(o => o['reference'].includes('GV'));
      });
      
      this.pimcoreProvider.getInvoices(this.user.id, this.user.hash, shopName).subscribe(res => {
        this.invoices = res;
      });
    
    });
    
  }
  
  public selectOrder(order) {
      this.currentOrder = order;
  }

  public updateUser() {

    let arr = {
      username: this.user.username,
      postal_code: this.user.postal_code,
      house_number: this.user.house_number,
      house_number_extension: this.user.house_number_extension,
      street: this.user.street,
      city: this.user.city,
      country: this.user.country
    };

    if (this.oldPass) {
      arr['old_pass'] = this.oldPass;
      arr['new_pass_1'] = this.newPass1;
      arr['new_pass_2'] = this.newPass2;
    }

    this.pimcoreProvider.updateUser(arr, this.user.id, this.user.hash).subscribe(r => {
      this.authService.user = this.user;
      this.oldPass = undefined;
      this.newPass1 = undefined;
      this.newPass2 = undefined;
    });
    
  }



}
