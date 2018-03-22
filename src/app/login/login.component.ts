import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Globals } from '../providers/globals';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public pass: string;
  
    public username: string;
    public password: string;
    public loginPromise: Subscription;
    
    constructor(
        public authService: AuthService,
        public globals: Globals,
        public router: Router
    ) {
        if (this.authService.isLoggedIn) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        
    }
    
    loginServer() {
      this.loginPromise = this.authService.loginServer(this.username, this.password).subscribe(res => {
        if (res.status === 200) {
          console.log(res);
          this.authService.saveUser(res.user);
          this.router.navigate(['/home']);
        } else if (res.status === 400) {
          
        }       
      }, (error: any) => {
        console.log('ERROR');
      });
    }
    
    login() {
        
        const loggedIn = this.authService.login(this.pass);
        if (loggedIn) {
            this.router.navigate(['/home']);
        } else {
            console.log('Pass incorrect');
        }
        
        this.pass = '';
        
    }

}
