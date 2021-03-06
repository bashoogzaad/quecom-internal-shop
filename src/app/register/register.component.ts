import { AuthService } from '../auth.service';
import { Globals } from '../providers/globals';
import { PimcoreProvider } from '../providers/pimcore.provider';
import { QuecomProvider } from '../providers/quecom.provider';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public user: any = new Object();
  public registerPromise: Subscription;
  
  public organizations: any;
  
  public postalCodeControl = new FormControl();
  public houseNumberControl = new FormControl();
  public houseNumberExtControl = new FormControl();
  
  public successMsg;
  public errorMsg;
  public mainErrorMsg;
  
  constructor(
    public authService: AuthService,
    public globals: Globals,
    public router: Router,
    public quecomProvider: QuecomProvider,
    public pimcoreProvider: PimcoreProvider
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    
    this.pimcoreProvider.getOrganizations().subscribe(org => {
      this.organizations = org;
    });
    
    this.postalCodeControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(newVal => this.checkAddress(newVal));
    this.houseNumberControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(newVal => this.checkAddress(newVal));
    this.houseNumberExtControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(newVal => this.checkAddress(newVal));
    
  }
  
  doRegister() {
    
    this.registerPromise = this.authService.register(this.user).subscribe(res => {
      console.log(res);
      
      if (res['status'] && res['status'] == 200) {
          this.router.navigate(['/registreren/succesvol']);
      }
      
      if (res['status'] && res['status'] == 400) {
          this.mainErrorMsg = res['localized_message'];
      }
      
    }, (error) => {
        console.log(error);
    });
    
  }
  
  public checkAddress(newVal: string) {
    
    if (!this.user.postal_code || !this.user.house_number) {
      return;
    }
    
    if (this.user.country == 'BE') {
        return;
    }
    
    if (this.user.postal_code.length < 6) {
            
        this.user.street = '';
        this.user.city = '';
        
        return;
    }
    
    this.quecomProvider.checkAddress(this.user.house_number, this.user.postal_code, this.user.house_number_extension).subscribe(i => {
      console.log(i);  
      
      if (i.error) {
          
          this.user.street = '';
          this.user.city = '';
          
          this.errorMsg = 'Adres niet gevonden. Controleer de gegevens a.u.b.';
          this.successMsg = '';
          
      } else {
          
          this.user.street = i.street;
          this.user.city = i.city;
          this.user.country = "NL";
          
          this.errorMsg = '';
          this.successMsg = 'Straat en woonplaats gevalideerd';
          
      }
      
    });
    
  }
  
  public checkFields() {
      
      if (
          this.user.organization &&
          this.user.username &&
          this.user.password &&
          this.user.password2 &&
          this.user.password == this.user.password2 &&
          this.user.gender &&
          this.user.first_name &&
          this.user.last_name &&
          this.user.postal_code &&
          this.user.house_number &&
          this.user.street &&
          this.user.city &&
          this.user.country
      ) {
          return true;
      } else {
          return false;
      }
      
  }

}
