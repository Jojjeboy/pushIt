import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { TallyService } from 'src/app/tally/service/tally.service';
import { Tally } from '../../tally/types/Tally';

@Injectable({
  providedIn: 'root'
})
export class HistoryGuardService implements CanActivate {

  tallyObservable!: Subscription;

  constructor(
    private tallyService: TallyService,
    private router: Router) {

  }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let reset: boolean = false;
    this.tallyObservable = this.tallyService.getTallyById(activatedRouteSnapshot.params['id']).subscribe((tally: Tally) => {
      reset = tally.getCanReset();
    });

    if (!reset) {
      this.router.navigate(['/tally/' + activatedRouteSnapshot.params['id']], { queryParams: { type: 'danger', message: 'Du har inte tillåtelse att redigera historiken!' } });
    }

    return reset;
  }
}
