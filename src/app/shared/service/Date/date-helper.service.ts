import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {

  constructor() { }

  formatDate(date: Date): string {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  getDayOffset(numberOfDaysOffset: number, direction: number): Date {
    let offsetDate: Date = new Date();
    if (direction === 0) {
      offsetDate = (d =>
        new Date(d.setDate(d.getDate() - numberOfDaysOffset))
      )(new Date);
    }
    else {
      offsetDate = (d =>
        new Date(d.setDate(d.getDate() + numberOfDaysOffset))
      )(new Date);
    }
    return offsetDate;
  }


  lastTouchedIsOld(lastTouched: Date, resetInterval: string): boolean {

    if (resetInterval === 'daily') {
      if (new Date().setHours(0, 0, 0, 0) - lastTouched.setHours(0, 0, 0, 0) > 0) {
        return true;
      }
      return false;
    }
    else if(resetInterval === 'weekly'){
      if(this.getWeekNumber(lastTouched) !== this.getWeekNumber(new Date())){
        return true;
      }
      return false;
    }
    else if(resetInterval === 'monthly'){
      if(this.getMonthNumber(lastTouched) !== this.getMonthNumber(new Date())){
        return true;
      }
      return false;
    }
    return false;
  }

  fixDateBeforeSaving(lastTouched: Date): Date {
    let hoursDiff = lastTouched.getHours() - lastTouched.getTimezoneOffset() / 60;
    let minutesDiff = (lastTouched.getHours() - lastTouched.getTimezoneOffset()) % 60;
    lastTouched.setHours(hoursDiff);
    lastTouched.setMinutes(minutesDiff);

    return lastTouched;
  }

  getWeekNumber(date: any): number {
    // Copy date so don't modify original
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    let yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo;
  }

  getMonthNumber(date: Date): number{
    return date.getMonth();
  }

  getYearNumber(date: Date): number {
    return date.getUTCFullYear();
  }




}
