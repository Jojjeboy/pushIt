import { Component, Input } from '@angular/core';

@Component({
  selector: 'alert',
  template: `<div class="alert alert-app-level alert-{{ type }}" *ngIf="showalert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="info-circle"></clr-icon>
      </div>
      <div class="alert-text">
        {{ text }}
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
