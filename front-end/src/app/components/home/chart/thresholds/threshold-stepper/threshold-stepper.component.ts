import {Component, EventEmitter, Input, Output} from '@angular/core';
import {STEPS} from '../../../../../constants/constants';

@Component({
  selector: 'app-threshold-stepper',
  templateUrl: './threshold-stepper.component.html',
  styleUrls: ['./threshold-stepper.component.scss']
})
export class ThresholdStepperComponent {
  @Input() value: number;
  @Input() label: string;
  @Input() steps: number = STEPS;
  @Input() upperLimit: number = 100;
  @Input() lowerLimit: number = 0;
  @Input() unit: string;
  @Output() onThresholdChange = new EventEmitter<{}>();

  constructor() { }

  onIncrementButtonClick() {
    // Only increment if the next value is less than the upper limit
    if (this.value + this.steps > this.upperLimit) return;
    this.onThresholdChange.emit({name: this.label, value: this.value + this.steps});
  }

  onDecrementButtonClick() {
    // Only decrement if the next value is bigger than or equal to the lower limit
    if (this.value - this.steps <= this.lowerLimit) return;
    this.onThresholdChange.emit({name: this.label, value: this.value - this.steps});
  }
}
