import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './shared/service/local-storage/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationversion } from '../environments/applicationversion';
import { WebServiceWorkerService } from './web-service-worker.service';
import { Subscription } from 'rxjs';


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
  title = 'pushIt';
  sub: any;
  showAlert: boolean = false;
  alertText!: string;
  alertType: string = 'error';
  appVersion: Appversion = applicationversion;
  showAppVersion: boolean = false;
  clearCacheModal: Object = {};
  isNewAppVersionAvailable: boolean = false;
  newAppUpdateAvailableSubscription?: Subscription;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private webServiceWorkerService: WebServiceWorkerService) {
    this.localStorageService.init(this.title);
  }

  promptUserToUpdateApp() {
    this.showAlert = true;
    this.alertText = `Ny version av applikationen finns`;
    this.alertType = 'danger'; 
  }

  ngOnInit() {
    /** 
     * Service worker examples
     * https://medium.com/@zeeshankhan8838/mastering-web-service-workers-in-angular-a-comprehensive-guide-8a6ebad4ac29
     * 
     */

    this.checkIfAppIsUpdated();

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
          }, 3000);
        }
      });
  }

  checkIfAppIsUpdated() {
    this.newAppUpdateAvailableSubscription = this.webServiceWorkerService.$isAnyNewUpdateAvailable.subscribe((versionAvailableFlag: boolean) => {
      this.isNewAppVersionAvailable = versionAvailableFlag;

      this.showAlert = this.isNewAppVersionAvailable;
      this.alertText = 'Ny version av appen finns, ladda om';
      this.alertType = 'danger'
      if (this.isNewAppVersionAvailable) {
        console.log(this.alertText, this.appVersion);
        console.log('----');
        console.log('this.appVersion: ');
        console.log(this.appVersion);
      }
      else {
        console.log('Ingen ny version av appen finns, håll tillgodo');
      }
    })
  }

  refreshApp() {
    window.location.reload();
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
