import { Component, OnInit } from '@angular/core';
import { faChartArea } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public faChart = faChartArea;

  constructor() { }

  ngOnInit(): void {
  }

}
