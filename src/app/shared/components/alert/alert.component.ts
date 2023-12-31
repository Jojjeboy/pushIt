import { Component, Input } from '@angular/core';

@Component({
  selector: 'alert',
  template: `<div class="alert alert-app-level alert-{{ type }}" *ngIf="showalert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
      <span class="material-symbols-outlined" *ngIf="type == 'success'">check</span>
      <span class="material-symbols-outlined" *ngIf="type == 'error'">error</span>
      </div>
      <div class="alert-text">
        <span class="text">{{ text }}</span>
      </div>
    </div>
  </div>
</div>`
})

export class AlertComponent {

  @Input() type!: string;
  @Input() text!: string;
  @Input() showalert: boolean = false;

}
