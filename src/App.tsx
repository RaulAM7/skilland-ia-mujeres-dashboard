import { RotateCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { APP_NAVIGATION_EVENT, normalizeAppPathname } from '@/lib/app-navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DebugPage } from '@/features/ia-mujeres/pages/debug-page'
import { FunnelPage } from '@/features/ia-mujeres/pages/funnel-page'
import { OperationPage } from '@/features/ia-mujeres/pages/operation-page'
import { OverviewPage } from '@/features/ia-mujeres/pages/overview-page'
import { useIaMujeresSnapshot } from '@/features/ia-mujeres/hooks/use-ia-mujeres-snapshot'

export default function App() {
  const pathname = usePathname()
  const { data, loading, refreshing, error, transportWarning, reload } = useIaMujeresSnapshot()

  return (
    <AppLayout
      pathname={pathname}
      headerActions={
        <Button
          variant="secondary"
          disabled={loading || refreshing}
          onClick={() => {
            void reload()
          }}
        >
          <RotateCw className={cn('mr-2 size-4', refreshing && 'animate-spin')} aria-hidden="true" />
          {refreshing ? 'Actualizando...' : 'Recargar snapshot'}
        </Button>
      }
    >
      {loading ? <LoadingState /> : null}
      {!loading && data && error ? <InlineErrorState message={error} /> : null}
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

function InlineErrorState({ message }: { message: string }) {
  return (
    <Card className="border-rose-200 bg-rose-50">
      <CardContent className="p-4 text-sm text-rose-800">{message}</CardContent>
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
