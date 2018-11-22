import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Globals } from './providers/globals';

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(
        private authService: AuthService, 
        private router: Router,
        private globals: Globals
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        
        if (this.globals.loginType === 'none') {
            return true;
        }

        if (this.globals.loginType === 'code') {
            return this.checkCoupon();
        }
        
        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {

        if (this.authService.isLoggedIn && this.authService.hasAcceptedPrivacyPolicy) { 
            return true; 
        } else if (this.authService.isLoggedIn && !this.authService.hasAcceptedPrivacyPolicy) {
            
            // Store the attempted URL for redirecting
            this.authService.redirectUrl = url;

            // Navigate to the login page with extras
            this.router.navigate(['/privacy-policy']);
            return false;
            
        } else if (!this.authService.isLoggedIn) {
            
            // Store the attempted URL for redirecting
            this.authService.redirectUrl = url;

            // Navigate to the login page with extras
            if (this.globals.loginType === 'none') {
                this.router.navigate(['/registreren']);
            } else {
                this.router.navigate(['/inloggen']);
            }

            return false;
            
        }

    }

    checkCoupon() {
      if (!this.authService.couponAccess) {
        this.router.navigate(['/coupon']);
        return false;
      }

      return true;
    }
}
