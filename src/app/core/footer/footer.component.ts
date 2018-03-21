import { Globals } from '../../providers/globals';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    public globals: Globals
  ) { }

  ngOnInit() {
  }
  
  scrollTop() {
      window.scrollTo(0, 0);
  }
  
  getCurrentYear() {
      return (new Date()).getFullYear();
  }

}
