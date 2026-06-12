# WHAT IS THIS REPO ABOUT

# Skilland IA Mujeres Dashboard

## 0. Resumen ejecutivo

Este repositorio existe para construir una dashboard operativa, interna y desplegable en Vercel para el proyecto **SkilLand IA Mujeres / Mujeres, IA y el Futuro del Trabajo**.

La dashboard debe permitir que el equipo vea, en tiempo casi real o con refresco controlado, el estado del funnel comercial/institucional del proyecto: oportunidades, entidades contactadas, envíos realizados, respuestas recibidas, bounces, contactos en revisión, tareas pendientes, follow-ups, reuniones propuestas, reuniones agendadas y próximos pasos operativos.

La decisión arquitectónica principal es:

> La dashboard vive en un repo separado, desplegado en Vercel, y genera su propio snapshot consultando el CRM desplegado vía API.
> No esperamos que el repo del CRM genere un JSON estático para que la dashboard lo consuma.

Es decir:

```text
Dashboard en Vercel
  → API propia de la dashboard
  → CRM/Twenty desplegado
  → datos reales del funnel
  → snapshot generado por la dashboard
  → UI shadcn-admin
```

Este repo no es el CRM.
Este repo no sustituye al CRM.
Este repo no ejecuta campañas de email.
Este repo no modifica contactos ni oportunidades por defecto.
Este repo es una capa de visualización, reporting operativo y coordinación para el equipo.

La fuente de verdad de los datos sigue siendo el CRM desplegado, especialmente Twenty CRM y los campos/custom objects/tareas que se hayan creado para el proyecto IA Mujeres.

---

## 1. Nombre de trabajo

Nombre recomendado del repo:

```text
skilland-ia-mujeres-dashboard
```

Otras variantes posibles:

```text
screenland-ia-mujeres-dashboard
skiland-ia-mujeres-dashboard
ia-mujeres-funnel-dashboard
skilland-funnel-dashboard
```

Nombre funcional del producto:

```text
SkilLand IA Mujeres Dashboard
```

Nombre interno corto:

```text
IA Mujeres Dashboard
```

Este documento utilizará como nombre canónico:

```text
Skilland IA Mujeres Dashboard
```

---

## 2. Por qué existe este repo

El proyecto IA Mujeres tiene varias capas:

1. **Capa estratégica y de oferta**

   * Funnel Academy.
   * Documentos de posicionamiento.
   * ICPs.
   * Narrativa del proyecto.
   * Oferta institucional.
   * Secuencia de emails.
   * Mapa de funnel.

2. **Capa operativa CRM/GWS**

   * CRM/Twenty.
   * Contactos, compañías y oportunidades.
   * Estados del funnel.
   * Emails/drafts/envíos.
   * Bounces.
   * Replies.
   * Tareas humanas.
   * Follow-ups.
   * Weekly report.
   * Scripts de ejecución o auditoría.

3. **Capa de visualización y seguimiento**

   * Dashboard para equipo.
   * KPIs.
   * Funnel.
   * Estado por organización.
   * Batches.
   * Alertas.
   * Tareas.
   * Próximas acciones.
   * Salud operativa del proceso.

Este repo corresponde a la tercera capa.

La razón de separar este repo es que la dashboard tiene necesidades diferentes al CRM:

* Debe tener una UI cuidada.
* Debe poder desplegarse rápido.
* Debe poder iterarse sin tocar el fork/monorepo del CRM.
* Debe tener su propio ciclo de producto.
* Debe poder usar shadcn-admin como base visual.
* Debe poder tener API server-side propia en Vercel.
* Debe poder cachear snapshots.
* Debe poder evolucionar hacia un panel más amplio de reporting comercial/institucional.

---

## 3. Qué problema resuelve

Ahora mismo el equipo puede tener información repartida en:

* CRM.
* Gmail/GWS.
* scripts.
* reports Markdown.
* outputs locales.
* notas de seguimiento.
* weekly reports.
* conversaciones internas.
* tareas manuales.
* decisiones de siguiente acción.

Eso está bien durante la fase inicial de ejecución, pero cuando el funnel crece se vuelve incómodo responder rápido a preguntas como:

* ¿Cuántas entidades tenemos en el funnel?
* ¿Cuántas están sin contactar?
* ¿Cuántas recibieron el primer email?
* ¿Cuántas respondieron?
* ¿Cuántas están en revisión manual?
* ¿Cuántos bounces tenemos?
* ¿Qué organizaciones requieren acción humana?
* ¿Qué follow-ups vencen hoy?
* ¿Cuántas reuniones están propuestas?
* ¿Cuántas reuniones están agendadas?
* ¿Dónde está bloqueado el funnel?
* ¿Qué debe hacer hoy el equipo?
* ¿Qué ha cambiado desde la última revisión?
* ¿Qué organizaciones públicas/privadas están calientes?
* ¿Qué ICP responde mejor?
* ¿Qué batch de envío ha funcionado mejor?
* ¿Qué parte del proceso se está quedando sin atención?

La dashboard existe para convertir todo eso en una vista simple, accionable y compartida.

---

## 4. Principio central de arquitectura

El principio central es:

```text
El CRM produce y guarda el estado real.
La dashboard consulta el CRM.
La API de la dashboard genera un snapshot.
La UI pinta el snapshot.
```

No queremos que el frontend hable directamente con el CRM.

No queremos exponer tokens del CRM en el navegador.

No queremos depender de que el repo del CRM genere manualmente ficheros estáticos.

No queremos meter UI de dashboard dentro del repo del CRM.

No queremos que cada visualización obligue a ejecutar scripts locales.

La arquitectura elegida es:

