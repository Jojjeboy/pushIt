/* Modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './shared/modules/shared.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/* Components */
import { DetailComponent } from './tally/components/detail/detail.component';
import { ListComponent } from './tally/components/list/list.component';
import { ExampleComponent } from './example/example.component';
import { EditTallyHistoryComponent } from './history/components/edit-tally-history/edit-tally-history.component';
import { HistorySummaryComponent } from './shared/components/history-summary/history-summary.component';
import { UpsertTallyComponent } from './tally/components/upsert/upsert-tally.component';import { HistoryService } from './history/service/history.service';
import { HistoryGuardService } from './history/service/history-guard.service';
import { BaseTallyComponent } from './shared/components/base-tally/base-tally.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: { title: 'Start Page' }
  },
  {
    path: 'tally/:id',
    component: DetailComponent,
    data: { title: 'Tally details component' }
  },
  {
    path: 'example',
    component: ExampleComponent,
    data: { title: 'Add example' }
  },
  {
    path: 'add',
    component: UpsertTallyComponent,
    data: { title: 'Add Tally' }
  },
  {
    path: 'edit/:id',
    component: UpsertTallyComponent,
    data: { title: 'Edit Tally' }
  },
  {
    path: 'history/edit/:id',
    component: EditTallyHistoryComponent,
    canActivate: [HistoryGuardService],
    data: { title: 'Edit tally history' }
  },

  { path: '**', component: ListComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [
    ListComponent,
    DetailComponent,
    ExampleComponent,
    EditTallyHistoryComponent,
    HistorySummaryComponent,
    UpsertTallyComponent,
    BaseTallyComponent
  ],
    
  exports: [RouterModule]
})
export class AppRoutingModule { }