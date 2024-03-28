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
      this.makeSureTodoExist();
      if (typeof lsConfig === 'object') {
        this.config = lsConfig;
      }
    }
  }

  private setKey(key: string) {
    this.key = key;
  }

  public getAll(key: string): Array<Object> {
    const lSData: any = JSON.parse(this.localStorage.getItem(this.key));
    return lSData[key];
  }

  public add(obj: Object, key: string): void {
    const lsItems = this.getAll(key);
    lsItems.push(obj);
    this.writeLS(lsItems, key);
  }

  public writeLS(array: Array<Object>, key: string): void {
    if (!this.config) {
      this.init(this.key);
    }
    if(key === 'data'){
      localStorage.setItem(this.key, JSON.stringify({ config: this.config, data: array, todos: this.getAll('todos') }));

    }
    else if(key === 'todos'){
      localStorage.setItem(this.key, JSON.stringify({ config: this.config, data: this.getAll('data'), todos: array }));
    }
  }

  public getLS() {
    const lSData: any = JSON.parse(this.localStorage.getItem(this.key));
    return lSData;
  }

  public updateItem(key: String, propertyName: any, obj: Object) {
    const lsItems = this.getAll('data');
    for (let i = 0; i < lsItems.length; i++) {
      const item: any = lsItems[i];
      if (item[propertyName] === key) {
        lsItems[i] = obj;
        this.writeLS(lsItems, 'data');
        break;
      }
    }

  }

  public removeItem(uuid: String, key: string): boolean {
    const lsItems: any = this.getAll(key),
      newData = [];
    let foundItem = false,
      iter = 0;
    while (iter < lsItems.length) {
      if (uuid !== lsItems[iter]['uuid']) {
        newData.push(lsItems[iter]);
      } else {
        foundItem = true;
      }
      iter++;
    }
    this.writeLS(newData, 'data');
    return foundItem;
  }

  public update(obj: any, key: string): boolean {
    const lsItems: any = this.getAll(key),
      newData = [];
    let updated = false;
    for (let i = 0; i < lsItems.length; i++) {
      if (lsItems[i]['uuid'] === obj['uuid']) {
        lsItems[i] = obj;
        updated = true;
      }
    }
    this.writeLS(lsItems, key);
    return updated;
  }

  public getItem(id: String, key: string): Array<object> {
    const lsItems: any = this.getAll(key);
    let returnArr = [];
    for (let i = 0; i < lsItems.length; i++) {
      if (lsItems[i]['uuid'] === id) {
        returnArr.push(lsItems[i]);
      }
    }
    return returnArr;
  }

  public getNrOfItems(): number {
    return this.getAll('data').length;
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
        }, data: [],
        todos: []
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

  makeSureTodoExist(): void {
    const lsData: any = JSON.parse(this.localStorage.getItem(this.key));
    if (!lsData['todos']) {
      localStorage.setItem(this.key, JSON.stringify(
        {
          config: this.getConfig(), 
          data: this.getAll('data'), 
          todos: []
        }));
    }
  }

  public saveConfig(config: Object): void {
    const lSData: any = JSON.parse(this.localStorage.getItem(this.key));
    localStorage.setItem(this.key, JSON.stringify({ config: config, data: lSData['data'], todos: this.getAll('todos') }));
  }

  public uppdatePropertyOnAll(propertyName: string, newValue: any): void {
    const lsData: Array<any> = this.getAll('data');
    let touched = false;
    for (let i = 0; i < lsData.length; i++) {
      if (lsData[i].hasOwnProperty(propertyName)) {
        lsData[i][propertyName] = newValue;
        touched = true;
      }
    }
    if (touched) {
      this.writeLS(lsData, 'data');
    }
  }
}
