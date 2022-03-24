import { Component, OnInit } from '@angular/core';
import { faChartArea } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public faChart = faChartArea;

  constructor() { }

  ngOnInit(): void {
  }

}