```text
Browser
  ↓
Dashboard React / shadcn-admin
  ↓
GET /api/ia-mujeres/snapshot
  ↓
Vercel Function
  ↓
CRM/Twenty API
  ↓
buildIaMujeresSnapshot()
  ↓
JSON normalizado
  ↓
UI
```

---

## 5. Decisión clave: dashboard-owned snapshot

La decisión explícita es que el snapshot pertenece a la dashboard.

Eso significa:

```text
NO:
CRM repo genera dashboard_snapshot.json
Dashboard lee dashboard_snapshot.json del repo CRM

SÍ:
Dashboard API consulta CRM desplegado
Dashboard API calcula snapshot
Dashboard UI pinta snapshot
```

Nombre conceptual:

```text
Dashboard-owned snapshot
```

La dashboard tiene su propia función server-side:

```text
/api/ia-mujeres/snapshot
```

Esa función:

1. autentica o valida la petición si aplica;
2. consulta el CRM/Twenty;
3. trae opportunities, tasks, companies, people y/o custom fields necesarios;
4. normaliza campos;
5. calcula métricas;
6. construye un snapshot;
7. cachea el resultado si procede;
8. devuelve JSON a la UI.

---

## 6. Qué significa “snapshot”

Un snapshot es una representación compacta, normalizada y pensada para UI del estado del funnel IA Mujeres en un momento concreto.

No es un dump completo del CRM.

No debería incluir información innecesaria.

No debería incluir cuerpos completos de emails.

No debería incluir secretos.

No debería incluir datos personales si no son necesarios para la vista.

Debe ser suficientemente rico para alimentar la dashboard sin que cada componente tenga que saber cómo funciona Twenty o el CRM por dentro.

Ejemplo conceptual:

```json
{
  "schemaVersion": "1.0",
  "generatedAt": "2026-06-12T10:30:00.000Z",
  "source": {
    "crm": "twenty",
    "workspace": "skilland",
    "campaign": "ia-mujeres"
  },
  "totals": {
    "opportunities": 100,
    "notSent": 70,
    "email1Sent": 30,
    "sentWithoutBounce": 28,
    "bouncesDetected": 2,
    "repliesDetected": 0,
    "manualReview": 2,
    "openTasks": 30,
    "overdueTasks": 0,
    "followupsPending": 30
  },
  "funnelStages": [],
  "tasks": [],
  "alerts": [],
  "batches": []
}
```

---

## 7. Fuente de verdad

La fuente de verdad debe ser el CRM desplegado.

En este proyecto, el CRM relevante es el entorno de Skilland basado en Twenty CRM.

El contexto operativo previo vive en:

```text
https://github.com/Skilland-ai/skilland-crm/tree/main/04_outputs/ia_mujeres_crm_execution
```

Ese directorio es importante como fuente de contexto, decisiones, nombres de campos, stage mapping, weekly reporting y lógica operativa, pero no debe ser tratado como runtime principal de la dashboard.

La dashboard no debería depender de leer directamente ficheros del repo CRM salvo que sea una solución transitoria para desarrollo local o mock data.

La regla es:

```text
Dato en CRM/Twenty → la dashboard lo puede consultar por API.

Dato solo en ficheros locales del repo CRM → no forma parte del runtime estable hasta que se sincronice o se exponga.
```

---

## 8. Repos relacionados

### 8.1. Repo de scaffolding

Base de trabajo:

```text
https://github.com/RaulAM7/basic-scaffolding
```

Este repo aporta la estructura de trabajo, documentación, specs, outputs y harness para trabajar con agentes/codex/claude.

La dashboard debe construirse usando esa filosofía de trabajo.

Estructura esperada:

```text
00_inbox/
01_harness/
02_context/
03_specs/
04_outputs/
05_scratch/
shared/
```

Este repo nuevo debe ser simultáneamente:

1. un repo de producto/software desplegable;
2. un repo con contexto y specs para trabajar con agentes.

### 8.2. Repo Funnel Academy

Contexto estratégico:

```text
https://github.com/RaulAM7/funnel-and-offer-academy/tree/master/04_outputs/ia-mujeres-funnel
```

Este repo contiene el contexto estratégico del funnel IA Mujeres: oferta, ICP, copy, funnel map, secuencias, orientación, decisiones comerciales y estado del proyecto desde la perspectiva de funnel/oferta.

No debe ser el runtime de la dashboard.

Debe usarse como contexto de negocio y producto.

### 8.3. Repo CRM

Contexto operativo:

```text
https://github.com/Skilland-ai/skilland-crm/tree/main/04_outputs/ia_mujeres_crm_execution
```

Este repo contiene la ejecución CRM/GWS: stage mapping, arquitectura CRM/Gmail, weekly report, estado operativo, batch plans, auditorías y outputs de ejecución.

No debe ser donde viva la UI de la dashboard.

Sí debe usarse para entender:

* qué campos existen;
* cómo se nombran los stages;
* cómo se interpreta el funnel;
* qué métricas ya se calculan;
* qué tareas existen;
* qué datos viven en CRM vs ficheros locales;
* qué gaps de datos puede tener la dashboard.

### 8.4. shadcn-admin

Base UI propuesta:

```text
https://github.com/satnaing/shadcn-admin
```

Este proyecto sirve como referencia visual y base de dashboard.

Debe usarse con criterio:

* no como dependencia conceptual intocable;
* no como cárcel de arquitectura;
* sí como base UI madura para acelerar;
* sí como referencia de layout, sidebar, tablas, cards, theme y páginas.

---

## 9. Qué debe contener este repo

Este repo debe contener:

