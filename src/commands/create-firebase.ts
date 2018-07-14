import { QustionResponse, WorkingAnswersDictionary } from './create-common'
import { Subject } from 'rxjs'

export const Q_INCLUDE_FIREBASE = {
  question: {
    type: 'confirm',
    name: 'firebase',
    message: 'Are you using Firebase?',
    default: false
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    current.firebase
      ? stream.next(Q_FIREBASE_CONFIG_API_KEY.question)
      : stream.complete()
  }
}

export const Q_FIREBASE_CONFIG_API_KEY = {
  question: {
    type: 'input',
    name: 'firebaseApiKey',
    message: '\t[Firebase API Key]:'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_FIREBASE_CONFIG_AUTH_DOMAIN.question)
  }
}

export const Q_FIREBASE_CONFIG_AUTH_DOMAIN = {
  question: {
    type: 'input',
    name: 'firebaseAuthDomain',
    message: '\t[Firebase Auth Domain]:'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_FIREBASE_CONFIG_DATABASE_URL.question)
  }
}

export const Q_FIREBASE_CONFIG_DATABASE_URL = {
  question: {
    type: 'input',
    name: 'firebaseDatabaseUrl',
    message: '\t[Firebase Database URL]:'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_FIREBASE_CONFIG_PROJECT_ID.question)
  }
}

export const Q_FIREBASE_CONFIG_PROJECT_ID = {
  question: {
    type: 'input',
    name: 'firebaseProjectId',
    message: '\t[Firebase Project ID]:'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_FIREBASE_CONFIG_STORAGE_BUCKET.question)
  }
}

export const Q_FIREBASE_CONFIG_STORAGE_BUCKET = {
  question: {
    type: 'input',
    name: 'firebaseStorageBucket',
    message: '\t[Firebase Storage Bucket]:'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_FIREBASE_CONFIG_MESSAGING_SENDER_ID.question)
  }
}

export const Q_FIREBASE_CONFIG_MESSAGING_SENDER_ID = {
  question: {
    type: 'input',
    name: 'firebaseMesssagingSenderId',
    message: '\t[Firebase Messaging Sender ID]:'
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.next(Q_FIREBASE_CHOICES.question)
  }
}

export const Q_FIREBASE_CHOICES = {
  question: {
    type: 'checkbox',
    name: 'firebaseConfig',
    message: 'Which modules of Firebase to include?',
    choices: [
      {
        name: 'Reat Time Database (RTDB)',
        value: 'rtdb',
        checked: true
      },
      {
        name: 'Firestore',
        value: 'firestore',
        checked: true
      },
      {
        name: 'Auth',
        value: 'auth',
        checked: false
      }
    ]
  },
  answerHandler: (
    response: QustionResponse,
    current: WorkingAnswersDictionary,
    stream: Subject<any>
  ) => {
    stream.complete()
  }
}

export const Q_FIREBASE: ReadonlyArray<any> = [
  Q_INCLUDE_FIREBASE,
  Q_FIREBASE_CONFIG_API_KEY,
  Q_FIREBASE_CONFIG_AUTH_DOMAIN,
  Q_FIREBASE_CONFIG_DATABASE_URL,
  Q_FIREBASE_CONFIG_PROJECT_ID,
  Q_FIREBASE_CONFIG_STORAGE_BUCKET,
  Q_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  Q_FIREBASE_CHOICES
]
