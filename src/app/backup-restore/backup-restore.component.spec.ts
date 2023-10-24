import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupRestoreComponent } from './backup-restore.component';

describe('BackupRestoreComponent', () => {
  let component: BackupRestoreComponent;
  let fixture: ComponentFixture<BackupRestoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackupRestoreComponent]
    });
    fixture = TestBed.createComponent(BackupRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
