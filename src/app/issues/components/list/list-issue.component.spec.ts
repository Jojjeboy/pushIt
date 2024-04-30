import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIssuesComponent } from './list-issue.component';

describe('ListComponent', () => {
  let component: ListIssuesComponent;
  let fixture: ComponentFixture<ListIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListIssuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
