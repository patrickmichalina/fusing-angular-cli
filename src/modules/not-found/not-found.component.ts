import { Component, ChangeDetectionStrategy } from '@angular/core'
// import { ResponseService } from '../response/browser'

// tslint:disable-next-line:no-class
@Component({
  selector: 'not-found',
  template: '<h2>Page Not Found</h2>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
  // constructor(rs: ResponseService) {
  // rs.notFound()
  // }
}
