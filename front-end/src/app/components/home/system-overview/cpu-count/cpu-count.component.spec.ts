import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuCountComponent } from './cpu-count.component';

describe('CpuCountComponent', () => {
  let component: CpuCountComponent;
  let fixture: ComponentFixture<CpuCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpuCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
