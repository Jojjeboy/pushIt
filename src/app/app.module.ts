import { NgModule, isDevMode, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/modules/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BackupRestoreComponent } from './backup-restore/backup-restore.component';


@NgModule({
  declarations: [
    AppComponent,
    BackupRestoreComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
