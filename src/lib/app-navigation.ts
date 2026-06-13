export const APP_NAVIGATION_EVENT = 'app:navigate'

type NavigationClickEvent = {
  altKey: boolean
  button: number
  ctrlKey: boolean
  defaultPrevented: boolean
  metaKey: boolean
  shiftKey: boolean
}

type NavigateDependencies = {
  dispatchEvent(event: Event): boolean
  history: {
    pushState(data: unknown, unused: string, url?: string | URL | null): void
    replaceState(data: unknown, unused: string, url?: string | URL | null): void
  }
  location: {
    hash: string
    origin: string
    pathname: string
    search: string
  }
}

export function normalizeAppPathname(pathname: string) {
  return pathname === '/' ? '/ia-mujeres' : pathname
}

export function shouldHandleAppNavigation(params: {
  event: NavigationClickEvent
  href: string
  locationOrigin: string
  target?: string
}) {
  const { event, href, locationOrigin, target } = params

  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
    return false
  }

  if (target && target !== '_self') {
    return false
  }

  const url = new URL(href, locationOrigin)
  return url.origin === locationOrigin
}

export function navigateAppTo(
  href: string,
  dependencies: NavigateDependencies = getBrowserNavigationDependencies(),
  options?: { historyMode?: 'push' | 'replace' },
) {
  const targetUrl = new URL(href, dependencies.location.origin)
  const currentUrl = `${dependencies.location.pathname}${dependencies.location.search}${dependencies.location.hash}`
  const nextUrl = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`

  if (currentUrl === nextUrl) {
    return false
  }

  const historyMethod = options?.historyMode === 'replace' ? dependencies.history.replaceState : dependencies.history.pushState
  historyMethod.call(dependencies.history, {}, '', nextUrl)
  dependencies.dispatchEvent(new Event(APP_NAVIGATION_EVENT))
  return true
}

function getBrowserNavigationDependencies(): NavigateDependencies {
  const browser = globalThis as typeof globalThis & {
    dispatchEvent(event: Event): boolean
    history: NavigateDependencies['history']
    location: NavigateDependencies['location']
  }

  return {
    dispatchEvent: browser.dispatchEvent.bind(browser),
    history: browser.history,
    location: browser.location,
  }
}
