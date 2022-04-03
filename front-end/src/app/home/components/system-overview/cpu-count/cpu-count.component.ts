import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cpu-count',
  templateUrl: './cpu-count.component.html',
  styleUrls: ['./cpu-count.component.scss']
})
export class CpuCountComponent {
  @Input() cpuCount: number = 0;

  constructor() { }
}
