import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './shared/service/local-storage/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationversion } from '../environments/applicationversion';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';

export interface Appversion {
  version: string
  revision: string
  branch: string
  date: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'clearResults';
  sub: any;
  showAlert: boolean = false;
  alertText!: string;
  alertType: string = 'error';
  appVersion: Appversion = applicationversion;
  showAppVersion: boolean = false;

  clearCacheModal: Object = {};


  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private swUpdate: SwUpdate) {
    this.localStorageService.init(this.title);
    
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter(
          (evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'
        ),
        map((evt: any) => {
          console.info(
            `currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`
          );
          
          this.promptUserToUpdateApp(evt.currentVersion, evt.latestVersion);
        })
      );
    }

  }


  promptUserToUpdateApp(currentVersion: any, newVersion: any) {
    this.showAlert = true;
    this.alertText = `Ny version av applikationen finns, Du har ${currentVersion} | och ${newVersion} finns`;
    this.alertType = 'danger';
  }


  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {

        if (params['type'] && params['message']) {
          this.showAlert = true;
          this.alertText = params['message'];
          this.alertType = params['type'];

          this.router.navigate([], {
            queryParams: {
              'type': null,
              'message': null,
            },
            queryParamsHandling: 'merge'
          })

          setTimeout(() => {
            this.showAlert = false;
            this.alertText = '';



          }, 205000);
        }
      });
  }

  toggleShowAppVersion() {
    this.showAppVersion = !this.showAppVersion;
  }

  clearCache() {
    this.clearCacheModal = {
      open: true,
      header: 'Radera Local Storage',
      body: 'Är du säker på att du vill radera all Local Storage',
    }
  }

  saveCacheToFile() {
    
  }

  toStartPage() {
    if (window.location.hostname === 'localhost') {
      window.location.href = window.location.origin;
    }
    else if (window.location.hostname === 'jojjeboy.github.io') {
      window.location.href = window.location.origin + '/' + window.location.pathname.split('/')[1];
    }
  }

  clearCacheConfirmed() {
    this.localStorageService.clear();
    this.clearCacheModal = { open: false }
    this.toStartPage();
  }
}
