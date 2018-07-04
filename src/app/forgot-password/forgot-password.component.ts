import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Globals } from "../providers/globals";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { PimcoreProvider } from "../providers/pimcore.provider";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    
    public username: string;
    public requestPromise: Subscription;
    
    public mainErrorMsg;
    
    constructor(
        public pimcoreProvider: PimcoreProvider,
        public globals: Globals,
        public router: Router
    ) { }

    ngOnInit() {
        
        
        
    }
    
    public requestPassword(): void {
        
        this.requestPromise = this.pimcoreProvider.requestPassword(this.username).subscribe(res => {
          if (res.status === 200) {
              
              this.router.navigate(['/home']);
          } else if (res.status === 400) {
            console.log(res);
            this.mainErrorMsg = res['localized_message'] ? res['localized_message'] : res['message'];
          }       
        }, (error: any) => {
          console.log('ERROR');
        });
        
    }
      

}
