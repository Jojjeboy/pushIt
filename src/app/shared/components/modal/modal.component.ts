import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent {

  @Input() modalData: any = {};
  @Output() parentEvent = new EventEmitter();

  childmethod() {
    this.parentEvent.emit();
  }

  openModal(): void {
    this.modalData.open = true;
  }

  closeModal(): void{
    this.modalData.open = false;
  }

  callBackConfirmed() {
    this.parentEvent.emit();
  }
}
