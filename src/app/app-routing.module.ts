import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuHeaderComponent } from './components_/menu-header/menu-header.component';

const routes: Routes = [
  {
    path: "",
    component: MenuHeaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
