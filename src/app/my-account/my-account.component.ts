import { AuthService } from '../auth.service';
import { Globals } from '../providers/globals';
import { PimcoreProvider } from '../providers/pimcore.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  public current = 'dashboard';
  public user: any;
  public budget: any;
  public showBudget = false;
  
  constructor(
    public globals: Globals,
    public authService: AuthService,
    public pimcoreProvider: PimcoreProvider
  ) {
    
  }

  ngOnInit() {
    this.user = this.authService.user;
    this.pimcoreProvider.getBudget(this.user.id, this.user.hash).subscribe(res => {
      this.budget = res;
    });
  }

}
