import { Activity, BarChart3, Bug, ClipboardList, LayoutDashboard } from 'lucide-react'
import type { ReactNode } from 'react'
import { navigateAppTo, shouldHandleAppNavigation } from '@/lib/app-navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { href: '/ia-mujeres', label: 'Overview', icon: LayoutDashboard },
  { href: '/ia-mujeres/funnel', label: 'Funnel', icon: BarChart3 },
  { href: '/ia-mujeres/operation', label: 'Operacion', icon: ClipboardList },
  { href: '/ia-mujeres/debug', label: 'Debug', icon: Bug },
]

export function AppLayout({ children, pathname }: { children: ReactNode; pathname: string }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold">SkilLand</p>
                <p className="text-xs text-muted-foreground">IA Mujeres Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={(event) => {
                    if (!shouldHandleAppNavigation({ event, href: item.href, locationOrigin: window.location.origin })) {
                      return
                    }

                    event.preventDefault()
                    navigateAppTo(item.href)
                  }}
                  className={cn(
                    'flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors',
                    active && 'bg-muted text-foreground',
                    !active && 'hover:bg-muted/70 hover:text-foreground',
                  )}
                >
                  <Icon size={17} aria-hidden="true" />
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
            Mock mode. Read-only MVP.
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold">IA Mujeres</h1>
                <p className="text-sm text-muted-foreground">Centro de mando operativo del funnel</p>
              </div>
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Read-only
              </span>
            </div>
            <nav className="flex gap-2 overflow-x-auto lg:hidden">
              {navigation.map((item) => {
                const active = pathname === item.href
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={(event) => {
                      if (!shouldHandleAppNavigation({ event, href: item.href, locationOrigin: window.location.origin })) {
                        return
                      }

                      event.preventDefault()
                      navigateAppTo(item.href)
                    }}
                    className={cn(
                      'whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted-foreground',
                      active && 'bg-muted text-foreground',
                    )}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
