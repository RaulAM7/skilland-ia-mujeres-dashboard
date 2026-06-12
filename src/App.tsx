import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { DebugPage } from '@/features/ia-mujeres/pages/debug-page'
import { FunnelPage } from '@/features/ia-mujeres/pages/funnel-page'
import { OperationPage } from '@/features/ia-mujeres/pages/operation-page'
import { OverviewPage } from '@/features/ia-mujeres/pages/overview-page'
import { useIaMujeresSnapshot } from '@/features/ia-mujeres/hooks/use-ia-mujeres-snapshot'

export default function App() {
  const pathname = usePathname()
  const { data, loading, error } = useIaMujeresSnapshot()
  const route = pathname === '/' ? '/ia-mujeres' : pathname

  return (
    <AppLayout pathname={route}>
      {loading ? <LoadingState /> : null}
      {!loading && error ? <ErrorState message={error} /> : null}
      {!loading && data ? renderRoute(route, data) : null}
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

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return pathname
}
