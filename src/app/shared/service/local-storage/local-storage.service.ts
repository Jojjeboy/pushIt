import { Injectable } from '@angular/core';
import { applicationversion } from '../../../../environments/applicationversion';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public localStorage: any;
  private key: string;
  private config: any;

  constructor() {
    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
    this.key = '';
  }

  public init(key: string): any {
    if (!key) {
      throw new Error('Local Storage key not provided');
    }
    this.setKey(key);
    if (this.localStorage.getItem(key) === null) {
      // Init structure in localStaorage
      this.emptyItemsInKey();
    } else {
      // Check if config is already set
      const lsConfig: any = this.getConfig();
      if (typeof lsConfig === 'object') {
        this.config = lsConfig;
      }
    }
  }

  private setKey(key: string) {
    this.key = key;
  }

  public getAll(): Array<Object> {
    const lSData: any = JSON.parse(this.localStorage.getItem(this.key));
    return lSData['data'];
  }

  public add(obj: Object): void {
    const lsItems = this.getAll();
    lsItems.push(obj);
    this.writeLS(lsItems);
  }

  public addMultiple(array: Array<Object>): void {
    const lsItems = this.getAll();
    for (let i = 0; i < array.length; i++) {
      lsItems.push(array[i]);
    }
    this.writeLS(lsItems);
  }

  public writeLS(array: Array<Object>): void {
    localStorage.setItem(this.key, JSON.stringify({ config: this.config, data: array }));
  }

  public updateItem(key: String, propertyName: any, obj: Object) {
    const lsItems = this.getAll();
    for (let i = 0; i < lsItems.length; i++) {
      const item: any = lsItems[i];
      if (item[propertyName] === key) {
        lsItems[i] = obj;
        this.writeLS(lsItems);
        break;
      }
    }

  }

  public removeItem(key: String): boolean {
    const lsItems: any = this.getAll(),
      newData = [];
    let foundItem = false,
      iter = 0;
    while (iter < lsItems.length) {
      if (key !== lsItems[iter]['uuid']) {
        newData.push(lsItems[iter]);
      } else {
        foundItem = true;
      }
      iter++;
    }
    this.writeLS(newData);
    return foundItem;
  }

  public update(obj: any): boolean {
    const lsItems: any = this.getAll(),
      newData = [];
    let updated = false;
    for (let i = 0; i < lsItems.length; i++) {
      if (lsItems[i]['uuid'] === obj['uuid']) {
        lsItems[i] = obj;
        updated = true;
      }
    }
    this.writeLS(lsItems);
    return updated;
  }

  public getItem(id: String): Array<object> {
    const lsItems: any = this.getAll();
    let returnArr = [];
    for (let i = 0; i < lsItems.length; i++) {
      if (lsItems[i]['uuid'] === id) {
        returnArr.push(lsItems[i]);
      }
    }
    return returnArr;
  }

  public getNrOfItems(): number {
    return this.getAll().length;
  }

  public emptyItemsInKey(): void {
    localStorage.setItem(this.key, JSON.stringify(
      {
        config: {
          showAll: false,
          appVersion: [
            {
              date: new Date(),
              hash: applicationversion.revision
            }
          ]
        }, data: []
      }

    ));
  }

  public clear(): any {
    this.localStorage.removeItem(this.key);
  }

  public getConfig(): any {
    const lSData: any = JSON.parse(this.localStorage.getItem(this.key));
    if (!lSData['config']) {

      return lSData['config'] = {
        showAll: false,
        appVersion: [
          {
            date: new Date(),
            hash: applicationversion.revision
          }
        ]
      };
    }
    return lSData['config'];
  }

  public saveConfig(config: Object): void {
    const lSData: any = JSON.parse(this.localStorage.getItem(this.key));
    localStorage.setItem(this.key, JSON.stringify({ config: config, data: lSData['data'] }));
  }

  public uppdatePropertyOnAll(propertyName: string, newValue: any): void {
    const lsData: Array<any> = this.getAll();
    let touched = false;
    for (let i = 0; i < lsData.length; i++) {
      if (lsData[i].hasOwnProperty(propertyName)) {
        lsData[i][propertyName] = newValue;
        touched = true;
      }
    }
    if (touched) {
      this.writeLS(lsData);
    }
  }
}
