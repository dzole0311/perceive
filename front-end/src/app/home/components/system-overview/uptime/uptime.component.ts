import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-uptime',
  templateUrl: './uptime.component.html',
  styleUrls: ['./uptime.component.scss']
})
export class UptimeComponent {
  @Input() upTime: string = '';

  constructor() { }

}
