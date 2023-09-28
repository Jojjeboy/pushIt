import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

import { History } from '../../types/History';
import { Tally } from '../../../tally/types/Tally';

import { DateHelperService } from '../../../shared/service/Date/date-helper.service';
import { TallyService } from '../../../tally/service/tally.service';
import { HistoryService } from '../../service/history.service';


@Component({
  selector: 'app-edit-tally-history2',
  templateUrl: './edit-tally-history.component.html',
  styleUrls: ['./edit-tally-history.component.scss']
})
export class EditTallyHistoryComponent implements OnInit, OnDestroy {
  tally!: Tally;
  tallyObservable!: Subscription;
  tallyHistory!: Array<History>;

  dateAlreadyExistModalData: Object = {};



  historyForm!: FormGroup;

  yesterday: String = this.dateService.getDayOffset(1, 0).toISOString().substring(0, 10);


  constructor(
    private tallyService: TallyService,
    private historyService: HistoryService,
    private dateService: DateHelperService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {


  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tallyObservable = this.tallyService.getTallyById(params['id']).subscribe(tally => {
        this.tally = tally;

        this.tallyHistory = this.historyService.sortHistoryByDate(this.tally);
        let fgArr: any = [];

        this.tallyHistory.forEach(hist => {
          let aFormControl = new FormControl(hist.getDate().toISOString().substring(0, 10), [Validators.required, Validators.minLength(3)]);

          // Add formgroup to array
          fgArr.push(
            this.fb.group({
              date: aFormControl,
              originalDate: hist.getDate().toISOString().substring(0, 10),
              value: hist.getValue()
            })
          );
        });

        // Add formgrouparr to form
        this.historyForm = this.fb.group({
          histories: this.fb.array(fgArr)
        });
      });
    });
  }

  dateChange(newDate: string, i: number) {
    const orgDateString = this.histories().value[i].originalDate;
    let chosenDateValid: boolean = true;
    let c: number = 0;

    let fc = this.histories().at(i).get('date');
    for (var val of this.histories().controls) {

      if (c !== i) {
        if (newDate === val.value.date) {
          chosenDateValid = false;
          try {
            if (fc != null) {
              fc.setValue(orgDateString);
            }

          } catch (e) {
            console.error(e);
          }
        }

      }
      c++;
    }

    // check if date alleady exist
    if (!chosenDateValid) {

      this.dateAlreadyExistModalData = {
        open: true,
        header: 'Datum valt',
        body: 'Valt datum: ' + newDate + ' finns redan i historiken, välj ett nytt datum!',
        footer: ''
      }
    }
  }

  histories(): FormArray {
    return this.historyForm.get("histories") as FormArray
  }

  newHistory(): FormGroup {
    return this.fb.group({
      date: new FormControl('', [Validators.required, Validators.minLength(3)]),
      originalDate: '',
      value: 0,
    })
  }

  addHistory() {
    this.histories().insert(0, this.newHistory());
  }

  removeHistory(i: number) {
    this.histories().removeAt(i);
  }

  cleanHistoryConfirmed(): void {
    this.historyService.cleanHistory(this.tally)
    this.router.navigate(['/tally/' + this.tally.getUuid()], { queryParams: { type: 'success', message: 'Historiken borttagen' } });
  }

  dateAlreadyExistConfirmed() {
    this.dateAlreadyExistModalData = { open: false };
  }

  onSubmit() {
    let historyArr: History[] = [];

    this.historyForm.value.histories.forEach((element: object) => {
      let history: History = new History(element);
      historyArr.push(history);
    });

    this.tally.setHistory(historyArr);
    this.tallyService.update(this.tally);
    this.router.navigate(['/tally/' + this.tally.getUuid()], { queryParams: { type: 'success', message: 'Historiken uppdaterad' } });
  }

  ngOnDestroy(): void {
    this.tallyObservable.unsubscribe();
  }

}
