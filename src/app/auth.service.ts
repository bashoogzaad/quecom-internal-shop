import { environment } from '../environments/environment';
import { CartProvider } from './providers/cart.provider';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { LocalStorageService, LocalStorage } from "ngx-webstorage";
import { Globals } from "./providers/globals";
import { PimcoreProvider } from './providers/pimcore.provider';
import {QuecomProvider} from "./providers/quecom.provider";

@Injectable()
export class AuthService {
    
    @LocalStorage(environment.debtorNumber+'-storage') public isLoggedIn;
    @LocalStorage(environment.debtorNumber+'-privacy') public hasAcceptedPrivacyPolicy;
    @LocalStorage() public user;
    @LocalStorage(environment.debtorNumber+'-cpn') public couponAccess;
    redirectUrl: string;

    constructor(
        private localStorage: LocalStorageService,
        private globals: Globals,
        private pimcoreProvider: PimcoreProvider,
        private quecomProvider: QuecomProvider
    ) {
        
    }
  
    acceptPrivacyPolicy(){
        this.hasAcceptedPrivacyPolicy = true;
    }
    
    saveUser(guid: string) {
      this.user = guid;
      this.isLoggedIn = true;
    }
  
    register(user: any) {
      return this.pimcoreProvider.register(user);
    }
  
    loginServer(username: string, password: string) {
      return this.pimcoreProvider.login(username, password);
    }
   
    
    login(checkPass: string): boolean {
        const pass = this.globals.password;
        const passed: boolean = (pass === checkPass);
        this.isLoggedIn = passed;
        
        if (passed) {
            this.isLoggedIn = this.isLoggedIn;
        }
        return passed;
    }

    logout(): void {
        // this.cartProvider.resetCart();      
        this.isLoggedIn = false;
        this.user = undefined;
        this.isLoggedIn = this.isLoggedIn;
    }
    
}
