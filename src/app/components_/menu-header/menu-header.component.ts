import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
  animations: []
})
export class MenuHeaderComponent implements OnInit {
  showlogo: boolean = true;
  optionSelected: number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }

}
