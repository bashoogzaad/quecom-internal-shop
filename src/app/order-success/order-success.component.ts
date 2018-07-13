import { Component, OnInit } from '@angular/core';
import { Globals } from '../providers/globals';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

  constructor(
    public globals: Globals
  ) { }

  ngOnInit() {
  }

}
