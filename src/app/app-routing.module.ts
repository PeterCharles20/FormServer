import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SortComponent} from './sort/sort.component';

const routes: Routes = [
    { path: '', redirectTo: 'form/:id', pathMatch: 'full' },
    { path: 'form/:id', component: SortComponent },
];

@NgModule({
  imports: [
      [ RouterModule.forRoot(routes)]
  ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
