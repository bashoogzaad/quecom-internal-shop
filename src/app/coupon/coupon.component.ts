import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Globals} from "../providers/globals";
import {Router} from "@angular/router";
import {QuecomProvider} from "../providers/quecom.provider";

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public globals: Globals,
    public router: Router,
    private provider: QuecomProvider,
  ) { }

  public imageUrlArray: any;
  public code: string;
  public invalidcoupon: boolean;

  ngOnInit() {
    if (this.globals.loginType !== 'code') {
      this.router.navigate(['/home']);
    }

    this.invalidcoupon = false;

    this.imageUrlArray = ['assets/templates/mogo/images/slider/01/slide-01.jpg'];
  }

  checkCode(event) {
    this.invalidcoupon = false;

    const code = event.srcElement.querySelector('input[name="code"]').value;

    this.provider.checkCouponCode(code).subscribe(res => {
      if (res.status === undefined) {
        this.authService.couponAccess = code;
        this.router.navigate(['/producten']);
      } else {
        this.invalidcoupon = true;
        return false;
      }
    });
  }
}
