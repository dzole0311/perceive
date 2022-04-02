import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-free-memory',
  templateUrl: './free-memory.component.html',
  styleUrls: ['./free-memory.component.scss']
})
export class FreeMemoryComponent {
  @Input() memory: string = '';

  constructor() { }

}
