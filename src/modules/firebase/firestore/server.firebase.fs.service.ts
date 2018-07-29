import { TransferState } from '@angular/platform-browser'
import { Injectable, Inject, Optional } from '@angular/core'
import { AngularFirestore, QueryFn } from 'angularfire2/firestore'
import { map, tap, take } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'
import {
  IUniversalFirestoreService,
  extractFsHostFromLib
} from './browser.firebase.fs.common'
import {
  FIREBASE_USER_AUTH_TOKEN,
  LRU_CACHE,
  LruCache,
  attemptToCacheInLru,
  attemptToGetLruCachedValue,
  getFullUrl
} from '../common/server'
import {
  removeHttpInterceptorCache,
  cacheInStateTransfer,
  getParams
} from '../common/browser'
import {
  makeFirestoreStateTransferKey,
  constructFsUrl
} from './server.firebase.fs.common'
import { sha1 } from 'object-hash'

interface Field {
  readonly [key: string]: any
}

interface FieldPath {
  readonly segments: ReadonlyArray<any>
  readonly offset: number
  readonly len: number
}

interface HttpResponseDocument {
  readonly name: string
  readonly fields: Field
}

interface HttpResponseDocumentWrapper {
  readonly document: HttpResponseDocument
}

interface OrderBy {
  readonly field: any
  readonly dir: any
  readonly isKeyOrderBy: boolean
}

interface RelationFilter {
  readonly field: FieldPath
  readonly op: { readonly name: string }
  readonly value: Object
}

function mapOrderBy(ordBy: OrderBy) {
  return {
    field: {
      fieldPath: ordBy.field.segments.pop()
    },
    direction: ordBy.dir.name
      ? ordBy.dir.name === 'desc'
        ? 'DESCENDING'
        : 'ASCENDING'
      : 'DIRECTION_UNSPECIFIED'
  }
}

function mapOrderByCollection(ordBy: ReadonlyArray<OrderBy>) {
  return ordBy.map(a => mapOrderBy(a))
}

function coerceType(type: string, value: any): any {
  switch (type) {
    case 'booleanValue':
      return value
    case 'stringValue':
      return value
    case 'integerValue':
      return +value
    case 'arrayValue':
      return (value.values as ReadonlyArray<any>).map(obj => {
        return Object.keys(obj).reduce((acc, curr, idx) => {
          return coerceType(curr, obj[curr])
        }, {})
      })
    case 'mapValue':
      return reduceFields(value.fields)
    case 'nullValue':
      return undefined
    default:
      return undefined
  }
}

function reduceFields<T>(fields: Field) {
  return Object.keys(fields).reduce((acc, curr) => {
    const converted = extractFieldType(fields[curr]) as any
    const innerKey = Object.keys(converted).pop()
    return {
      ...acc,
      [curr]: innerKey && converted[innerKey]
    }
  }, {}) as T
}

function extractFieldType(obj: any) {
  return Object.keys(obj).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: coerceType(curr, obj[curr])
    }
  }, {})
}

function getOpName(str: string) {
  switch (str) {
    case '==':
      return 'EQUAL'
    case '>':
      return 'GREATER_THAN'
    case '<':
      return 'LESS_THAN'
    case '>=':
      return 'GREATER_THAN_OR_EQUAL'
    case '<=':
      return 'LESS_THAN_OR_EQUAL'
  }
}

function lowerStrFirst(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function mapFilterToFieldFilter(filter: RelationFilter) {
  return {
    fieldFilter: {
      field: { fieldPath: filter.field.segments.join('/') },
      op: getOpName(filter.op.name),
      value: {
        [lowerStrFirst(filter.value.constructor.name)]: (filter.value as any)
          .internalValue
      }
    }
  }
}

function composeFilter(filters: ReadonlyArray<any>) {
  return {
    compositeFilter: {
      op: 'AND',
      filters
    }
  }
}

// tslint:disable:no-this
// tslint:disable-next-line:no-class
@Injectable()
export class ServerUniversalFirestoreService
  implements IUniversalFirestoreService {
  constructor(
    private http: HttpClient,
    private ts: TransferState,
    public afs: AngularFirestore,
    @Optional()
    @Inject(FIREBASE_USER_AUTH_TOKEN)
    private authToken?: string,
    @Optional()
    @Inject(LRU_CACHE)
    private lru?: LruCache
  ) {}

  universalDoc<T>(path: string) {
    const url = constructFsUrl(extractFsHostFromLib(this.afs), path)
    const params = getParams({ auth: this.authToken })
    const cacheKey = getFullUrl(url, params)
    const tsKey = makeFirestoreStateTransferKey(url)
    const cachedValue = attemptToGetLruCachedValue<T>(cacheKey, this.lru)

    return cachedValue
      ? of(cachedValue).pipe(tap(cacheInStateTransfer(this.ts, tsKey)))
      : this.http.get<HttpResponseDocument>(url).pipe(
          take(1),
          map(res => res.fields),
          map<Field, T>(reduceFields),
          tap(removeHttpInterceptorCache(this.ts, cacheKey)),
          tap(cacheInStateTransfer(this.ts, tsKey)),
          tap(attemptToCacheInLru(cacheKey, this.lru))
        )
  }

  universalCollection<T>(path: string, queryFn?: QueryFn) {
    const url = constructFsUrl(extractFsHostFromLib(this.afs), undefined, true)
    const tsKey = makeFirestoreStateTransferKey(url)
    const ref = this.afs.firestore.collection(path)
    const query = (queryFn && queryFn(ref as any)) || ref
    const limit = (query as any)._query.limit
    const filters = (query as any)._query.filters as ReadonlyArray<
      RelationFilter
    >
    const orderBy = (query as any)._query.explicitOrderBy as ReadonlyArray<
      OrderBy
    >
    const cacheKey = sha1({ ...(query as any)._query, path })
    const cachedValue = attemptToGetLruCachedValue<T>(cacheKey, this.lru)
    const fieldFilters = filters.map(mapFilterToFieldFilter)
    const where = composeFilter(fieldFilters)

    const structuredQuery = {
      limit,
      from: [{ collectionId: path }],
      orderBy: mapOrderByCollection(orderBy),
      where
    }

    const fbToken = undefined //TODO: this.auth.getCustomFirebaseToken()
    const baseObs =
      fbToken !== undefined
        ? this.http.post(
            url,
            { structuredQuery },
            { headers: { Authorization: `Bearer ${fbToken}` } }
          )
        : this.http.post(url, { structuredQuery })

    return cachedValue
      ? of(cachedValue).pipe(tap(cacheInStateTransfer(this.ts, tsKey)))
      : baseObs.pipe(
          take(1),
          map((docs: ReadonlyArray<HttpResponseDocumentWrapper>) => {
            return docs.filter(a => a.document).map(doc => {
              return reduceFields(doc.document.fields) as T
            }) as ReadonlyArray<T>
          }),
          tap(cacheInStateTransfer(this.ts, tsKey)),
          tap(attemptToCacheInLru(cacheKey, this.lru))
        )
  }
}
