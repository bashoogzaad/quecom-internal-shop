import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { LocalStorageService, LocalStorage } from "ngx-webstorage";
import { Globals } from "./providers/globals";
import { PimcoreProvider } from './providers/pimcore.provider';

@Injectable()
export class AuthService {
    
    @LocalStorage() public isLoggedIn;
    @LocalStorage() public userGuid;
    redirectUrl: string;

    constructor(
        private localStorage: LocalStorageService,
        private globals: Globals,
        private pimcoreProvider: PimcoreProvider
    ) {
        
    }
  
    saveUser(guid: string) {
      this.userGuid = guid;
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
        this.isLoggedIn = false;
        this.isLoggedIn = this.isLoggedIn;
    }
}
