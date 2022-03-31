import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdStepperComponent } from './threshold-stepper.component';

describe('ThresholdStepperComponent', () => {
  let component: ThresholdStepperComponent;
  let fixture: ComponentFixture<ThresholdStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThresholdStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
