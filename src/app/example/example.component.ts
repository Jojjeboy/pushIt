import { Component, OnDestroy, OnInit } from '@angular/core';
import { TallyService } from '../tally/service/tally.service';
import { Tally } from '../tally/types/Tally';
import { History } from '../history/types/History';
import { Subscription } from 'rxjs';
import { HttpService } from '../shared/service/http/http.service';
import { LocalStorageService } from '../shared/service/local-storage/local-storage.service';

@Component({
  selector: 'example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit, OnDestroy {

  constructor(
    private tallyService: TallyService,
    private httpService: HttpService,
    private localStorageService: LocalStorageService
  ) {
  }

  tallies = Array<Tally>();
  talliesFromJson = Array<Tally>();
  talliesAdded: string[] = [];

  tallyListObservable!: Subscription;

  ngOnInit() {
    const examples = Array<Tally>();
    this.tallyListObservable = this.tallyService.getTallies().subscribe((tallies: Tally[]) => {
      tallies.forEach((tally: Tally) => {
        this.talliesAdded.push(tally.getUuid());
      })
    });

    this.httpService.getExamplesOnly().subscribe((data: any) => {
      this.talliesFromJson = this.tallyService.convertLSToTallies(data.data);
    });
  }

  rewriteHistory(tally: Tally): void {
    

      const historyArr = [];
      let c = 4;
      let date = new Date();
      for (const hist of tally.getHistory()) {
        let history = new History(hist);
        history.setDate(new Date(date.setDate(date.getDate() - c)));
        historyArr.push(history);
        tally.setHistory(historyArr);
        //this.localStorageService.update(tally);
        c--;
      }
    
  }

  addExampleTally(uuid: string): void {
    this.talliesFromJson.forEach((tally: Tally) => {
      if (uuid === tally.getUuid()) {
        this.rewriteHistory(tally);
        this.tallyService.save(tally, 'data');
        this.talliesAdded.push(uuid);
      }
    });
  }

  tallyAdded(uuid: string): boolean {
    return this.talliesAdded.indexOf(uuid) > -1;
  }

  ngOnDestroy(): void {
    this.tallyListObservable.unsubscribe();
  }
}