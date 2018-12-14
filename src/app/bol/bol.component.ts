import { Component, OnInit } from '@angular/core';
import {Globals} from "../providers/globals";

@Component({
  selector: 'app-bol',
  templateUrl: './bol.component.html',
  styleUrls: ['./bol.component.scss']
})
export class BolComponent implements OnInit {

  constructor(public globals: Globals) { }

  ngOnInit() {
  }

}
