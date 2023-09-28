import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTallyHistoryComponent } from './edit-tally-history.component';

describe('EditTallyHistoryComponent', () => {
  let component: EditTallyHistoryComponent;
  let fixture: ComponentFixture<EditTallyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTallyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTallyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
