import { Component, Input, OnInit } from '@angular/core';
import { Tally } from '../../../tally/types/Tally';

@Component({
  selector: 'app-history-summary',
  templateUrl: './history-summary.component.html',
  styleUrls: ['./history-summary.component.scss']
})
export class HistorySummaryComponent implements OnInit {

  @Input() tally!: Tally;
  resetIntervalText!: string;
 
  ngOnInit() {
    if(this.tally.resetInterval === 'daily'){
      this.resetIntervalText = 'dagligen';
    }
    else if(this.tally.resetInterval === 'weekly'){
      this.resetIntervalText = 'veckovis';
    }
    else if(this.tally.resetInterval === 'monthly'){
      this.resetIntervalText = 'månadsvis';
    }
  }
  
}