1. documentación fundacional;
2. decisiones de arquitectura;
3. contrato de datos;
4. mock snapshots;
5. implementación de dashboard;
6. API server-side;
7. cliente CRM/Twenty;
8. normalización de datos;
9. componentes UI;
10. deployment Vercel;
11. configuración de entorno;
12. tests básicos de contrato;
13. documentación para futuras iteraciones.

Estructura recomendada:

```text
skilland-ia-mujeres-dashboard/

  WHAT_IS_THIS_REPO_ABOUT.md

  00_inbox/
    source_links.md
    raw_notes.md

  01_harness/
    RULES.md
    STACK.md
    TASKFLOW.md
    AGENT_NOTES.md

  02_context/
    BRIEF.md
    BUSINESS_CONTEXT.md
    CRM_CONTEXT.md
    FUNNEL_CONTEXT.md
    GLOSSARY.md
    LINKS.md
    CONSTRAINTS.md
    OPEN_QUESTIONS.md

  03_specs/
    now/
      ia-mujeres-dashboard-mvp.md
    backlog.md
    decisions.md

  04_outputs/
    architecture/
      dashboard_architecture.md
      data_flow.md
      security_model.md
    data_contract/
      dashboard_snapshot_contract.md
      mock_snapshot.json
    ux/
      pages_and_components.md
      dashboard_wireframe_notes.md

  05_scratch/
    experiments/
    crm-api-probes/
    shadcn-admin-notes/

  shared/
    skills/
    agents/
    prompts/

  src/
    features/
      ia-mujeres/
        pages/
        components/
        hooks/
        types/

    components/
    routes/
    lib/

  api/
    ia-mujeres/
      snapshot.ts
      refresh.ts
    webhooks/
      twenty.ts

  server/
    crm/
      twenty-client.ts
      twenty-queries.ts
      crm-types.ts

    ia-mujeres/
      build-snapshot.ts
      normalize-opportunities.ts
      normalize-tasks.ts
      metrics.ts
      snapshot-schema.ts
      stage-mapping.ts

  public/
    mock-data/

  package.json
  vite.config.ts
  vercel.json
  .env.example
  README.md
```

---

## 10. Qué NO es este repo

Este repo no es:

* el CRM;
* el sistema de envío de emails;
* el sistema de scraping;
* el sistema de enriquecimiento de contactos;
* el gestor principal de oportunidades;
* el repositorio de estrategia del funnel;
* el lugar donde viven los datos maestros;
* una base de datos principal;
* un sistema de automatización comercial completo;
* un reemplazo de Twenty;
* un reemplazo de Gmail;
* un reemplazo del weekly report;
* un repo para modificar contactos reales sin control;
* una herramienta de ejecución masiva de acciones destructivas.

La dashboard puede evolucionar en el futuro hacia acciones, pero el MVP debe ser principalmente read-only.

---

## 11. Read-only por defecto

Principio de seguridad:

```text
La dashboard es read-only por defecto.
```

Primera versión:

* leer datos;
* mostrar métricas;
* mostrar tareas;
* mostrar alertas;
* mostrar estado del funnel;
* permitir refresh manual;
* permitir navegación visual.

No debe:

* cambiar stages;
* enviar emails;
* crear tareas;
* editar contactos;
* modificar opportunities;
* crear drafts;
* ejecutar batch sends;
* borrar información.

Cualquier capacidad de escritura futura debe diseñarse de forma explícita, con permisos, confirmaciones, logs y rollback mental.

---

## 12. Tecnología objetivo

### 12.1. Frontend

Base:

```text
React
Vite
TypeScript
shadcn/ui
shadcn-admin
Tailwind
TanStack Router o el router que traiga shadcn-admin
TanStack Query si encaja
Recharts o librería equivalente si ya viene en la base
```

### 12.2. Backend ligero

```text
Vercel Functions
TypeScript
server-side fetch
CRM/Twenty API client
Zod para schemas si encaja
```

### 12.3. Deployment

```text
Vercel
```

### 12.4. Cache futura

Opciones posibles:

```text
Vercel KV
Upstash Redis
Vercel Blob
Postgres/Neon
Edge Config
```

Para el MVP se puede empezar sin storage persistente o con cache HTTP simple, pero la arquitectura debe estar preparada para cachear snapshots.

### 12.5. Auth

Para MVP interno:

* Vercel Deployment Protection;
* Basic Auth si se implementa;
* o protección por SSO más adelante.

La dashboard no debe quedar públicamente abierta si contiene datos internos.

---

## 13. Variables de entorno

Ejemplo de `.env.example`:

```env
# CRM / Twenty
CRM_BASE_URL=https://crm.example.com
CRM_API_KEY=replace_me
CRM_WORKSPACE_ID=replace_me_if_needed

# Dashboard
DASHBOARD_ENV=local
DASHBOARD_REFRESH_SECRET=replace_me
CRON_SECRET=replace_me

# Optional cache
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Optional auth
DASHBOARD_BASIC_AUTH_USER=
DASHBOARD_BASIC_AUTH_PASSWORD=
```

Reglas:

```text
Nunca usar VITE_CRM_API_KEY.
Nunca exponer tokens del CRM al navegador.
Nunca commitear .env real.
```

El frontend solo debe consumir:

```text
/api/ia-mujeres/snapshot
```

---

## 14. API interna de la dashboard

### 14.1. GET /api/ia-mujeres/snapshot

Endpoint principal.

Responsabilidad:

* consultar CRM;
* construir snapshot;
* devolver JSON normalizado;
* cachear si aplica;
* manejar errores;
* devolver último snapshot válido si existe y el CRM falla.

Respuesta conceptual:

```json
{
  "schemaVersion": "1.0",
  "generatedAt": "2026-06-12T10:30:00.000Z",
  "status": "ok",
  "totals": {},
  "funnelStages": [],
  "tasks": [],
  "alerts": [],
  "batches": []
}
```

