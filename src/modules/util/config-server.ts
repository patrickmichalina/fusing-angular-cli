export function fngRawEnvironmentConfig<T>() {
  return JSON.parse(process.env.FUSING_ANGULAR || '{}') as T
}
