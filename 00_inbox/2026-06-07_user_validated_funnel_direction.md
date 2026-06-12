# User Validated Funnel Direction — IA Mujeres

## 1. Resumen de la direccion validada

El funnel real de IA Mujeres parte de un listado explotable de cabildos, ayuntamientos, areas de igualdad, empleo, politicas sociales, desarrollo local y contactos institucionales actuales.

El primer email tiene un objetivo unico:

> conseguir conversacion o reunion, no vender todavia.

Despues del primer envio, el funnel se divide en tres carriles:

- carril principal de contacto a reunion;
- carril de no respuesta, follow-up y nurturing;
- carril de cierre o bloqueo.

La logica validada es `conversacion institucional first`.

## 2. Funnel conceptual

```text
LISTADO
→ Revision minima
→ Primer email
→ Espera X dias
    ├── Responde
    │   → Conversacion iniciada
    │   → Reunion propuesta
    │   → Reunion agendada
    │   → Reunion realizada
    │   → Propuesta solicitada / siguiente paso
    │
    ├── No responde
    │   → Follow-up 1 / Retargeting
    │   → Espera X dias
    │   → Follow-up 2 / Retargeting
    │   → Nurturing a futuro
    │
    ├── Rebota / contacto incorrecto
    │   → Revision manual
    │
    └── Dice no
        → No interesado
```

## 3. Apertura como senal debil

`email_opened` no debe ser stage principal del funnel. Es una senal auxiliar si existe tracking fiable.

Motivos:

- las aperturas pueden bloquearse;
- Apple Mail y otros sistemas pueden distorsionarlas;
- cuentas institucionales pueden tener filtros;
- abrir no equivale a interes real.

Jerarquia de senales:

```text
email_opened = senal debil
reply_received = evento fuerte
meeting_booked = conversion real
```

El funnel debe seguir funcionando aunque no haya tracking de apertura, usando:

```text
email_sent
reply_received
bounce_detected
meeting_proposed
meeting_booked
```

## 4. Carril de respuesta / interes

Este es el camino bueno:

```text
Pendiente primer email
→ Primer email enviado
→ Respuesta recibida
→ Conversacion iniciada
→ Reunion propuesta
→ Reunion agendada
→ Reunion realizada
→ Propuesta solicitada
```

En cuanto hay respuesta, el contacto sale de cualquier carril automatico y entra intervencion humana: Romina, Raul o equipo.

La automatizacion solo debe ayudar a:

- registrar que respondio;
- crear tarea de contestar;
- crear tarea de proponer reunion;
- mover el deal;
- guardar thread/email;
- preparar siguiente paso.

## 5. Carril de no respuesta / retargeting

`Sin respuesta` no es cierre definitivo. Es un estado operativo temporal.

```text
Primer email enviado
→ Seguimiento pendiente
→ Sin respuesta
→ Follow-up 1 / Retargeting
→ Seguimiento pendiente
→ Sin respuesta
→ Follow-up 2 / Retargeting
→ Nurturing a futuro
```

Reglas:

- Si no respondio y no abrio, si la senal existe, probar asunto o angulo distinto.
- Si abrio y no respondio, hacer follow-up mas suave.
- Nunca decir ni insinuar: "he visto que abriste el correo".
- Si responde, sale del carril automatico y pasa a conversacion humana.

## 6. Carril de cierre / bloqueo

Salidas claras:

```text
Respuesta recibida
→ No interesado
```

```text
Email rebotado / contacto invalido
→ Revision manual
```

Motivos de salida o bloqueo:

- no interesado;
- contacto incorrecto;
- email invalido;
- no procede;
- duplicado;
- revisar manualmente.

## 7. Rol de CRM, GWS y humano

### CRM / Twenty

Fuente de verdad para:

- deals;
- estado comercial;
- Business Line;
- Campaign;
- prioridad;
- segmento;
- revision manual;
- tareas;
- reuniones;
- notas;
- nurturing futuro.

### GWS CLI

Fuente operativa para:

- drafts;
- envios;
- `message_id`;
- `thread_id`;
- respuestas;
- bounces si estan disponibles;
- aperturas solo si existe tracking fiable.

### Humano

Responsable de:

- validar listas;
- aprobar drafts;
- responder a interesados;
- proponer reunion;
- mantener conversacion;
- decidir cuando pasar a propuesta;
- ajustar tono;
- interpretar senales institucionales.

## 8. Conversion primaria y secundaria

| Tipo | Evento | Interpretacion |
|---|---|---|
| Conversion primaria | Reunion agendada | Conversion real del primer tramo comercial. |
| Conversion secundaria | Respuesta positiva / conversacion iniciada | Hay interes o posibilidad de avance. |
| Conversion posterior | Propuesta solicitada | La entidad pide siguiente paso formal. |
| No conversion temporal | Sin respuesta | No es cierre; alimenta follow-up o nurturing. |
| Cierre negativo real | No interesado / bounce / contacto invalido / no procede | Salida o revision manual. |

## 9. Implicaciones para Fase 7 de copy

Fase 7 debera crear:

- Email 1: abrir conversacion institucional.
- Follow-up 1: retomar conversacion con angulo territorial/institucional.
- Follow-up 2: ultimo intento suave antes de nurturing.
- Respuestas manuales o talking points para respuesta positiva, interes pero no ahora, derivacion, peticion de informacion, propuesta de reunion y no interesado.

No debe escribir el funnel como venta directa ni usar aperturas como KPI principal.

## 10. Implicaciones para implementacion posterior

- No todos los conceptos tienen que ser stages de CRM.
- Separar stages comerciales, `outreach_status`, senales/eventos y tareas humanas.
- `email_opened` puede guardarse como evento auxiliar si existe, no como estado.
- `reply_received` debe generar tarea humana y sacar del carril automatico.
- `meeting_booked` debe tratarse como conversion real.
- `Sin respuesta` debe activar follow-up o nurturing, no cierre inmediato.
- Bounce/contacto incorrecto debe pasar a revision manual.

## Interpretacion visual del canvas

```text
Azul = operacion
Verde = interes y avance
Amarillo = espera / falta de respuesta / retargeting
Rojo = bloqueo o cierre
Morado = relacion futura / nurturing
```
