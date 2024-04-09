import { Component } from '@angular/core';
import { History } from 'src/app/history/types/History';
import { TallyService } from 'src/app/tally/service/tally.service';
import { Tally } from 'src/app/tally/types/Tally';

@Component({
  selector: 'app-base-tally',
  template: ``
})
export class BaseTallyComponent {

  constructor(
    protected tallyService: TallyService
  ) { }

  percentage = 0.00;
  totalPercentage = 0.00;
  archiveTallyModalData: Object = {};

  public translation: any = {
    "daily": "d",
    "weekly": "veckas",
    "monthly": "månads"
  }

  getGoalReached(histories: History[]): number {
    let streakLength = 0;

    histories.forEach((history: History) => {
      if (history.getValue() >= history.getGoal()) {
        streakLength++;
      }
    });

    return streakLength;
  }

  getBestStreak(histories: History[]): number {
    let highestStreak = 0;
    let loopStreak = 0;


    histories.forEach((history: History) => {
      if (history.getValue() >= history.getGoal()) {
        loopStreak++;
      }
      else {
        if (loopStreak > highestStreak) {
          highestStreak = JSON.parse(JSON.stringify(loopStreak));
        }
        loopStreak = 0;
      }
    });

    if (loopStreak > highestStreak) {
      highestStreak = JSON.parse(JSON.stringify(loopStreak));
    }

    return highestStreak;
  }

  getCurrentStreak(histories: History[]): number {
    let streakLength = 0;
    let highestStreak = 0;
    let breakLoop = false;

    histories.forEach((history: History) => {
      if (history.getValue() >= history.getGoal() && !breakLoop) {
        highestStreak++;
        streakLength = JSON.parse(JSON.stringify(highestStreak));
      }
      else {
        breakLoop = true;
      }
    });

    return streakLength;
  }

  getTotalHistoryGoal(tally: Tally): number{
    let c = 0;
    tally.getHistory().forEach((hist: History) => {
      c += hist.getGoal();
    });

    c += tally.getGoal();

    return c;
  }

  calculatePercentage(tally: Tally): number {
    return this.tallyService.recalculatePercentage(tally.getGoal(), tally.getValue());
  }

  calculateTotalPercentage(tally: Tally): number {
    return this.tallyService.recalculateTotalPercentage(tally);
  }


  getTotalNumberOfDoneReps(tally: Tally): number{
    let c = 0;
    tally.getHistory().forEach((hist: History) => {
      c += hist.getValue();
    });

    c += tally.getValue();

    return c;
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


  recalculatePercentage(tally: Tally) {
    this.percentage = this.tallyService.recalculatePercentage(tally.getGoal(), tally.getValue());
    this.totalPercentage = this.tallyService.recalculateTotalPercentage(tally);
  }

  increase(tally: Tally) {
    this.tallyService.increase(tally);

    // Ask if it should be deactivated if its not a auto reset when the goal is hit.
    if (tally.getValue() >= tally.getGoal() && !tally.getCanReset()) {
      console.log('Deactivate this tally?');
      this.archiveTallyModalData = {
        open: true,
        header: 'Arkivera räknare?',
        body: 'Du har uppnåt målet och räknaren nollställs inte periodvis.\n Vill du arkivera räknaren?',
        footer: ''
      }
    }
    this.recalculatePercentage(tally);
  }

  archiveTallyConfirmed(tally: Tally): void {
    // put logic here to archive 
    this.tallyService.archive(tally);
    this.archiveTallyModalData = { open: false };
    console.log('Tally archived');
  }

  decrease(tally: Tally) {
    this.tallyService.decrease(tally);
    this.recalculatePercentage(tally);
  }

}
