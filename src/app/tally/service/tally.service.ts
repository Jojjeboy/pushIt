import { Injectable } from '@angular/core';
import { Tally } from '../types/Tally';
import { History } from '../../history/types/History';
import { LocalStorageService } from '../../shared/service/local-storage/local-storage.service';
import { HistoryService } from '../../history/service/history.service';
import { applicationversion } from '../../../environments/applicationversion';
import { Observable } from 'rxjs';
import { BaseTally } from '../../shared/service/baseTally/baseTally.service';
import { DateHelperService } from '../../shared/service/Date/date-helper.service';

@Injectable({
  providedIn: 'root'
})
export class TallyService extends BaseTally {

  lsTallies = Array<Object>();
  tallies: Array<Tally> = [];

  percentage = 0.00;
  private showAll = false;

  constructor(
    private historyService: HistoryService,
    localStorageService: LocalStorageService,
    dateHelperService: DateHelperService) {
    super(localStorageService, dateHelperService);

    //this.lsTallies = localStorageService.getAll();
    //this.tallies = <Array<Tally>>this.convertLSToTallies(this.lsTallies);


    
    this.updateAppVersion();
  }

  getTallies(): Observable<Tally[]> {
    return new Observable<Tally[]>(observer => {
      this.lsTallies = this.localStorageService.getAll();
      this.tallies = <Array<Tally>>this.convertLSToTallies(this.lsTallies);
      this.resetOldTallys();
      this.reloadDataFromLS();
      this.sortByActive();
      observer.next(this.tallies);
    });
  }

  recalculatePercentage(goal: number, value: number): number {
    let percentage = 0.00;
    if (goal !== null && value !== null) {
      percentage = (value / goal * 100);
      percentage = parseInt(percentage.toString(), 10);
      if (isNaN(this.percentage)) {
        percentage = 0;
      }
    }
    return percentage;
  }

  getTallyById(id: String): Observable<Tally> {
    return new Observable<Tally>(observer => {
      let tally: Tally = this.getEmptyTally();
      let found = false;
      this.tallies.forEach(eachTally => {
        if (eachTally.getUuid() === id) {
          tally = eachTally;
          found = true;
        }
      });
      if (!found) {
        let objArr: Array<object> = this.localStorageService.getItem(id);
        tally = this.convertLSToTallies(objArr)[0];
      }
      observer.next(tally);
    });
  }

  resetOldTallys(): void {
    for (let tally of this.tallies) {
      if (this.shouldAddToHistory(tally)) {
        let histories = this.historyService.addToHistory(tally.getValue(), tally.getLastTouched(), tally.getHistory());
        tally.setHistory(histories);
        tally.setValue(0);
        this.touch(tally);
        this.update(tally);
      }
    }
  }

  shouldAddToHistory(tally: Tally): boolean {
    let shouldAddToHistory = false;
    if (tally.getCanReset()) {
      if (this.dateHelperService.lastTouchedIsOld(tally.getLastTouched(), tally.getResetInterval()) && tally.getValue() > 0) {
        if (this.historyService.dateExistInHistory(tally.getLastTouched(), tally.getHistory()) === false) {
          shouldAddToHistory = true;
        }
      }
    }
    return shouldAddToHistory;
  }

  isOld(tally: Tally): Boolean {
    const now = new Date();
    return now.getDate() !== tally.getLastTouched().getDate();
  }

  increase(tally: Tally): void {
    let tallyValue:number = tally.getValue();
    const tallyIncreseBy:number = tally.getIncreseBy();
    tallyValue += tallyIncreseBy;
    tally.setValue(tallyValue);
    if (tallyValue > tally.getTopScore()) {
      tally.setTopScore(tally.getValue());
    }
    this.touch(tally);
    this.update(tally);
  }

  decrease(tally: Tally): void {
    let tallyValue = tally.getValue();
    const tallyIncreseBy = tally.getDecreseBy();
    if (tallyValue > 0) {
      tallyValue -= tallyIncreseBy;
      tally.setValue(tallyValue);
      this.touch(tally);
      this.update(tally);
    }
  }

  cleanHistory(tally: Tally): void {
    tally = this.historyService.cleanHistory(tally);
    this.touch(tally);
    this.update(tally);
  }


  convertLSToTallies(lsTallies: Array<object>): Tally[] {
    const returnArr = new Array<Tally>();
    for (const obj of lsTallies) {
      let tally = new Tally(obj);
      
      let historyArr: History[] = [];
      for (const hist of tally.getHistory()) {
        let history = new History(hist);
        history.setDate(new Date(hist.date));

        historyArr.push(history);
      }
      tally.setHistory(historyArr);

      tally.setLastTouched(new Date(tally.getLastTouched()));
      returnArr.push(tally);
    }
    return returnArr;
  }


  getEmptyTally() {
    return new Tally({
      title: null,
      increseBy: null,
      decreseBy: null,
      reset: false,
      resetInterval: null,
      uuid: null,
      value: 0,
      lastTouched: null,
      history: [],
      goal: null,
      topScore: 0,
      active: true
    });
  }


  delete(deleteTally: Tally): void {
    const index = this.tallies.indexOf(deleteTally);
    if (index > -1) {
      this.tallies.splice(index, 1);
    }
    this.localStorageService.removeItem(deleteTally.getUuid());
  }


  toggleShowAll(): void {
    let config = this.localStorageService.getConfig();
    this.showAll = !this.showAll;
    config.showAll = this.showAll;
    this.localStorageService.saveConfig(config);
  }

  getShowAll(): boolean {
    return this.showAll;
  }

  sortByLastTouched(): Array<Tally> {
    let sortedArray: Tally[] = this.tallies.sort((obj1, obj2) => {
      if (obj1.lastTouched < obj2.lastTouched) {
        return 1;
      }

      if (obj1.lastTouched > obj2.lastTouched) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }

  sortByActive(): Array<Tally> {
    let sortedArray: Tally[] = this.tallies.sort((obj1, obj2) => {
      if (obj1.active < obj2.active) {
        return 1;
      }

      if (obj1.active > obj2.active) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }

  private updateAppVersion(): void {
    let config = this.localStorageService.getConfig();
    let foundVersion = false;
    if (!config.appVersion) {
      config["appVersion"] = [];
    }

    for (let i = 0; i < config.appVersion.length; i++) {
      if (applicationversion.revision == config.appVersion[i].hash) {
        foundVersion = true;
      }
    }

    if (!foundVersion) {
      config.appVersion.push({
        date: new Date(),
        hash: applicationversion.revision,
      });
      this.localStorageService.saveConfig(config);
    }
  }

  reloadDataFromLS() {
    this.lsTallies = this.localStorageService.getAll();
    this.tallies = this.convertLSToTallies(this.lsTallies);
  }
}
