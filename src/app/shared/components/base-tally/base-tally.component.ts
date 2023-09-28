import { Component, OnInit } from '@angular/core';
import { History } from 'src/app/history/types/History';
import { TallyService } from 'src/app/tally/service/tally.service';
import { Tally } from 'src/app/tally/types/Tally';
import { LocalStorageService } from '../../service/local-storage/local-storage.service';

@Component({
  selector: 'app-base-tally',
  template: ``
})
export class BaseTallyComponent {

  constructor(protected tallyService: TallyService){}
  percentage = 0.00;

  public translation: any = {
    "daily": "dagars",
    "weekly": "veckas",
    "monthly": "månads"
  }

  getDynamicTallyGoal(histories: History[]): number {
    let total:number = 0;
    let dynamicGoal:number = 0;

    histories.forEach((history: History) => {
      total =+ history.getValue();
    });

    dynamicGoal = total * 1.1 / histories.length;

    if(!isNaN(dynamicGoal)){

    }
    return Math.round(dynamicGoal);
  }

  showDynamicGoal(tally: Tally): boolean {
    if(tally.getCanReset() && tally.getHistory().length > 2){
      return true;
    }
    return false;
  }

  recalculatePercentage(tally: Tally) {
    this.percentage = this.tallyService.recalculatePercentage(tally.getGoal(), tally.getValue());
  }

  increase(tally: Tally) {
    this.tallyService.increase(tally);
    this.recalculatePercentage(tally);
  }
  
  decrease(tally: Tally) {
    this.tallyService.decrease(tally);
    this.recalculatePercentage(tally);
  }

}