### 14.2. POST or GET /api/ia-mujeres/refresh

Endpoint para forzar refresh.

Puede protegerse mediante secret.

Uso:

* botón admin;
* Vercel Cron;
* webhook;
* debug controlado.

### 14.3. POST /api/webhooks/twenty

Endpoint futuro para recibir cambios del CRM/Twenty.

Uso:

* invalidar cache;
* regenerar snapshot;
* marcar snapshot como stale;
* registrar última actualización.

Este endpoint no es obligatorio para el MVP.

---

## 15. Cliente CRM/Twenty

La dashboard necesita una capa server-side para hablar con CRM/Twenty.

Archivo conceptual:

```text
server/crm/twenty-client.ts
```

Responsabilidades:

* montar headers;
* leer `CRM_BASE_URL`;
* leer `CRM_API_KEY`;
* ejecutar queries;
* paginar;
* manejar errores;
* normalizar respuesta técnica;
* no filtrar lógica de negocio demasiado arriba.

Ejemplo conceptual:

```ts
export async function twentyGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  // server-side only
}
```

No se debe importar este cliente desde código frontend.

---

## 16. Build snapshot

Archivo conceptual:

```text
server/ia-mujeres/build-snapshot.ts
```

Responsabilidad:

```text
raw CRM data → normalized dashboard snapshot
```

Debe ser una función pura en la medida de lo posible.

Entradas:

* opportunities;
* tasks;
* people;
* companies;
* custom fields;
* maybe email events if exposed;
* maybe CRM metadata.

Salida:

* dashboard snapshot.

Ejemplo conceptual:

```ts
export function buildIaMujeresSnapshot(input: RawIaMujeresData): IaMujeresDashboardSnapshot {
  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    totals: buildTotals(input),
    funnelStages: buildFunnelStages(input),
    tasks: buildTasks(input),
    alerts: buildAlerts(input),
    batches: buildBatches(input),
  }
}
```

---

## 17. Stage mapping

La dashboard debe respetar el stage mapping operativo del proyecto IA Mujeres.

Estados esperados, sujetos a validación real en CRM:

```text
NOT_SENT
DRAFT_CREATED
EMAIL_1_SENT
REPLY_RECEIVED
MEETING_PROPOSED
MEETING_SCHEDULED
WRONG_CONTACT_MANUAL_REVIEW
BOUNCED
FOLLOWUP_1_DUE
FOLLOWUP_1_SENT
CLOSED_NO_RESPONSE
CLOSED_NOT_RELEVANT
```

No todos los estados tienen por qué existir en MVP.

La dashboard debe poder mostrar estados desconocidos de forma segura:

```text
UNKNOWN_STAGE
```

Si aparece un stage no mapeado, no debe romper.

Debe generar alerta:

```text
Hay oportunidades con stage no reconocido.
```

---

## 18. Métricas principales

### 18.1. Overview

Métricas de cabecera:

```text
Total oportunidades IA Mujeres
Sin contactar
Draft creado
Email 1 enviado
Enviados sin bounce
Bounces
Replies
Reuniones propuestas
Reuniones agendadas
Revisión manual
Tareas abiertas
Tareas vencidas
Follow-ups pendientes
```

### 18.2. Funnel

Métricas por stage:

```text
stage key
stage label
count
percentage
order
color semantic optional
```

Ejemplo:

```json
{
  "key": "EMAIL_1_SENT",
  "label": "Email 1 enviado",
  "count": 30,
  "percentage": 30,
  "order": 30
}
```

### 18.3. Operación

Métricas operativas:

```text
tareas abiertas
tareas vencidas
tareas para hoy
manual reviews
contactos incorrectos
follow-ups vencidos
follow-ups próximos
organizaciones sin siguiente acción
```

### 18.4. Engagement

Métricas de respuesta:

```text
replies detectadas
reply rate
bounce rate
meeting proposed rate
meeting scheduled rate
```

### 18.5. Batches

Si los datos existen:

```text
batchId
sentAt
sentCount
bounceCount
replyCount
status
notes
```

Si no existen en CRM, Batches puede quedar como vista futura o mock.

---

## 19. Pages de la dashboard

### 19.1. Overview

La pantalla principal.

Debe responder:

```text
¿Cómo va el funnel ahora mismo?
¿Qué ha pasado?
Qué tenemos pendiente?
Dónde hay bloqueo?
Qué toca hacer hoy?
```

Componentes:

* KPI cards;
* funnel summary;
* alerts panel;
* next actions;
* recent activity;
* tasks due;
* manual review list.

### 19.2. Funnel

Vista más detallada por stage.

Componentes:

* gráfico por stage;
* tabla de opportunities;
* filtros por stage;
* filtros por ICP/tipo de entidad;
* búsqueda por organización;
* columnas relevantes;
* estado de siguiente acción.

### 19.3. Operación / Tasks

Vista para trabajar.

Componentes:

* tareas abiertas;
* tareas vencidas;
* follow-ups;
* manual review;
* contactos incorrectos;
* organizaciones sin owner;
* organizaciones sin próxima acción.

### 19.4. Batches

Vista de envíos/tandas.

Componentes:

* lista de batches;
* enviados por batch;
* bounces;
* replies;
* estado de monitorización;
* notas de calidad.

Puede ser fase 2 si los datos no están accesibles.

### 19.5. Entidades / Organizations

Vista por entidad.

Componentes:

* entidad;
* tipo;
* territorio;
* stage;
* último contacto;
* próxima acción;
* owner;
* notas.

Puede ser una tabla filtrable.

### 19.6. Settings / Debug

Vista interna técnica.

Componentes:

