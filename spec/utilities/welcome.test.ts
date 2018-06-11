import { should } from 'fuse-test-runner'
import welcome from '../../src/utilities/welcome'
import { pathExistsDeep_ } from '../../src/utilities/rx-fs'
import { first } from 'rxjs/operators'

// tslint:disable-next-line:no-class
export class WelcomeToTheJungle {
  'should be okay'() {
    const text = welcome()
    should(text).beString()
  }

  'should return non-existing paths array'(done) {
    pathExistsDeep_('src/assets_no_exist/no_exist')
      .pipe(first())
      .subscribe(paths => {
        should(paths).haveLength(2)
        should(new RegExp(/src\/assets_no_exist/g).test(paths[0])).beTrue()
        should(
          new RegExp(/src\/assets_no_exist\/no_exist/g).test(paths[1])
        ).beTrue()
        done()
      })
  }
}
