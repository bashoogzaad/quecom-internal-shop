import { Component, OnInit } from '@angular/core';
import { Globals } from "../providers/globals";

@Component({
  selector: 'app-mail-succesfull',
  templateUrl: './mail-succesfull.component.html',
  styleUrls: ['./mail-succesfull.component.scss']
})
export class MailSuccesfullComponent implements OnInit {

  constructor(
      public globals: Globals       
  ) { }

  ngOnInit() {
  }

}
