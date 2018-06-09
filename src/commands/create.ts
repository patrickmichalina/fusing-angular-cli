import { prompt } from 'inquirer'
import { command } from 'yargs'
import { Subject } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { log, logError } from '../utilities/log'

command(
  'create',
  'create a new application',
  args => args,
  args => {
    create()
  }
)

// interface newAppConfigRespinse {
//   readonly fullname: string
//   readonly shortname: string
// }

interface QustionResponse {
  readonly name: string
  readonly answer: string | boolean
}

interface QuestionWrapper {
  readonly question: {
    readonly name: string
    readonly message: string
    readonly default: string
  }
  readonly answerHandler: (
    response: QustionResponse,
    stream: Subject<any>
  ) => void
}

const Q_FULL_NAME: QuestionWrapper = {
  question: {
    name: 'fullname',
    message: 'Application Full Name',
    default: 'fusing-angular-demo-app'
  },
  answerHandler: (response: QustionResponse, stream: Subject<any>) => {
    stream.next(Q_SHORT_NAME.question)
  }
}

const Q_SHORT_NAME = {
  question: {
    name: 'shortname',
    message: 'Application Short Name',
    default: 'fusing-ng'
  },
  answerHandler: (response: QustionResponse, stream: Subject<any>) => {
    stream.next(Q_APP_TYPE.question)
  }
}

const Q_APP_TYPE = {
  question: {
    type: 'confirm',
    name: 'isUniversalApp',
    message: 'Server rendered (Angular Universal)?'
  },
  answerHandler: (response: QustionResponse, stream: Subject<any>) => {
    // const isUniversal = response.answer as Boolean
    // console.log(isUniversal)
    stream.complete()
  }
}

const Q_TEST_RUNNERS = {
  question: {
    type: 'list',
    name: 'test-runner',
    message: 'Application Short Name',
    choices: [{ name: 'Jest', value: 'jest' }, { name: 'None' }]
  },
  answerHandler: (response: QustionResponse, stream: Subject<any>) => {
    stream.complete()
  }
}

const QUESTION_DICT = [
  Q_FULL_NAME,
  Q_SHORT_NAME,
  Q_TEST_RUNNERS,
  Q_APP_TYPE
].reduce(
  (acc, curr) => {
    return { ...acc, [curr.question.name]: curr }
  },
  {} as { readonly [key: string]: QuestionWrapper }
)

const source = new Subject<any>()
const prompts = source.pipe(startWith(Q_FULL_NAME.question))

