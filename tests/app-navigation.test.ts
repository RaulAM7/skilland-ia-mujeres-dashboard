import { describe, expect, it, vi } from 'vitest'
import { APP_NAVIGATION_EVENT, navigateAppTo, normalizeAppPathname, shouldHandleAppNavigation } from '../src/lib/app-navigation'

describe('app navigation helpers', () => {
  it('normalizes the root path to the dashboard overview', () => {
    expect(normalizeAppPathname('/')).toBe('/ia-mujeres')
    expect(normalizeAppPathname('/ia-mujeres/funnel')).toBe('/ia-mujeres/funnel')
  })

  it('handles plain left-click internal navigation only', () => {
    expect(
      shouldHandleAppNavigation({
        event: { altKey: false, button: 0, ctrlKey: false, defaultPrevented: false, metaKey: false, shiftKey: false },
        href: '/ia-mujeres/funnel',
        locationOrigin: 'https://dashboard.example.com',
      }),
    ).toBe(true)

    expect(
      shouldHandleAppNavigation({
        event: { altKey: false, button: 0, ctrlKey: false, defaultPrevented: false, metaKey: true, shiftKey: false },
        href: '/ia-mujeres/funnel',
        locationOrigin: 'https://dashboard.example.com',
      }),
    ).toBe(false)

    expect(
      shouldHandleAppNavigation({
        event: { altKey: false, button: 0, ctrlKey: false, defaultPrevented: false, metaKey: false, shiftKey: false },
        href: 'https://external.example.com',
        locationOrigin: 'https://dashboard.example.com',
      }),
    ).toBe(false)
  })

  it('pushes state and emits an app navigation event only when the path changes', () => {
    const pushState = vi.fn()
    const replaceState = vi.fn()
    const dispatchEvent = vi.fn()

    expect(
      navigateAppTo('/ia-mujeres/funnel', {
        dispatchEvent,
        history: { pushState, replaceState },
        location: {
          hash: '',
          origin: 'https://dashboard.example.com',
          pathname: '/ia-mujeres',
          search: '',
        },
      }),
    ).toBe(true)

    expect(pushState).toHaveBeenCalledWith({}, '', '/ia-mujeres/funnel')
    expect(dispatchEvent).toHaveBeenCalledTimes(1)
    expect(dispatchEvent.mock.calls[0]?.[0]).toBeInstanceOf(Event)
    expect(dispatchEvent.mock.calls[0]?.[0]?.type).toBe(APP_NAVIGATION_EVENT)

    pushState.mockClear()
    dispatchEvent.mockClear()

    expect(
      navigateAppTo('/ia-mujeres/funnel', {
        dispatchEvent,
        history: { pushState, replaceState },
        location: {
          hash: '',
          origin: 'https://dashboard.example.com',
          pathname: '/ia-mujeres/funnel',
          search: '',
        },
      }),
    ).toBe(false)

    expect(pushState).not.toHaveBeenCalled()
    expect(dispatchEvent).not.toHaveBeenCalled()
  })

  it('treats query-string changes as a real navigation update', () => {
    const pushState = vi.fn()
    const replaceState = vi.fn()
    const dispatchEvent = vi.fn()

    expect(
      navigateAppTo('/ia-mujeres/operation?filter=manual_review', {
        dispatchEvent,
        history: { pushState, replaceState },
        location: {
          hash: '',
          origin: 'https://dashboard.example.com',
          pathname: '/ia-mujeres/operation',
          search: '',
        },
      }),
    ).toBe(true)

    expect(pushState).toHaveBeenCalledWith({}, '', '/ia-mujeres/operation?filter=manual_review')
    expect(dispatchEvent).toHaveBeenCalledTimes(1)
  })

  it('supports replaceState for transient filter updates', () => {
    const pushState = vi.fn()
    const replaceState = vi.fn()
    const dispatchEvent = vi.fn()

    expect(
      navigateAppTo(
        '/ia-mujeres/funnel?q=universidad',
        {
          dispatchEvent,
          history: { pushState, replaceState },
          location: {
            hash: '',
            origin: 'https://dashboard.example.com',
            pathname: '/ia-mujeres/funnel',
            search: '',
          },
        },
        { historyMode: 'replace' },
      ),
    ).toBe(true)

    expect(pushState).not.toHaveBeenCalled()
    expect(replaceState).toHaveBeenCalledWith({}, '', '/ia-mujeres/funnel?q=universidad')
    expect(dispatchEvent).toHaveBeenCalledTimes(1)
  })
})
