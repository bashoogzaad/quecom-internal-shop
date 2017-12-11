import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { LocalStorageService, LocalStorage } from "ngx-webstorage";

@Injectable()
export class AuthService {
    
    @LocalStorage() public isLoggedIn;
    redirectUrl: string;

    constructor(
        private localStorage: LocalStorageService,
    ) {
        
    }
    
    login(checkPass: string): boolean {
        let pass = 'AMADEC2017';
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