* última regeneración de snapshot;
* CRM base URL;
* schema version;
* número de registros leídos;
* warnings;
* errores de API;
* botón refresh;
* raw snapshot collapsible en local/dev.

No debe mostrar secretos.

---

## 20. UI y diseño

Base visual:

```text
shadcn-admin
```

Principios:

* limpia;
* operativa;
* elegante;
* rápida de leer;
* no recargada;
* más producto SaaS que informe estático;
* énfasis en acción, no solo reporting;
* modo claro/oscuro si viene dado por la base;
* sidebar clara;
* navegación por secciones;
* cards de KPIs;
* tablas potentes;
* filtros simples;
* alertas accionables.

Tono visual:

```text
Dashboard ejecutiva-operativa.
No BI corporativo pesado.
No Excel con maquillaje.
No CRM duplicado.
```

La dashboard debe sentirse como:

```text
“Centro de mando del funnel IA Mujeres”
```

---

## 21. Prioridades de producto

### Fase 1: MVP real

Objetivo:

```text
Ver datos reales del CRM desplegado en una UI funcional.
```

Incluye:

* repo creado;
* scaffolding base;
* shadcn-admin integrado;
* Vercel deploy;
* `/api/ia-mujeres/snapshot`;
* conexión CRM/Twenty;
* overview;
* funnel;
* tasks simples;
* mock fallback;
* `.env.example`;
* documentación.

No incluye:

* escritura en CRM;
* edición de opportunities;
* envíos de email;
* auth compleja;
* histórico avanzado;
* forecast;
* IA de análisis;
* integración Gmail directa si no está en CRM.

### Fase 2: Operación avanzada

Incluye:

* cache persistente;
* refresh manual;
* webhook CRM/Twenty;
* batches;
* alerts avanzadas;
* métricas de conversión;
* histórico de snapshots;
* comparación semana a semana;
* export a report.

### Fase 3: Intelligence layer

Incluye:

* recomendaciones;
* detectar bloqueos;
* sugerir next actions;
* resumir replies;
* priorizar oportunidades calientes;
* “qué debería hacer hoy el equipo”;
* evolución por ICP;
* análisis de copy/segmento.

### Fase 4: Write-back controlado

Solo si se decide.

Incluye:

* marcar tarea completada;
* cambiar owner;
* crear follow-up;
* añadir nota;
* proponer stage update;
* nunca acciones masivas sin confirmación.

---

## 22. Pregunta clave: ¿hay que tocar el repo CRM?

Regla:

```text
Para arrancar: NO tocar el repo skilland-crm.
```

Primero se intenta todo desde el repo dashboard:

```text
Dashboard → Vercel Function → CRM/Twenty API
```

Solo se toca `skilland-crm` si:

1. una métrica crítica vive solo en ficheros locales;
2. falta un campo en Twenty;
3. el stage mapping no está sincronizado;
4. hay que persistir eventos Gmail en CRM;
5. se necesita un endpoint read-only específico;
6. la API de Twenty no expone cómodamente lo necesario;
7. hay que añadir webhooks desde CRM;
8. hay que formalizar contrato de datos desde el CRM.

Ejemplos de datos que podrían exigir tocar CRM:

```text
gmailThreadId
gmailMessageId
lastBatchId
lastEmailEventAt
bounceReason
replyDetectedAt
followupDueAt
manualReviewReason
copyVariant
subIcp
```

Si esos campos ya están en Twenty, no hay que tocar repo CRM.

---

## 23. Relación con weekly report

El weekly report actual es útil y no debe desaparecer.

La dashboard no lo sustituye en fase 1.

Relación ideal:

```text
Weekly report = narrativa semanal para humanos.
Dashboard = estado operativo vivo.
```

En el futuro ambos deberían compartir lógica conceptual:

```text
metrics → weekly report
metrics → dashboard snapshot
```

Pero dado que esta dashboard será dashboard-owned, no depende de que el weekly report genere su snapshot.

---

## 24. Mock data

El repo debe incluir mock data para desarrollo sin CRM.

Archivo:

```text
public/mock-data/ia-mujeres-snapshot.mock.json
```

o:

```text
04_outputs/data_contract/mock_snapshot.json
```

Uso:

* desarrollar UI sin token CRM;
* testing local;
* demos;
* fallback visual;
* contratos con agentes.

La mock data debe parecer realista, pero no debe contener datos personales reales innecesarios.

---

## 25. Contrato de snapshot propuesto

Tipo conceptual:

```ts
export type IaMujeresDashboardSnapshot = {
  schemaVersion: string
  generatedAt: string
  status: 'ok' | 'stale' | 'partial' | 'error'

  source: {
    crmProvider: 'twenty' | 'custom' | 'mock'
    crmBaseUrl?: string
    campaignKey: string
    recordsRead?: number
    lastSuccessfulRefreshAt?: string
  }

  totals: {
    opportunities: number
    companies: number
    people: number

    notSent: number
    draftCreated: number
    email1Sent: number
    sentWithoutBounce: number
    bouncesDetected: number
    repliesDetected: number

    meetingProposed: number
    meetingScheduled: number

    manualReview: number
    openTasks: number
    overdueTasks: number
    dueTodayTasks: number
    followupsPending: number
  }

  funnelStages: Array<{
    key: string
    label: string
    count: number
    percentage: number
    order: number
  }>

  kpiCards: Array<{
    key: string
    title: string
    value: string | number
    helper?: string
    trend?: {
      direction: 'up' | 'down' | 'flat'
      value: number
      label: string
    }
  }>

  alerts: Array<{
    id: string
    level: 'info' | 'warning' | 'critical'
    title: string
    description: string
    actionLabel?: string
    href?: string
  }>

  tasks: Array<{
    id: string
    title: string
    status: string
    dueAt?: string
    owner?: string
    relatedOpportunity?: {
      id: string
      name: string
    }
    relatedCompany?: {
      id: string
      name: string
    }
  }>

  opportunities: Array<{
    id: string
    name: string
    companyName?: string
    stage: string
    stageLabel: string
    owner?: string
    lastContactAt?: string
    nextActionAt?: string
    nextActionLabel?: string
    manualReviewReason?: string
    territory?: string
    entityType?: string
    icp?: string
  }>

  batches?: Array<{
    id: string
    label: string
    sentAt?: string
    sentCount: number
    bounceCount: number
    replyCount: number
    status: string
  }>

  warnings: Array<{
    code: string
    message: string
    count?: number
  }>
}
```

