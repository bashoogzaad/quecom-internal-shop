import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
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
            this.router.navigate(['/inloggen']);
            return false;
            
        }

    }
}
