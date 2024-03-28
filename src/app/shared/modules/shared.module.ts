import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TimeagoModule } from 'ngx-timeago';
import { ClarityModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
import { ModalComponent } from '../components/modal/modal.component';
import { AlertComponent } from '../components/alert/alert.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    ModalComponent,
    AlertComponent
  ],
  imports: [
    TimeagoModule.forRoot(),
    ClarityModule,
    CommonModule
  ],
  exports: [
    CommonModule,
    TimeagoModule,
    ClarityModule,
    BrowserModule,
    HttpClientModule,
    ModalComponent,
    AlertComponent
  ],
  providers: [
    DatePipe
  ],
})
export class SharedModule { }