import { Injectable } from '@angular/core';
import { Tally } from '../../../tally/types/Tally';
import { DateHelperService } from '../Date/date-helper.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BaseTallyService {

  constructor(protected localStorageService: LocalStorageService, protected dateHelperService: DateHelperService) {}

  touch(tally: Tally): void {
    tally.setLastTouched(new Date());
  }

  save(obj: Object, key: string): void {
    this.localStorageService.add(this.convertToLsToObject(obj), key);
  }

  update(obj: Object, key: string): void {
    this.localStorageService.update(this.convertToLsToObject(obj), key);
  }

  convertToLsToObject(obj: Object): Object {
    const plainObject: Object = Object.assign({}, obj);
    return plainObject;
  }
}
