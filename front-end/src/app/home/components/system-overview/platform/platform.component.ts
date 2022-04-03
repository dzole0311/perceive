import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent {
  @Input() platform: string = '';

  constructor() { }
}
