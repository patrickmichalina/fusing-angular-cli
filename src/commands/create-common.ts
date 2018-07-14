import { Subject } from 'rxjs'

export enum IDE {
  VISUAL_STUDIO_CODE = 'Visual Studio Code',
  OTHER = 'Other'
}

export interface QustionResponse {
  readonly name: string
  readonly answer: string | boolean
}

export interface AnswersDictionary {
  readonly fullname: string
  readonly shortname?: string
  readonly ide?: IDE
  readonly firebase?: boolean
  readonly firebaseApiKey?: string
  readonly firebaseAuthDomain?: string
  readonly firebaseDatabaseUrl?: string
  readonly firebaseProjectId?: string
  readonly firebaseStorageBucket?: string
  readonly firebaseMesssagingSenderId?: string
  readonly firebaseModules?: ReadonlyArray<string>
}

export interface WorkingAnswersDictionary extends AnswersDictionary {
  readonly [key: string]: any
}

export interface QuestionWrapper {
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

export interface FirebaseConfig {
  readonly apiKey?: string
  readonly authDomain?: string
  readonly databaseUrl?: string
  readonly projectId?: string
  readonly storageBucket?: string
  readonly messagingSenderId?: string
}
