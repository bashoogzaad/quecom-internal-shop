import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Globals } from "../providers/globals";
import { Router } from "@angular/router";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

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

}
