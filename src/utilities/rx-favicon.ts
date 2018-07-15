import { bindCallback, Observable } from 'rxjs'
import { FaviconConfig } from './read-config'
import { resolve } from 'path'
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
    source:
      (config && resolve(config.source)) || resolve('src/app/favicon.svg'),
    configuration: {
      path: '/assets/favicons',
      ...(config && config.config)
    }
  } as any

  return bindCallback(favs as any, callback(_config))(
    _config.source,
    _config.configuration
  ) as Observable<favs.FavIconResponse>
}
