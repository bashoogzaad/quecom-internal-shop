import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { LocalStorageService, LocalStorage } from "ngx-webstorage";
import { Globals } from "./providers/globals";

@Injectable()
export class AuthService {
    
    @LocalStorage() public isLoggedIn;
    redirectUrl: string;

    constructor(
        private localStorage: LocalStorageService,
        private globals: Globals
    ) {
        
    }
    
    login(checkPass: string): boolean {
        let pass = this.globals.password;
        let passed: boolean = (pass === checkPass);
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
