import { Injectable } from '@angular/core';
import { History } from 'src/app/history/types/History';
import { Tally } from 'src/app/tally/types/Tally';
import { BaseTally } from '../../shared/service/baseTally/baseTally.service';
import { DateHelperService } from '../../shared/service/Date/date-helper.service';
import { LocalStorageService } from '../../shared/service/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends BaseTally {

  constructor(localStorageService: LocalStorageService, dateHelperService: DateHelperService) {
    super(localStorageService, dateHelperService);
  }

  dateExistInHistory(lastTouched: Date, histories: History[]): boolean {
    let dateExist = false;
    const dateTimestampLastTouched = lastTouched.setHours(0, 0, 0, 0);

    histories.forEach((history) => {
      if(dateTimestampLastTouched === history.getDate().setHours(0, 0, 0, 0)){
        dateExist = true;
      }
    });

    return dateExist;
  }

  addToHistory(value: number, lastTouched: Date, histories: History[]): Array<History> {
    const newHistoryEntry = new History({
      value: value,
      date: lastTouched
    });
    histories.push(newHistoryEntry);
    

    
    return histories;
  }

  cleanHistory(tally: Tally): Tally {
    tally.setHistory([]);
    this.touch(tally);
    this.update(tally);
    return tally;
  }

  sortHistoryByDate(tally: Tally): History[] {
    let tallyHistory: History[] = tally.getHistory().sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    tally.setHistory(tallyHistory);
    return tallyHistory;
  }

  /*
  removeDuplicatesInHistory(tallies: Tally[]): void {
    tallies.forEach(tally => {
      let arr = tally.getHistory();
      arr = arr.filter((history: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
          t.date === history.date && t.value === history.value
        ))
      );
      tally.setHistory(arr);
      this.touch(tally);
      this.update(tally);
    });
  }
  */
}
