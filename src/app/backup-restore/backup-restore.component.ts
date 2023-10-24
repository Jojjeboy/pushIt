import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-backup',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.scss']
})
export class BackupRestoreComponent implements OnInit, OnDestroy {


  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  lastBackupFetched: boolean = false;
  backupTalliesModalData: Object = {};
  restoreTalliesModalData: Object = {};
  private API_URL: string = 'http://20232024.se/api/pushIt';
  data = {};

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    // check if were online
    this.checkNetworkStatus();
    if(this.networkStatus){
      this.getDataFromServer();
    }
  }


  getDataFromServer() {
    return this.httpClient.get(this.API_URL).subscribe((data: any) => this.data = { ...data });
  }

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

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        this.networkStatus = status;
      });
  }


  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }

}

