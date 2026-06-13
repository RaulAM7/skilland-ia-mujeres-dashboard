import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { APP_NAVIGATION_EVENT, normalizeAppPathname } from '@/lib/app-navigation'
import { Card, CardContent } from '@/components/ui/card'
import { DebugPage } from '@/features/ia-mujeres/pages/debug-page'
import { FunnelPage } from '@/features/ia-mujeres/pages/funnel-page'
import { OperationPage } from '@/features/ia-mujeres/pages/operation-page'
import { OverviewPage } from '@/features/ia-mujeres/pages/overview-page'
import { useIaMujeresSnapshot } from '@/features/ia-mujeres/hooks/use-ia-mujeres-snapshot'

export default function App() {
  const pathname = usePathname()
  const { data, loading, error, transportWarning } = useIaMujeresSnapshot()

  return (
    <AppLayout pathname={pathname}>
      {loading ? <LoadingState /> : null}
      {!loading && error && !data ? <ErrorState message={error} /> : null}
      {!loading && data && transportWarning ? <TransportWarningState message={transportWarning} /> : null}
      {!loading && data ? renderRoute(pathname, data) : null}
    </AppLayout>
  )
}

function renderRoute(route: string, snapshot: NonNullable<ReturnType<typeof useIaMujeresSnapshot>['data']>) {
  if (route === '/ia-mujeres/funnel') return <FunnelPage snapshot={snapshot} />
  if (route === '/ia-mujeres/operation') return <OperationPage snapshot={snapshot} />
  if (route === '/ia-mujeres/debug') return <DebugPage snapshot={snapshot} />
  return <OverviewPage snapshot={snapshot} />
}

function LoadingState() {
  return (
    <Card>
      <CardContent className="p-6 text-sm text-muted-foreground">Cargando snapshot mock...</CardContent>
    </Card>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-rose-200 bg-rose-50">
      <CardContent className="p-6 text-sm text-rose-800">{message}</CardContent>
    </Card>
  )
}

function TransportWarningState({ message }: { message: string }) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-6 text-sm text-amber-900">{message}</CardContent>
    </Card>
  )
}

function usePathname() {
  const [pathname, setPathname] = useState(() => normalizeAppPathname(window.location.pathname))

  useEffect(() => {
    const syncPathname = () => setPathname(normalizeAppPathname(window.location.pathname))

    const onPopState = () => syncPathname()
    const onAppNavigate = () => syncPathname()
    window.addEventListener('popstate', onPopState)
    window.addEventListener(APP_NAVIGATION_EVENT, onAppNavigate)

    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener(APP_NAVIGATION_EVENT, onAppNavigate)
    }
  }, [])

  return pathname
}
