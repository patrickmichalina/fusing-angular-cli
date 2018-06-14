import { prompt } from 'inquirer'
import { command } from 'yargs'
import { Subject, BehaviorSubject, of, forkJoin } from 'rxjs'
import {
  startWith,
  shareReplay,
  first,
  map,
  tap,
  flatMap,
  filter,
  take
} from 'rxjs/operators'
import { log, logError, logInfoWithBackground } from '../utilities/log'
import { pathExists_, mkDirAndContinueIfExists_ } from '../utilities/rx-fs'
import { resolve } from 'path'
import { generateCoreAngular } from '../generators/angular-core.gen'
import generateGitIgnore from '../generators/gitignore.gen'
import generateTsLint from '../generators/tslint.gen'
import generateFngConfig from '../generators/config.gen'
import clearTerminal from '../utilities/clear'
import generatePackageFile from '../generators/package.gen'
import {
  ANGULAR_UNIVERSAL_DEPS,
  ANGULAR_UNIVERSAL_EXPRESS_DEPS,
  ANGULAR_CORE_DEV_DEPS,
  ANGULAR_UNIVERSAL_DEV_DEPS
} from '../generators/deps.const'

command(
  'create [overwrite]',
  'create a new application',
  args => args,
  args => {
    const force = args.o || false
    create(force)
  }
).option('overwrite', {
  alias: 'o',
  description: 'Overwrite existing application folder'
})

interface QustionResponse {
  readonly name: string
  readonly answer: string | boolean
}

interface AnswersDictionary {
  readonly fullname: string
}

interface WorkingAnswersDictionary {
  readonly [key: string]: any
  readonly fullname?: string
}

interface QuestionWrapper {
  readonly question: {
    readonly name: string
    readonly message: string
    readonly default: string
  }
  readonly answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => void
}

const Q_FULL_NAME: QuestionWrapper = {
  question: {
    name: 'fullname',
    message: 'Application Full Name',
    default: 'fusing-angular-demo-app'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_SHORT_NAME.question)
  }
}

const Q_SHORT_NAME = {
  question: {
    name: 'shortname',
    message: 'Application Short Name',
    default: 'fusing-ng'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_APP_TYPE.question)
  }
}

const Q_APP_TYPE = {
  question: {
    type: 'confirm',
    name: 'isUniversalApp',
    message: 'Server rendered (Angular Universal)?'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
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
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
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
const finalConfigSource = new Subject()
const collector = new BehaviorSubject<WorkingAnswersDictionary>({})
const prompts = source.pipe(
  startWith(Q_FULL_NAME.question),
  shareReplay()
)
const finalConfig_ = finalConfigSource.pipe(
  map(() => collector.getValue()),
  first()
)

interface IntermediateModel {
  readonly config: AnswersDictionary
  readonly shouldTerminate: boolean
}

function displayGeneratingAppText() {
  logInfoWithBackground('Generating App....\n')
}

function displayWarningApplicationAlreadyExists(res: IntermediateModel) {
  res.shouldTerminate && logError('Application already exists. exiting')
}

function mapWorkingAnswersToFinal(config: WorkingAnswersDictionary) {
  return {
    ...config
  } as AnswersDictionary
}

function checkConfigAndCanProceed(res: IntermediateModel): boolean {
  return !res.shouldTerminate
}

function toEnsureProjectDirectoryExists(mdl: IntermediateModel) {
  return mkDirAndContinueIfExists_(resolve(mdl.config.fullname))
}

function checkIfProjectPathExists(overwrite: boolean) {
  return function(config: AnswersDictionary) {
    return overwrite ? of(false) : pathExists_(config.fullname)
  }
}

function projectPathCheckToIntermediateModel(
  config: AnswersDictionary,
  shouldTerminate: boolean
) {
  return {
    config,
    shouldTerminate
  }
}

function genNpmPackageJson(name: string, overwrite = false) {
  return generatePackageFile(
    {
      name,
      dependencies: {
        ...ANGULAR_UNIVERSAL_DEPS,
        ...ANGULAR_UNIVERSAL_EXPRESS_DEPS
      },
      devDependencies: {
        ...ANGULAR_CORE_DEV_DEPS,
        ...ANGULAR_UNIVERSAL_DEV_DEPS
      }
    },
    overwrite,
    name
  )
}

function create(overwriteExisting = false) {
  log('Create an Angular application\n')
  const prm = prompt(prompts as any) as any
  prm.ui.process.subscribe(
    function(response: QustionResponse) {
      const merged = {
        ...collector.getValue(),
        ...Object.keys(response).reduce(acc => {
          return {
            ...acc,
            [response.name]: response.answer
          }
        }, {})
      }
      collector.next(merged)
      QUESTION_DICT[response.name].answerHandler(response, merged, source)
    },
    logError,
    () => finalConfigSource.next()
  )

  // Once we have our final configuration for the app, lets go through the build steps
  finalConfig_
    .pipe(
      tap(clearTerminal),
      tap(displayGeneratingAppText),
      map(mapWorkingAnswersToFinal),
      flatMap(
        checkIfProjectPathExists(overwriteExisting),
        projectPathCheckToIntermediateModel
      ),
      tap(displayWarningApplicationAlreadyExists),
      filter(checkConfigAndCanProceed),
      flatMap(toEnsureProjectDirectoryExists, im => im),
      flatMap(im => {
        const path = resolve(im.config.fullname)
        return forkJoin([
          genNpmPackageJson(im.config.fullname, overwriteExisting),
          generateCoreAngular(im.config.fullname),
          generateGitIgnore(path, overwriteExisting),
          generateTsLint(path, overwriteExisting),
          generateFngConfig(path, overwriteExisting)
        ])
      }),
      take(1)
    )
    .subscribe(res => {
      // logInfoWithBackground('MADE IT')
    })

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
