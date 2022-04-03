import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeMemoryComponent } from './free-memory.component';
import {CardMediaComponent} from "../card-media/card-media.component";

describe('FreeMemoryComponent', () => {
  let component: FreeMemoryComponent;
  let fixture: ComponentFixture<FreeMemoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeMemoryComponent, CardMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeMemoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
