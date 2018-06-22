import { AboutRoutingModule } from './about-routing.module'
import { AboutComponent } from './about.component'
import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { MatButtonModule } from '@angular/material'

@NgModule({
  imports: [AboutRoutingModule, SharedModule, MatButtonModule],
  declarations: [AboutComponent],
  exports: [AboutComponent]
})
export class AboutModule {}
