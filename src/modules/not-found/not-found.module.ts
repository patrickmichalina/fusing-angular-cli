import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NotFoundComponent } from './not-found.component'

export const routes: Routes = [{ path: '**', component: NotFoundComponent }]

// tslint:disable-next-line:no-class
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [NotFoundComponent],
  exports: [RouterModule, NotFoundComponent]
})
export class NotFoundRoutingModule {}
