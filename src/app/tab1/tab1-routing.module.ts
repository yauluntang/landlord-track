import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { StatusComponent } from './status';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
  {
    path: '/:id',
    component: Tab1Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
