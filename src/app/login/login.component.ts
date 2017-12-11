import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public pass: string;
    
    constructor(
        public authService: AuthService,
        public router: Router
    ) {
        if (this.authService.isLoggedIn) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        
    }
    
    login() {
        
        let loggedIn = this.authService.login(this.pass);
        if (loggedIn) {
            this.router.navigate(['/home']);
        } else {
            console.log('Pass incorrect');
        }
        
        this.pass = '';
        
    }

}
