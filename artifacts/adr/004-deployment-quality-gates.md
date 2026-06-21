# ADR

Ruta de salida: `artifacts/adr/004-deployment-quality-gates.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | ADR |
| Propósito o subtítulo | Entornos, despliegue y gates de calidad |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-21 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-18: creado desde Spec aprobada para alimentar el Plan; 2026-06-21: aprobado por ejecución Fase 1 con GitHub Actions, Supabase cloud dev y SonarQube config |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-21 |
| Frase literal de aprobación | PLEASE IMPLEMENT THIS PLAN |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado como base |
| Documentos o fuentes asociadas | `docs/REFERENCE_STACK.md`, `docs/SCALABILITY_ASSURANCE.md`, `docs/SECURITY_ASSURANCE.md`, `docs/STRATEGY.md`, `artifacts/FROMZERO_SPEC.md` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `.github/workflows/`, `docker-compose.yml`, `.env.example` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. Sonar token solo como secret externo. |

## Decisión

Usar npm, GitHub Actions, SonarQube self-hosted como quality gate, Playwright para viewports 375/768/1920, Vitest para lógica, k6 para carga en staging, Docker genérico y Coolify sobre VPS como ruta de despliegue primaria. Separar Dev, Test/Staging y Producción con credenciales distintas.

Actualización 2026-06-21: SonarQube queda configurado con `sonar-project.properties` versionado y GitHub Actions usa `SonarSource/sonarqube-scan-action@v7`. En el repo se documentan `SONARQUBE_URL`, `SONARQUBE_PROJECT_KEY` y `SONARQUBE_TOKEN`; el workflow mapea URL y token a los nombres que espera el scanner. La ausencia de esos valores bloquea solo el baseline SonarQube, no el gate local.

## Contexto

La Spec exige TypeScript strict, Next.js App Router, Tailwind CSS v4, Supabase cloud con SQL versionado, CI, gates de seguridad, performance y calidad. También exige no usar `.env` reales y registrar solo placeholders.

## Opciones

| Opción | Resultado |
|---|---|
| Docker/Coolify + CI gates | Elegida. Alinea docs y deja despliegue portable. |
| PaaS específico sin Docker genérico | Rechazada. Reduce portabilidad vendible. |
| Sin SonarQube gate | Rechazada. Incumple decisión D020/Q020. |

## Tradeoffs

- Requiere configurar CI y SonarQube antes de release candidate.
- Mantiene base autoalojable y vendible.
- Las pruebas visuales y de carga aumentan costo de cierre, pero reducen regresiones.

## Impacto seguridad

- CI nunca debe imprimir secretos.
- `.env.example` solo contiene placeholders.
- Dependabot/Renovate y advisories deben cubrir lockfiles.
- Service role y tokens cloud quedan fuera del cliente y del repo.

## Impacto escalabilidad

- Budgets: API p95 < 200 ms salvo excepción, LCP < 2.5 s en Fast 3G, Lighthouse > 90.
- k6 solo contra staging dedicado.
- Observabilidad queda como adapter opcional para apps derivadas.

## Resultado

El Plan debe cerrar release candidate con CI, typecheck, lint, tests, Playwright, k6, SonarQube, secrets scan, revisión de dependencias y evidencia de performance.
