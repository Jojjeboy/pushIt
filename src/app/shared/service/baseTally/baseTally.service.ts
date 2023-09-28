import { Injectable } from '@angular/core';
import { Tally } from '../../../tally/types/Tally';
import { DateHelperService } from '../Date/date-helper.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BaseTally {

  constructor(protected localStorageService: LocalStorageService, protected dateHelperService: DateHelperService) {}

  touch(tally: Tally): void {
    tally.setLastTouched(new Date());
  }

  save(tally: Tally): void {
    this.localStorageService.add(this.convertToLsTally(tally));
  }

  update(tally: Tally): void {
    this.localStorageService.update(this.convertToLsTally(tally));
  }

  convertToLsTally(tally: Tally): Object {
    const plainObject: Object = Object.assign({}, tally);
    return plainObject;
  }
}
