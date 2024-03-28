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
  archiveTallyModalData: Object = {};

  public translation: any = {
    "daily": "dagars",
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


  recalculatePercentage(tally: Tally) {
    this.percentage = this.tallyService.recalculatePercentage(tally.getGoal(), tally.getValue());
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
