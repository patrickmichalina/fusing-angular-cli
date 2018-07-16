export interface IResponseService {
  readonly set: (code: number, message?: string) => void
  readonly ok: (message?: string) => void
  readonly badRequest: (message?: string) => void
  readonly unauthorized: (message?: string) => void
  readonly paymentRequired: (message?: string) => void
  readonly forbidden: (message?: string) => void
  readonly notFound: (message?: string) => void
  readonly error: (message?: string) => void
  readonly notImplemented: (message?: string) => void
}
