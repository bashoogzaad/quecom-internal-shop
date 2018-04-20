import { Component, OnInit } from '@angular/core';
import { Globals } from "../providers/globals";

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.css']
})
export class OrderingComponent implements OnInit {

  constructor(
      public globals: Globals
  ) { }

  ngOnInit() {
  }

}
