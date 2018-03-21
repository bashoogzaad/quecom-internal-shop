import { AuthService } from '../auth.service';
import { Globals } from '../providers/globals';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public user: any = new Object();
  public registerPromise: Subscription;
  
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
  
  doRegister() {
    
    this.registerPromise = this.authService.register(this.user).subscribe(res => {
      console.log(res);
    });
    
  }

}
