# FROMZERO_DECISIONS

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_DECISIONS |
| Propósito o subtítulo | Ledger de decisiones normalizadas Sprint 1-8 |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-21 |
| Última actualización | 2026-06-21 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-21: creado durante Fase 1 para normalizar P1-P62 |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-21 |
| Frase literal de aprobación | PLEASE IMPLEMENT THIS PLAN |
| Artefactos prerequisito | `artifacts/SPRINT_1_8_DECISION_QUESTIONNAIRE.md`, `artifacts/FROMZERO_PLAN.md` |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_STATE.md`, `artifacts/adr/`, Supabase cloud dev, GitHub, SonarQube |
| Artefactos derivados o relacionados | `artifacts/DEFERRED_ACTIVATIONS.md`, `artifacts/test-plans/fase-1-reconciliation.md` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos. Sin `.env` reales. Sin tocar `docs/` ni `.codex/`. |

## Decisiones normalizadas P1-P62

| P | Decisión | Estado |
|---|---|---|
| P1 | Framework reusable vendible | cerrado validado |
| P2 | Secretos permitidos localmente y excluidos de tracking | cerrado validado |
| P3 | Supabase moderno con publishable/secret y legacy solo compatibilidad | cerrado validado |
| P4 | Packs FromZero requieren explicación y no bloquean Fase 1 | contrato implementado, integración pendiente |
| P5 | Versiones recientes estables compatibles | cerrado validado |
| P6 | UI FromZero/design system | cerrado validado |
| P7 | i18n simple y extensible | cerrado validado |
| P8 | Demo permitido solo si limpiable con `is_demo` | cerrado validado |
| P9 | UI puede mostrar módulos incompletos sin fingir backend | cerrado validado |
| P10 | UI administrativa operacional | cerrado validado |
| P11 | Migraciones contra Supabase cloud dev | cerrado validado |
| P12 | Supabase local no es fuente de verdad aquí | cerrado validado |
| P13 | Tenant Zero revisado por dueño en bootstrap local | contrato implementado, integración pendiente |
| P14 | Bootstrap one-shot requiere explicación | contrato implementado, integración pendiente |
| P15 | `allow_multi_tenant_users` default false y configurable | cerrado validado |
| P16 | Seeds fundacionales mínimos | cerrado validado |
| P17 | Email/password default y MFA configurable | cerrado validado |
| P18 | `Guest` canónico, sin rename | cerrado validado |
| P19 | API keys por RBAC/contexto | cerrado validado |
| P20 | API key expiry parametrizable | contrato implementado, integración pendiente |
| P21 | Invitación default 24h parametrizable | cerrado validado |
| P22 | Handlers autenticados requieren patrón | contrato implementado, integración pendiente |
| P23 | CRUD global multimódulo | cerrado validado |
| P24 | Custom fields por plan; opt-in módulo diferido | contrato implementado, integración pendiente |
| P25 | Filtro compartido usable, no editable por otros | cerrado validado |
| P26 | Relaciones sin límite impuesto por framework | cerrado validado |
| P27 | Factory queries validadas contra DB | cerrado validado |
| P28 | Stripe provider configurable, sin cobros reales | contrato implementado, integración pendiente |
| P29 | Planes demo mínimos, no catálogo comercial real | cerrado validado |
| P30 | Trial/degradación parametrizable | contrato implementado, integración pendiente |
| P31 | Invoice legal parametrizable por país | contrato implementado, integración pendiente |
| P32 | Eventos Stripe configurables | contrato implementado, integración pendiente |
| P33 | Statement/invoice conciliación documentada | cerrado validado |
| P34 | Storage real depende de Supabase dev | contrato implementado, integración pendiente |
| P35 | Buckets según docs vigentes | cerrado validado |
| P36 | Límites archivo por plan/app | contrato implementado, integración pendiente |
| P37 | Retención/purga parametrizable | contrato implementado, integración pendiente |
| P38 | Legal templates fuera de Fase 1, Fase 3 | bloqueado por gate externo |
| P39 | Versionado documentos por general/plan | contrato implementado, integración pendiente |
| P40 | Inngest SDK + motor local/self-hosted | cerrado validado |
| P41 | pg_cron para tiempo y colas para batch/import/export | cerrado validado |
| P42 | In-app default; externos configurables | contrato implementado, integración pendiente |
| P43 | Resend aplica, secreto externo | contrato implementado, integración pendiente |
| P44 | Rules notifican, workflow y cambian datos | cerrado validado |
| P45 | Webhooks infraestructura por app/tenant | contrato implementado, integración pendiente |
| P46 | Firma/replay/rotación requiere explicación | contrato implementado, integración pendiente |
| P47 | Imports parametrizables | contrato implementado, integración pendiente |
| P48 | Import con permiso, mapping y confirmación | cerrado validado |
| P49 | TTL exports por aplicación | contrato implementado, integración pendiente |
| P50 | Formatos import/export parametrizables | contrato implementado, integración pendiente |
| P51 | Handler privado de referencia antes de Sprint 9 | cerrado validado |
| P52 | Supabase cloud dev fuente de verdad | cerrado validado |
| P53 | Supabase/Sonar/GitHub como gate inicial | cerrado validado |
| P54 | CI en GitHub Actions | contrato implementado, integración pendiente |
| P55 | Sonar activo para este repo | contrato implementado, integración pendiente |
| P56 | Observabilidad mínima requiere explicación | contrato implementado, integración pendiente |
| P57 | Redis default off | cerrado validado |
| P58 | Secretos controlados, no prohibidos | cerrado validado |
| P59 | Sprint 9 solo tras saneamiento | contrato implementado, integración pendiente |
| P60 | Revalidar OpenRouter antes de Sprint 9 | bloqueado por gate externo |
| P61 | Límites costo/uso como deuda Core AI | contrato implementado, integración pendiente |
| P62 | Legal externo responsabilidad de app derivada | cerrado validado |

## Evidencia clave

- `bootstrap.json` retirado del índice y protegido por `.gitignore`.
- `.env.example`, `.mcp.example.json`, `bootstrap.example.json`, `.dockerignore` y `sonar-project.properties` creados o actualizados sin secretos.
- Supabase cloud dev quedó con migraciones Sprint 3, 4, 6, 7 y 8 aplicadas.
- `GET /api/v1/settings` es el handler privado de referencia.
- GitHub Actions y SonarQube están configurados localmente; ejecución remota depende de push y secrets.
