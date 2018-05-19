import { should } from 'fuse-test-runner'
import welcome from '../../src/utilities/welcome'

export class WelcomeToTheJungle {
  'Should be okay'() {
    const text = welcome()
    should(text).beString()
  }
}
