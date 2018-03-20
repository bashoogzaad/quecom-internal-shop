import { AuthService } from '../auth.service';
import { Globals } from '../providers/globals';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
  
  register() {
    
    
    
  }

}
