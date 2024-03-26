import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tally } from '../../types/Tally';
import { History } from '../../../history/types/History';
import { LocalStorageService } from '../../../shared/service/local-storage/local-storage.service';
import { TallyService } from '../../service/tally.service';
import { BaseTallyComponent } from 'src/app/shared/components/base-tally/base-tally.component';
import { strings as englishStrings } from "ngx-timeago/language-strings/en";


@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseTallyComponent implements OnInit, OnDestroy{

  tallies = Array<Tally>();
  showAll: boolean = true;
  tallyListObservable!: Subscription;
  tallyFetched: boolean = false;
  

  constructor(
    protected localStorageService: LocalStorageService,
    protected override tallyService: TallyService) {
      super(tallyService);
  }

  ngOnInit(): void {

    this.showAll = this.localStorageService.getConfig().showAll;
    this.tallyListObservable = this.tallyService.getTallies().subscribe(tallies => {
      this.tallyFetched = true;
      this.tallies = tallies;
    });
  }


  getShowAll() {
    return this.showAll;
  }

  calculatePercentage(tally: Tally): number {
    return this.tallyService.recalculatePercentage(tally.getGoal(), tally.getValue());
  }

  inactiveTallysExist(): boolean {
    let exist = false;;
    this.tallies.forEach(tally => {
      if (!tally.getActive()) {
        exist = true;
      }
    });
    return exist;
  }

  toggleShowInactive(event: any): void {
    let config = this.localStorageService.getConfig();
    this.showAll = event.target.checked;
    config.showAll = this.showAll;
    this.localStorageService.saveConfig(config);
  }

  getUnitText(tally: Tally): string {
    let resetIntervalText: string = '';
    if(tally.resetInterval === 'daily'){
      if(tally.getHistory().length === 1){
        resetIntervalText = 'dags';
      }
      else {
        resetIntervalText = 'dagars';
      }
    }
    else if(tally.resetInterval === 'weekly'){
      if(tally.getHistory().length === 1){
        resetIntervalText = 'veckas';
      }
      else {
        resetIntervalText = 'veckors';
      }
    }
    else if(tally.resetInterval === 'monthly'){
      if(tally.getHistory().length === 1){
        resetIntervalText = 'månads';
      }
      else {
        resetIntervalText = 'månaders';
      }
    }
    return resetIntervalText;
  }


  getTotalHistoryGoal(tally: Tally): number{
    let c = 0;
    tally.getHistory().forEach((hist: History) => {
      c += hist.getGoal();
    });

    c += tally.getGoal();

    return c;
  }


  getTotalNumberOfDoneReps(tally: Tally): number{
    let c = 0;
    tally.getHistory().forEach((hist: History) => {
      c += hist.getValue();
    });

    c += tally.getValue();

    return c;
  }


  ngOnDestroy() {
    this.tallyListObservable.unsubscribe();
  }

}
