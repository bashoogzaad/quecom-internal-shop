import { Component, OnInit } from '@angular/core';
import { Globals } from "../providers/globals";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
          public globals: Globals,
          public authService: AuthService,
          public router: Router
  ) { }

  ngOnInit() {
  }
  
  accept(){
      this.authService.acceptPrivacyPolicy();
      this.router.navigate(['/home']);
  }

}