---

## 26. Error handling

La dashboard debe gestionar errores con madurez.

Casos:

```text
CRM no disponible
API key incorrecta
rate limit
timeout
schema inesperado
campo faltante
stage desconocido
sin datos
snapshot stale
cache corrupta
```

La UI debe poder mostrar:

```text
No se pudo actualizar el snapshot.
Mostrando último dato disponible.
Última actualización correcta: X.
Error técnico: Y.
```

No debe romper toda la pantalla por un campo nulo.

---

## 27. Performance

No queremos que cada usuario que abre la dashboard dispare queries pesadas contra el CRM.

Estrategia:

### MVP

```text
HTTP cache-control
memoization simple durante vida de función si aplica
timeout razonable
limit de registros
paginación controlada
```

### Fase 2

```text
KV/Redis/Blob
snapshot persistente
stale-while-revalidate
webhook invalidation
manual refresh
cron fallback
```

Regla:

```text
La UI pide snapshot.
La API decide si recalcula o devuelve cache.
```

---

## 28. Seguridad

Principios:

```text
No tokens en frontend.
No datos sensibles innecesarios.
No cuerpos de email.
No secrets en logs.
No escritura en CRM en MVP.
Dashboard protegida.
API interna con controles.
```

Variables sensibles:

```text
CRM_API_KEY
CRM_BASE_URL if private
DASHBOARD_REFRESH_SECRET
CRON_SECRET
KV tokens
```

Nunca usar:

```text
VITE_CRM_API_KEY
```

porque cualquier variable VITE puede quedar expuesta al bundle frontend.

---

## 29. Datos personales y privacidad

La dashboard debe aplicar minimización de datos.

Mostrar solo lo necesario.

Ejemplo:

* Para KPIs no hace falta mostrar emails personales.
* Para tabla operativa quizá basta con organización, stage y next action.
* Para revisión manual quizá puede hacer falta persona/contacto, pero con cuidado.
* Para debug nunca mostrar cuerpos completos de emails.
* Para logs nunca imprimir API keys.

El proyecto trabaja con entidades públicas, organizaciones, asociaciones, contactos institucionales y potencialmente datos personales de personas de contacto. Aunque sea un proyecto B2B/B2G, debe tratarse con prudencia.

---

## 30. UX de “qué toca hoy”

Una de las vistas más importantes no es solo reporting.

Es una vista de acción:

```text
Qué toca hoy
```

Debe responder:

* follow-ups vencidos;
* organizaciones calientes;
* replies pendientes de responder;
* contactos en revisión manual;
* tareas sin owner;
* oportunidades bloqueadas;
* entidades estratégicas sin contacto;
* bounces a resolver;
* reuniones a confirmar.

Esta vista debe ser corta, accionable y priorizada.

Ejemplo:

```text
1. Revisar 2 contactos en WRONG_CONTACT_MANUAL_REVIEW.
2. Ejecutar follow-up 1 para 30 entidades si venció la ventana.
3. Confirmar si hay replies nuevas en Gmail/CRM.
4. Priorizar entidades públicas con mayor fit.
5. Actualizar oportunidades sin próxima acción.
```

---

## 31. Tipos de entidades

La dashboard debe estar preparada para clasificar oportunidades por tipo.

Tipos posibles:

```text
cabildo
ayuntamiento
área de igualdad
área de empleo
área de emprendimiento
cámara de comercio
asociación empresarial
organización pública
fundación
entidad privada
partner estratégico
otro
```

Esto puede venir de CRM o inferirse si no existe campo.

No inventar inferencias agresivas si no hay dato.

---

## 32. ICP y segmentación

La dashboard debería poder mostrar, ahora o en fase futura:

```text
ICP
sub-ICP
territorio
tipo de entidad
prioridad
copy variant
línea de colaboración propuesta
```

Ejemplos de líneas:

```text
acción inicial de divulgación gratuita
proyecto a medida
formación IA para mujeres
programa de empleabilidad
programa para emprendedoras
colaboración institucional
```

---

## 33. Diferencia entre datos reales, derivados y heurísticos

El snapshot debe distinguir mentalmente tres tipos de dato:

### 33.1. Datos reales

Vienen directamente del CRM.

Ejemplo:

```text
stage
owner
task status
company name
opportunity id
```

### 33.2. Datos derivados

Calculados desde datos reales.

Ejemplo:

```text
count by stage
reply rate
bounce rate
overdue tasks
```

### 33.3. Datos heurísticos

Inferidos por lógica imperfecta.

Ejemplo:

```text
probable bounce
posible reply
contacto incorrecto
organización caliente
```

Las heurísticas deben marcarse como tales si afectan decisiones.

---

## 34. Logging

La API debe loggear lo mínimo necesario.

Logs útiles:

```text
snapshot generation started
crm records fetched
snapshot generated ok
snapshot generation failed
unknown stage found
missing required field
cache hit
cache miss
```

No loggear:

