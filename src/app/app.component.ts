import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './shared/service/local-storage/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationversion } from '../environments/applicationversion';
import { SwUpdate } from '@angular/service-worker';

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
    private updates: SwUpdate) {
    this.localStorageService.init(this.title);
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);

      this.promptUserToUpdateApp();
      
    });

    this.updates.activated.subscribe(event => {
      console.log('updated');
    });
  }



  promptUserToUpdateApp(){
    this.showAlert = true;
    this.alertText = 'Ny version av applikationen finns, ladda om sidan för att uppdatera';
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

            

          }, 2500);
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

  toStartPage(){
    if(window.location.hostname === 'localhost'){
      window.location.href = window.location.origin;
    }
    else if(window.location.hostname === 'jojjeboy.github.io'){
      window.location.href = window.location.origin + '/' + window.location.pathname.split('/')[1];
    }
  }

  clearCacheConfirmed() {
    this.localStorageService.clear();
    this.clearCacheModal = { open: false }
    this.toStartPage();
  }
}
