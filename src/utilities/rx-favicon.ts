import { bindCallback, Observable } from 'rxjs'
import { FaviconConfig } from './read-config'
import * as favs from 'favicons'

function callback(config: FaviconConfig) {
  return function(error: Error, response: favs.FavIconResponse) {
    return error
      ? (() => {
          throw error
        })()
      : response
  }
}

export function rxFavicons(config?: FaviconConfig) {
  const _config = {
    source: 'assets/logo.svg',
    configuration: {},
    ...config
  } as FaviconConfig

  return bindCallback(favs as any, callback(_config))(
    _config.source,
    _config.configuration
  ) as Observable<favs.FavIconResponse>
}
