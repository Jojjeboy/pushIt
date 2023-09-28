import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Tally } from '../../types/Tally';
import { TallyService } from '../../service/tally.service';
import { UUIDService } from '../../../shared/service/uuid/uuid.service';
import { Subscription } from 'rxjs';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HistoryService } from '../../../history/service/history.service';

@Component({
  selector: 'app-upsert-tally',
  templateUrl: './upsert-tally.component.html',
  styleUrls: ['./upsert-tally.component.scss']
})
export class UpsertTallyComponent implements OnInit, OnDestroy {

  cleanHistoryModalData: Object = {};
  deleteModalData: Object = {};
  toggleActivityModalData: Object = {};

  editMode: boolean = false;
  editId!: string;
  tally!: Tally;
  tallyObservable!: Subscription;
  tallyForm!: FormGroup;


  constructor(
    private location: Location,
    private router: Router,
    private tallyService: TallyService,
    private historyService: HistoryService,
    private uUIDService: UUIDService) {

  }

  ngOnInit(): void {
    this.setupMode();
  }

  setupMode(): void {
    if (this.location.path().split('/').length === 3) {
      this.editMode = true;
      this.editId = this.location.path().split('/')[2];

      try {
        this.tallyObservable = this.tallyService.getTallyById(this.editId).subscribe(tally => {
          this.tally = tally;
        });
      }
      catch (e) {
        console.log(e);
        this.location.back();
      }
    }
    else {
      this.tally = this.tallyService.getEmptyTally();
      this.tally.setUuid(this.uUIDService.UUID());
    }
    this.setupFormGroup(this.tally)
  }


  setupFormGroup(tally: Tally): void {

    this.tallyForm = new FormGroup({
      title: new FormControl(tally.getTitle(), [Validators.required]),
      increseBy: new FormControl(tally.getIncreseBy(), [Validators.required]),
      decreseBy: new FormControl(tally.getDecreseBy(), [Validators.required]),
      reset: new FormControl(tally.getCanReset(), [Validators.required]),
      resetInterval: new FormControl(tally.getResetInterval()),
      active: new FormControl(tally.getActive(), [Validators.required]),
      value: new FormControl(tally.getValue(), [Validators.required]),
      goal: new FormControl(tally.getGoal(), [Validators.required]),
      topScore: new FormControl(tally.getTopScore(), [Validators.required])
    });

    if(!tally.getResetInterval()){
      this.tallyForm.controls['resetInterval'].disable();
    }

    this.tallyForm.get('reset')?.valueChanges.subscribe(reset => {
      if (!reset) {
        this.tallyForm.controls['resetInterval'].disable();
        if (this.tally.getHistory().length > 0) {
          this.cleanHistoryModalData = {
            open: true,
            header: 'Radera historik',
            body: 'Är du säker på att du vill radera historiken.\n Det verkar som det finns ' + this.tally.getHistory().length + ' <enhet> historik',
            footer: ''
          }
        }
      }
      else {
        this.tallyForm.controls['resetInterval'].enable();
        if (this.tallyForm.controls['resetInterval'].value === null) {
          this.tallyForm.controls['resetInterval'].setValue('daily');
        }
      }
    });
  }

  onSubmit() {

    this.tally.setTitle(this.tallyForm.value.title);
    this.tally.setIncreseBy(this.tallyForm.value.increseBy);
    this.tally.setDecreseBy(this.tallyForm.value.decreseBy);
    this.tally.setCanReset(this.tallyForm.value.reset);
    this.tally.setResetInterva(this.tallyForm.value.resetInterval);
    this.tally.setGoal(this.tallyForm.value.goal);
    this.tally.setTopScore(this.tallyForm.value.topScore);
    this.tally.setValue(this.tallyForm.value.value);
    this.tally.setActive(this.tallyForm.value.active);
    this.tally.setLastTouched(new Date());

    let action: string = 'skapad';
    if (this.editMode) {
      this.tallyService.update(this.tally);
      action = 'uppdaterad';
    }
    else {
      this.tallyService.save(this.tally);
    }
    this.router.navigate(['/tally/' + this.tally.getUuid()], { queryParams: { type: 'success', message: 'Räknare ' + action } });
  }

  cleanHistoryConfirmed(): void {
    this.historyService.cleanHistory(this.tally)
    this.cleanHistoryModalData = { open: false };
  }


  ngOnDestroy(): void {
    if (this.editMode) {
      this.tallyObservable.unsubscribe();
    }
  }

}
