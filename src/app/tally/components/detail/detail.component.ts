import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Tally } from '../../types/Tally';
import { TallyService } from '../../service/tally.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HistoryService } from '../../../history/service/history.service';
import { BaseTallyComponent } from 'src/app/shared/components/base-tally/base-tally.component';


@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BaseTallyComponent implements OnInit, OnDestroy {


  cleanHistoryModalData: Object = {};
  deleteModalData: Object = {};
  tally!: Tally;
  
  editMode = false;
  tallyObservable!: Subscription;

  @Output() tallyDelete = new EventEmitter<Tally>();


  constructor(
    protected override tallyService: TallyService,
    private route: ActivatedRoute,
    private router: Router,
    private historyService: HistoryService
  ) {
    super(tallyService);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tallyObservable = this.tallyService.getTallyById(params['id']).subscribe(tally => {
        this.tally = tally;
      });
    });

    this.recalculatePercentage(this.tally);
  }

  cleanHistory() {
    this.cleanHistoryModalData = {
      open: true,
      header: 'Radera historik',
      body: 'Är du säker på att du vill radera historiken.\n Det verkar som det finns ' + this.tally.getHistory().length + ' &#60;enhet&#62; historik',
      footer: ''
    }
  }

  cleanHistoryConfirmed(): void {
    this.historyService.cleanHistory(this.tally);
    this.cleanHistoryModalData = { open: false };
  }

  delete(): void {
    this.deleteModalData = {
      open: true,
      header: 'Radera räknare',
      body: 'Är du säker på att du vill radera demma räknare.\n Detta går inte att ångra?'
    }
  }

  deleteConfirmed(): void {
    this.tallyService.delete(this.tally);
    this.router.navigate(['/'], { queryParams: { type: 'success', message: 'Räknare borttagen' } });
  }

  toggleActive(): void {
    this.tally.setActive(!this.tally.getActive());
    this.tallyService.update(this.tally);
  }

  ngOnDestroy() {
    this.tallyObservable.unsubscribe();
  }
}
