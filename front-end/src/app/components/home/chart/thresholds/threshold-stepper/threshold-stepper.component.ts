import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {STEPS} from "../../../../../constants/constants";

interface action {
  option: '',
  value: 0
}

@Component({
  selector: 'app-threshold-stepper',
  templateUrl: './threshold-stepper.component.html',
  styleUrls: ['./threshold-stepper.component.scss']
})
export class ThresholdStepperComponent implements OnInit {
  @Input() value: number;
  @Input() label: string;
  @Input() steps: number = STEPS;
  @Input() upperLimit: number = 100;
  @Input() lowerLimit: number = 0;
  @Input() unit: string;
  @Output() onThresholdChange = new EventEmitter<{}>();

  constructor() { }

  ngOnInit(): void {
  }

  onIncrementButtonClick() {
    if (this.value + this.steps > this.upperLimit) return;

    this.onThresholdChange.emit({option: this.label, value: this.value + this.steps});
  }

  onDecrementButtonClick() {
    if (this.value - this.steps <= this.lowerLimit) return;

    this.onThresholdChange.emit({option: this.label, value: this.value - this.steps});
  }
}