```text
API keys
cuerpos de email
datos personales extensos
payloads completos sin necesidad
```

---

## 35. Testing

Tests mínimos recomendados:

```text
build-snapshot.test.ts
stage-mapping.test.ts
snapshot-schema.test.ts
twenty-client mock test
```

Casos:

* sin oportunidades;
* stages desconocidos;
* tasks vencidas;
* datos incompletos;
* bounces;
* replies;
* manual review;
* CRM error;
* snapshot partial.

No hace falta sobredimensionar testing en MVP, pero sí proteger el contrato de snapshot.

---

## 36. Desarrollo local

Debe poder arrancarse sin acceso CRM usando mock data.

Comandos esperados:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

Modo local con mock:

```env
DASHBOARD_DATA_MODE=mock
```

Modo local con CRM:

```env
DASHBOARD_DATA_MODE=crm
CRM_BASE_URL=...
CRM_API_KEY=...
```

El código debe permitir alternar.

---

## 37. Deployment en Vercel

El repo debe estar preparado para Vercel.

Archivos:

```text
vercel.json
.env.example
```

Necesidades:

* configurar build command;
* configurar output dir si aplica;
* configurar variables;
* proteger deployment;
* configurar dominio si aplica;
* configurar preview deployments.

---

## 38. Auth de dashboard

Fase 1 puede usar protección simple.

Opciones:

```text
Vercel Deployment Protection
Basic Auth custom
Auth.js
Clerk
Google OAuth
```

No decidir de más en MVP salvo que sea necesario.

Pero el documento debe dejar claro:

```text
La dashboard no debe quedar pública si muestra datos reales.
```

---

## 39. Backlog inicial

### Must have

```text
Repo creado con scaffolding
Documento WHAT_IS_THIS_REPO_ABOUT.md
Context files
App shadcn-admin funcionando
Deploy Vercel
Endpoint snapshot
Cliente CRM/Twenty
Mock snapshot
Overview page
Funnel page
Tasks/Operation page básica
.env.example
README de arranque
```

### Should have

```text
Refresh manual
Cache básica
Alerts panel
Unknown stage warning
Debug panel
Schema validation
Stage mapping centralizado
```

### Could have

```text
Batches page
Webhook Twenty
Historical snapshots
Week-over-week trends
Export report
Role-based views
```

### Won't have in MVP

```text
Enviar emails
Editar CRM
Acciones masivas
IA recomendadora
Full BI histórico
Gmail directo
Scraping
```

---

## 40. Primera especificación que debería generarse después

Después de este documento, el siguiente paso debe ser pedir a Codex/Claude que genere un plan de implementación.

La spec debería llamarse algo como:

```text
03_specs/now/2026-06-12_ia_mujeres_dashboard_mvp_implementation_plan.md
```

Debe responder:

* stack final;
* instalación shadcn-admin;
* estructura exacta;
* rutas;
* endpoints;
* tipos;
* mock data;
* contrato snapshot;
* queries CRM/Twenty;
* fases de implementación;
* comandos;
* riesgos;
* preguntas abiertas;
* criterios de aceptación.

No debe implementar a ciegas sin plan.

---

## 41. Criterios de aceptación del MVP

El MVP se considera útil cuando:

1. el repo arranca localmente;
2. la UI base carga correctamente;
3. existe una ruta dashboard IA Mujeres;
4. existe `/api/ia-mujeres/snapshot`;
5. el endpoint puede devolver mock data;
6. el endpoint puede, con env vars reales, consultar CRM/Twenty;
7. la dashboard pinta métricas reales o mock;
8. los errores se muestran sin romper UI;
9. las API keys no están en frontend;
10. el repo despliega en Vercel;
11. existe documentación clara para siguiente iteración.

---

## 42. Filosofía de implementación

No sobreingenierizar al principio.

Prioridad:

```text
1. Repo limpio.
2. Contexto perfecto.
3. Mock funcionando.
4. UI bonita.
5. API snapshot.
6. CRM real.
7. Cache.
8. Histórico.
9. Webhooks.
10. Inteligencia.
```

Evitar:

```text
meter demasiadas páginas
resolver auth enterprise antes de ver datos
hacer BI pesado
duplicar CRM
meter escritura en MVP
crear dependencia con ficheros del repo CRM
hardcodear stages por todos lados
mezclar lógica UI y lógica CRM
```

---

## 43. Principios de código

```text
Server-only para credenciales.
Tipos compartidos para snapshot.
Funciones puras para métricas.
Stage mapping centralizado.
Componentes UI tontos cuando sea posible.
Hooks para fetch.
Errores explícitos.
Mocks realistas.
Sin PII innecesaria.
Sin acciones destructivas.
```

---

## 44. Posibles nombres de carpetas de feature

```text
src/features/ia-mujeres/
```

Dentro:

```text
components/
hooks/
pages/
types/
utils/
```

Ejemplo:

```text
src/features/ia-mujeres/components/kpi-card.tsx
src/features/ia-mujeres/components/funnel-stage-chart.tsx
src/features/ia-mujeres/components/tasks-table.tsx
src/features/ia-mujeres/components/alerts-panel.tsx
src/features/ia-mujeres/hooks/use-ia-mujeres-snapshot.ts
src/features/ia-mujeres/pages/overview-page.tsx
src/features/ia-mujeres/types/dashboard-snapshot.ts
```

---

## 45. Posibles nombres de server modules

```text
server/crm/twenty-client.ts
server/crm/twenty-queries.ts
server/crm/twenty-normalizers.ts

server/ia-mujeres/build-snapshot.ts
server/ia-mujeres/metrics.ts
server/ia-mujeres/stage-mapping.ts
server/ia-mujeres/snapshot-schema.ts
server/ia-mujeres/mock-snapshot.ts
```

