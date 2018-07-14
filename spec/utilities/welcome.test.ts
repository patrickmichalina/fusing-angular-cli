import { should } from 'fuse-test-runner'
import { pathExistsDeep_ } from '../../src/utilities/rx-fs'
import { first } from 'rxjs/operators'
import { firebaseEnvConfigMap } from '../../src/generators/env.gen'
import welcome from '../../src/utilities/welcome'

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

  'maps firebase config'() {
    const mapped = firebaseEnvConfigMap({
      apiKey: 'MVa3fdsaWzxyfdEVdnhP',
      authDomain: 'firebaseapp.com',
      databaseUrl: 'firebaseio.com',
      messagingSenderId: 'consulting',
      projectId: 'appspot.com',
      storageBucket: '83984'
    })
    should(mapped).equal(`FNG_FIREBASE_API_KEY=MVa3fdsaWzxyfdEVdnhP
FNG_FIREBASE_AUTH_DOMAIN=firebaseapp.com
FNG_FIREBASE_DATABASE_URL=firebaseio.com
FNG_FIREBASE_PROJECT_ID=appspot.com
FNG_FIREBASE_STORAGE_BUCKET=83984
FNG_FIREBASE_MESSAGING_SENDER_ID=consulting`)
  }
}
