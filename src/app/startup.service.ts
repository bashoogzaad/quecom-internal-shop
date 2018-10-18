import { Injectable } from '@angular/core';
import { Globals } from './providers/globals';
import { PimcoreProvider } from './providers/pimcore.provider';

@Injectable()
export class StartupService {

  constructor(
    private globals: Globals,
    private pimcoreProvider: PimcoreProvider
  ) { }

  public load(): Promise<boolean> {

    this.globals.init();

    return this.pimcoreProvider.getMetaInfo().map(res => {
          
      console.log(res);
      
      const primaryColor = res['primary_color']['data'];
      const secondaryColor = res['secondary_color']['data'];
      document.documentElement.style.setProperty('--color-primary-var', primaryColor);
      document.documentElement.style.setProperty('--color-secondary-var', secondaryColor);
      
      if (res['theme']) {
        const theme = res['theme']['data'];
        this.globals.theme = theme;
      }
      
      if (res['shop_name']) {
        this.globals.name = res['shop_name']['data'];
      }
      
      if ('has_coupons' in res) {
        this.globals.hasCoupons = res['has_coupons']['data'] === true;
      }

      if (res['login_type']) {
        this.globals.loginType = res['login_type']['data']
      }
      
      if (res['password'] && res['login_type']  && res['login_type']['data'] === 'simple') {
        this.globals.password = res['password']['data'];
      }
      
      if ('has_delivery_cost' in res) {
        this.globals.hasDeliveryCost = res['has_delivery_cost']['data'] === true;
      }

      if (res['has_budget']) {
        this.globals.hasBudget = res['has_budget']['data'] === true;
      }

      if ('categories_on_home' in res) {
        this.globals.categoriesOnHome = res['categories_on_home']['data'] === true;
      }

      if ('pickup_amacom_allowed' in res) {
        this.globals.pickupAtAmacomAllowed = res['pickup_amacom_allowed']['data'] === true;
      }
      
    })
    .toPromise()
    .then(d => true)
    .catch(err => false);

  }

}
