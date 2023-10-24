import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-backup',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.scss']
})
export class BackupRestoreComponent {


  lastBackupFetched: boolean = false;
  backupTalliesModalData: Object = {};
  restoreTalliesModalData: Object = {};


  backup(): void {
    this.backupTalliesModalData = {
      open: true,
      header: 'Säkerhetskopiera',
      body: 'Är du säker på att du vill säkerhetskopiera all Local Storage',
    }
  }

  restore(): void {
    this.restoreTalliesModalData = {
      open: true,
      header: 'Återställ',
      body: 'Är du säker på att du vill återställa all data från server',
    }
  }

  backupTalliesConfirmed(): void {
    
    this.backupTalliesModalData = { open: false };
    console.log('make http PUT request');
     
   }


   restoreTalliesConfirmed(): void {
    
     console.log('make http GET request');
     this.restoreTalliesModalData = { open: false };

   }
}