---

## 46. Preguntas abiertas para la siguiente iteración

Estas preguntas deben resolverse durante el plan de implementación, no necesariamente antes de crear el repo:

1. ¿Cuál será el nombre final del repo?
2. ¿El CRM desplegado está accesible públicamente por HTTPS?
3. ¿La API será Twenty GraphQL, REST o endpoint custom?
4. ¿Existe ya API key con permisos read-only?
5. ¿Qué campos exactos existen en opportunities?
6. ¿Cómo se identifica que una opportunity pertenece al funnel IA Mujeres?
7. ¿Existe `iaMujeresFunnelStage` como campo real?
8. ¿Dónde viven las tasks?
9. ¿Las replies y bounces están sincronizadas a CRM o solo en eventos locales?
10. ¿Queremos dashboard protegida desde el primer deploy?
11. ¿Qué datos puede ver todo el equipo?
12. ¿Qué datos solo puede ver admin?
13. ¿Hay que mostrar nombres de contactos o basta con organización?
14. ¿Cuál será la frecuencia de refresco deseada?
15. ¿Necesitamos histórico desde el MVP?
16. ¿Queremos botón “refresh now”?
17. ¿Queremos que el dashboard sea solo IA Mujeres o multi-campaign en futuro?

---

## 47. Riesgos

### 47.1. Datos no disponibles en CRM

El mayor riesgo es que algunas métricas vivan solo en ficheros locales del repo CRM.

Mitigación:

```text
MVP con métricas disponibles.
Listar gaps.
Sincronizar campos o crear endpoint después.
```

### 47.2. API key demasiado permisiva

Mitigación:

```text
usar key read-only si existe
guardar solo en Vercel env
no exponer frontend
rotar si se filtra
```

### 47.3. Dashboard pública

Mitigación:

```text
deployment protection
auth básica
no PII en snapshot
```

### 47.4. Acoplamiento a nombres de campos

Mitigación:

```text
centralizar mapping
schema validation
warnings
no romper si falta campo
```

### 47.5. UI bonita pero poco accionable

Mitigación:

```text
priorizar “qué toca hoy”
no solo KPIs vanity
filtros operativos
alerts accionables
```

---

## 48. Decisiones ya tomadas

```text
Repo separado: sí.
Deploy Vercel: sí.
Base UI shadcn-admin: sí.
Dashboard-owned snapshot: sí.
Frontend directo al CRM: no.
Tokens en navegador: no.
Repo CRM genera snapshot: no.
CRM como fuente de verdad: sí.
Read-only MVP: sí.
Tocar skilland-crm al principio: no, salvo gaps.
Usar basic-scaffolding como armazón de trabajo: sí.
```

---

## 49. Decisiones no tomadas todavía

```text
Nombre final del repo.
Auth final.
Cache final.
Si habrá histórico desde MVP.
Si se usará GraphQL o REST de Twenty.
Qué campos exactos tendrá el snapshot v1.
Si habrá webhook desde Twenty en fase 1 o fase 2.
Si habrá Vercel KV/Blob/Redis desde el principio.
```

---

## 50. Cómo debe leer este repo un agente

Un agente que entre a este repo debe entender:

1. No está construyendo un CRM.
2. Está construyendo una dashboard de funnel IA Mujeres.
3. La dashboard se despliega en Vercel.
4. La UI parte de shadcn-admin.
5. La dashboard consulta el CRM desplegado vía API.
6. La API de la dashboard genera un snapshot.
7. El snapshot alimenta la UI.
8. El MVP es read-only.
9. Los tokens son server-side.
10. Los repos Funnel Academy y CRM son contexto, no lugar de implementación principal.
11. El scaffolding organiza el trabajo y los outputs.
12. Antes de implementar mucho, debe generar una spec clara.
13. Si faltan datos en CRM, debe documentar el gap y no inventar.
14. Debe evitar sobreingeniería.
15. Debe entregar algo funcional, bonito y accionable.

---

## 51. Definición de éxito

Este repo tendrá éxito si permite que cualquier persona del equipo pueda abrir una URL y responder en segundos:

```text
¿Cómo va el funnel IA Mujeres?
Qué entidades están en cada fase?
Qué ha pasado desde la última revisión?
Qué problemas tenemos?
Qué tareas están pendientes?
Qué toca hacer hoy?
Qué oportunidades están calientes?
Dónde está bloqueado el proceso?
```

La dashboard debe reducir fricción operativa.

Debe convertir el CRM en una visión ejecutiva.

Debe ayudar a coordinar al equipo.

Debe evitar que el seguimiento dependa de preguntar a una persona, abrir mil ficheros o leer un weekly report largo.

La aspiración no es solo “ver números”.

La aspiración es tener un **centro de mando operativo** para el proyecto IA Mujeres.

---

## 52. Frase guía

```text
El CRM es la fuente de verdad.
La dashboard es el centro de mando.
El snapshot es el contrato.
Vercel es el despliegue.
shadcn-admin es la base visual.
basic-scaffolding es la forma de trabajar.
```

---

## 53. Próximo paso

Después de crear este archivo en la raíz del repo, el siguiente paso es generar un megaprompt para que un agente construya el plan de implementación.

Ese prompt deberá pedir:

1. leer este documento;
2. revisar el scaffolding;
3. revisar los repos/contextos enlazados;
4. proponer estructura final;
5. crear spec MVP;
6. definir contrato snapshot;
7. definir endpoints;
8. definir UI pages;
9. definir fases;
10. listar preguntas abiertas;
11. no implementar todavía sin plan aprobado, salvo que se indique lo contrario.

Este documento es el contexto madre.
