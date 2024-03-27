import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitlogComponent } from './gitlog.component';

describe('GitlogComponent', () => {
  let component: GitlogComponent;
  let fixture: ComponentFixture<GitlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GitlogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GitlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
