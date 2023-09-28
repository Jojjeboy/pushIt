import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTallyComponent } from './upsert-tally.component';

describe('UpsertTallyComponent', () => {
  let component: UpsertTallyComponent;
  let fixture: ComponentFixture<UpsertTallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertTallyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertTallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
