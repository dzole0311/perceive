import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-media',
  templateUrl: './card-media.component.html',
  styleUrls: ['./card-media.component.scss']
})
export class CardMediaComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageSource: string = '';
  @Input() altText: string = '';

  constructor() { }
}