function create() {
  log('Create an Angular application\n')
  const prm = prompt(prompts as any) as any
  prm.ui.process.subscribe(function(response: QustionResponse) {
    QUESTION_DICT[response.name].answerHandler(response, source)
  }, logError)

  // prompt([
  //   // {
  //   //   type: 'list',
  //   //   name: 'test-runner',
  //   //   message: 'E2E Test Runner',
  //   //   choices: [
  //   //     {
  //   //       name: 'Nightmare',
  //   //       value: 'nightmare',
  //   //       checked: true
  //   //     },
  //   //     {
  //   //       name: 'None'
  //   //     }
  //   //   ]
  //   // },
  //   // {
  //   //   type: 'list',
  //   //   name: 'deployments',
  //   //   message: 'Deployment Infrastructure',
  //   //   choices: [
  //   //     {
  //   //       name: 'Heroku',
  //   //       value: 'heroku',
  //   //       checked: true
  //   //     },
  //   //     {
  //   //       name: 'AWS Serverless',
  //   //       value: 'aws',
  //   //       disabled: 'in development'
  //   //     },
  //   //     {
  //   //       name: 'Google Cloud Serverless',
  //   //       value: 'gcloud',
  //   //       disabled: 'in development'
  //   //     },
  //   //     {
  //   //       name: 'None',
  //   //       value: 'none'
  //   //     }
  //   //   ]
  //   // },
  //   // {
  //   //   type: 'checkbox',
  //   //   name: 'ide',
  //   //   message: 'IDE Configurations',
  //   //   choices: [
  //   //     {
  //   //       name: 'Visual Studio Code',
  //   //       value: 'vscode',
  //   //       checked: true
  //   //     },
  //   //     {
  //   //       name: 'Webstorm',
  //   //       value: 'webstorm',
  //   //       disabled: 'unavailable, in development'
  //   //     }
  //   //   ]
  //   // },
  //   // {
  //   //   name: 'ga',
  //   //   message: 'Include Google Analytics?',
  //   //   type: 'expand',
  //   //   choices: [
  //   //     {
  //   //       name: 'Yes',
  //   //       value: 'true',
  //   //       key: 'y'
  //   //     },
  //   //     {
  //   //       key: 'n',
  //   //       name: 'No',
  //   //       value: 'false'
  //   //     },
  //   //   ]
  //   // },
  //   // {
  //   //   type: 'list',
  //   //   name: 'ui-lib',
  //   //   message: 'UI Library',
  //   //   choices: [
  //   //     {
  //   //       name: 'Angular Material',
  //   //       value: 'material',
  //   //       checked: false
  //   //     },
  //   //     {
  //   //       name: 'Bootstrap',
  //   //       value: 'bootstrap',
  //   //       checked: false
  //   //     },
  //   //     {
  //   //       name: 'Bulma',
  //   //       value: 'bulma',
  //   //       checked: false
  //   //     },
  //   //     {
  //   //       name: 'None',
  //   //       value: 'none',
  //   //       checked: true
  //   //     }
  //   //   ]
  //   // },
  //   // {
  //   //   type: 'checkbox',
  //   //   name: 'build',
  //   //   message: 'Features',
  //   //   choices: [
  //   //     {
  //   //       name: 'Enable Progressive Web App (PWA)',
  //   //       value: 'pwa',
  //   //       checked: false
  //   //     }
  //   //   ]
  //   // },
  //   // {
  //   //   type: 'checkbox',
  //   //   name: 'packages',
  //   //   message: 'Additional Packages',
  //   //   choices: [
  //   //     {
  //   //       name: 'Angular Flex-Layout',
  //   //       value: 'flex-layout',
  //   //       checked: false
  //   //     },
  //   //     {
  //   //       name: 'Firebase',
  //   //       value: 'firebase',
  //   //       checked: false
  //   //     },
  //   //     {
  //   //       name: 'Angularytics2',
  //   //       value: 'angularytics2',
  //   //       checked: false
  //   //     }
  //   //   ]
  //   // }
  // ])
  //   .then((res: newAppConfigRespinse) => {
  //     const path = resolve(res.fullname)
  //     pathExists_(path)
  //       .pipe(
  //         flatMap(exists => {
  //           if (exists) {
  //             logError(`An app already exists at ${path}`)
  //             return empty()
  //           } else {
  //             return mkDir_(resolve(res.fullname))
  //               .pipe(
  //                 flatMap(() => {
  //                   return generatePackageFile({
  //                     name: 'test',
  //                     dependencies: {
  //                       ...ANGULAR_UNIVERSAL_DEPS,
  //                       ...ANGULAR_UNIVERSAL_EXPRESS_DEPS
  //                     },
  //                     devDependencies: {
  //                       ...ANGULAR_CORE_DEV_DEPS,
  //                       ...ANGULAR_UNIVERSAL_DEV_DEPS
  //                     }
  //                   }, res.fullname)
  //                 }),
  //                 flatMap(() => forkJoin([
  //                   generateCoreAngular(res.fullname),
  //                   generateGitIgnore(path),
  //                   generateTsLint(path),
  //                   generateFngConfig(path)
  //                 ]))
  //               )
  //           }
  //         })
  //       )

  //       .subscribe((() => {
  //         load({
  //           global: false,
  //           prefix: res.fullname
  //         }, (err, npm) => {
  //           if (err) {
  //             logError(err.message)
  //           } else {
  //             const load = true
  //             load && commands.install([res.fullname], (err) => {
  //               if (err) {
  //                 logError(err.message)
  //               } else {
  //                 // generateCoreAngular(res.fullname).subscribe()
  //               }
  //             })
  //           }
  //         })
  //       }))
  //   })
  //   .catch(err => {
  //     logError(err)
  //     process.exit(0)
  //   })
}
