import { prompt } from 'inquirer'
import { logError } from '../../utils/log'
import createFolder from '../../utils/create-folder'
// import { lstatSync } from 'fs'

interface newAppConfigRespinse {
  readonly fullname: string
  readonly shortname: string
}

export default function () {
  console.log('Create a new Angular application\n')
  prompt([
    {
      name: 'fullname',
      message: 'Application Full Name',
      default: 'fusing-angular-demo-app'
    },
    {
      name: 'shortname',
      message: 'Application Short Name',
      default: 'fusing-ng'
    },
    {
      type: 'list',
      name: 'test-runner',
      message: 'Unit Test Runner',
      choices: [
        {
          name: 'Jest',
          value: 'jest'
        },
        {
          name: 'None'
        }
      ]
    },
    {
      type: 'list',
      name: 'test-runner',
      message: 'E2E Test Runner',
      choices: [
        {
          name: 'Nightmare',
          value: 'nightmare',
          checked: true
        },
        {
          name: 'None'
        }
      ]
    },
    {
      type: 'list',
      name: 'deployments',
      message: 'Deployment Infrastructure',
      choices: [
        {
          name: 'Heroku',
          value: 'heroku',
          checked: true
        },
        {
          name: 'None',
          value: 'none'
        },
        {
          name: 'AWS Serverless',
          value: 'aws',
          disabled: 'in development'
        },
        {
          name: 'Google Cloud Serverless',
          value: 'gcloud',
          disabled: 'in development'
        }
      ]
    },
    {
      type: 'checkbox',
      name: 'ide',
      message: 'IDE Configurations',
      choices: [
        {
          name: 'Visual Studio Code',
          value: 'vscode',
          checked: true
        },
        {
          name: 'Webstorm',
          value: 'webstorm',
          disabled: 'unavailable, in development'
        }
      ]
    },
    {
      name: 'ga',
      message: 'Include Google Analytics?',
      type: 'expand',
      choices: [
        {
          name: 'Yes',
          value: 'true',
          key: 'y'
        },
        {
          key: 'n',
          name: 'No',
          value: 'false'
        },
      ]
    },
    {
      type: 'checkbox',
      name: 'build',
      message: 'Features',
      choices: [
        {
          name: 'Enable Progressive Web App (PWA)',
          value: 'pwa',
          checked: false
        }
      ]
    },
    {
      type: 'checkbox',
      name: 'packages',
      message: 'Additional Packages',
      choices: [
        {
          name: 'Angular Material',
          value: 'material',
          checked: false,
          disabled: 'unavailable, in development'
        },
        {
          name: 'Angular Flex-Layout',
          value: 'material',
          checked: false,
          disabled: 'unavailable, in development'
        },
        {
          name: 'Firebase',
          value: 'firebase',
          checked: false,
          disabled: 'unavailable, in development'
        },
        {
          name: 'Angularytics2',
          value: 'angularytics2',
          checked: false,
          disabled: 'unavailable, in development'
        }
      ]
    }
  ])
    .then((res: newAppConfigRespinse) => {
      createFolder(res.fullname).subscribe()
    })
    .catch(err => {
      logError(err)
      process.exit(0)
    })
}