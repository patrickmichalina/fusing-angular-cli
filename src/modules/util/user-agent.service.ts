import { REQUEST } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { UAParser } from 'ua-parser-js'
import { Request } from 'express'
import { isPlatformServer } from '@angular/common'
import { WINDOW } from './tokens'

export interface IUserAgentService {
  readonly userAgent: () => IUAParser.IResult
  readonly isiPhone: () => boolean
  readonly isiPad: () => boolean
  readonly isMobile: () => boolean
  readonly isTablet: () => boolean
  readonly isDesktop: () => boolean
  readonly isChrome: () => boolean
  readonly isFirefox: () => boolean
  readonly isSafari: () => boolean
  readonly isIE: () => boolean
  readonly isIE7: () => boolean
  readonly isIE8: () => boolean
  readonly isIE9: () => boolean
  readonly isIE10: () => boolean
  readonly isIE11: () => boolean
  readonly isWindows: () => boolean
  readonly isWindowsXP: () => boolean
  readonly isWindows7: () => boolean
  readonly isWindows8: () => boolean
  readonly isMac: () => boolean
  readonly isChromeOS: () => boolean
  readonly isiOS: () => boolean
  readonly isAndroid: () => boolean
}

// tslint:disable:no-class
// tslint:disable:no-this
@Injectable()
export class UserAgentService implements IUserAgentService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(REQUEST) private req: Request,
    @Inject(WINDOW) private _window: Window
  ) {}

  public userAgent(): IUAParser.IResult {
    const ua = isPlatformServer(this.platformId)
      ? new UAParser(this.req.headers['user-agent'] as string | undefined)
      : new UAParser(this._window.navigator.userAgent)

    return ua.getResult()
  }

  isiPhone(): boolean {
    return this.userAgent().device.type === 'iPhone'
  }

  isiPad(): boolean {
    return this.userAgent().device.type === 'iPad'
  }

  isMobile(): boolean {
    return this.userAgent().device.type === 'mobile'
  }

  isTablet(): boolean {
    return this.userAgent().device.type === 'tablet'
  }

  isDesktop(): boolean {
    return !this.isTablet && !this.isMobile
  }

  isChrome(): boolean {
    return this.userAgent().browser.name === 'Chrome'
  }

  isFirefox(): boolean {
    return this.userAgent().browser.name === 'Firefox'
  }

  isSafari(): boolean {
    return this.userAgent().browser.name === 'Safari'
  }

  isIE(): boolean {
    return this.userAgent().browser.name === 'IE'
  }

  isIE7(): boolean {
    return this.isIE && this.userAgent().browser.major === '7'
  }

  isIE8(): boolean {
    return this.isIE && this.userAgent().browser.major === '8'
  }

  isIE9(): boolean {
    return this.isIE && this.userAgent().browser.major === '9'
  }

  isIE10(): boolean {
    return this.isIE && this.userAgent().browser.major === '10'
  }

  isIE11(): boolean {
    return this.isIE && this.userAgent().browser.major === '11'
  }

  isWindows(): boolean {
    return this.userAgent().os.name === 'Windows'
  }

  isWindowsXP(): boolean {
    return this.isWindows && this.userAgent().os.version === 'XP'
  }

  isWindows7(): boolean {
    return this.isWindows && this.userAgent().os.version === '7'
  }

  isWindows8(): boolean {
    return this.isWindows && this.userAgent().os.version === '8'
  }

  isMac(): boolean {
    return this.userAgent().os.name === 'Mac OS X'
  }

  isChromeOS(): boolean {
    return this.userAgent().os.name === 'Chromium OS'
  }

  isiOS(): boolean {
    return this.userAgent().os.name === 'iOS'
  }

  isAndroid(): boolean {
    return this.userAgent().os.name === 'Android'
  }
}
