import { Component, OnInit } from '@angular/core';
import { Globals } from "../providers/globals";

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss']
})
export class RegisterSuccessComponent implements OnInit {

  constructor(
      public globals: Globals
  ) { }

  ngOnInit() {
      
  }

}
