# Cuestionario de decisiones pendientes - Sprints 1 a 8

## Metadatos

| Campo                                           | Valor                                                                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Artefacto                                       | SPRINT_1_8_DECISION_QUESTIONNAIRE                                                                                                                                        |
| Propósito                                       | Revisar avance Sprint por Sprint y listar decisiones pendientes como preguntas                                                                                           |
| Proyecto                                        | From Zero Framework v7.4                                                                                                                                                 |
| Fecha                                           | 2026-06-19                                                                                                                                                               |
| Estado                                          | borrador para respuesta del dueño                                                                                                                                        |
| Modo Q&A ejecutado                              | no                                                                                                                                                                       |
| Reemplaza `artifacts/FROMZERO_QUESTIONNAIRE.md` | no                                                                                                                                                                       |
| Fuentes revisadas                               | `artifacts/FROMZERO_STATE.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/test-plans/`, `docs/API_ENDPOINT_INVENTORY.md`, `README.md`, `package.json`, `.env.example`, Git |
| Restricciones                                   | No incluir secretos reales. No aplicar migraciones ni activar servicios desde este documento.                                                                            |

## Cómo responder

Responde debajo de cada pregunta en `Respuesta:`. Si no tienes una decisión todavía, escribe `Diferir` y agrega la condición para decidir después.

Formato sugerido:

```text
Respuesta: ...
Información adicional: ...
Apruebo ejecutar cambios: sí/no
```

## Avance verificado por Sprint

| Sprint   | Estado verificado | Commit principal | Avance real                                                                         | Limitaciones relevantes                                                              |
| -------- | ----------------- | ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Sprint 1 | cerrado           | `6d158ff`        | Base inicial, estructura, placeholders y gates mínimos.                             | No activa servicios reales.                                                          |
| Sprint 2 | cerrado           | `1133fad`        | Shell UI, i18n, layout y capturas visuales.                                         | Datos reales y APIs protegidas pendientes.                                           |
| Sprint 3 | cerrado local     | `b57c807`        | Schema fundacional, bootstrap, contratos, health API.                               | RLS validado estáticamente; no migración cloud/local aplicada.                       |
| Sprint 4 | cerrado local     | `b1bc9a4`        | Auth, tenant context, RBAC, invitaciones, API keys.                                 | Sin Supabase conectado; handlers autenticados pendientes.                            |
| Sprint 5 | cerrado local     | `f7b3b86`        | Module Factory, Grid Universal, custom fields, filters, relationships.              | Queries/guards como contratos; ejecución DB real pendiente.                          |
| Sprint 6 | cerrado local     | `66b458e`        | Billing core, subscriptions, statements, invoices, Stripe mock, webhook HMAC, PDF.  | Sin Stripe real, cobros reales ni migraciones aplicadas.                             |
| Sprint 7 | cerrado local     | `bf4478c`        | Storage, documents, tags, bookmarks, consent, SQL versionado, purge schedule.       | Sin Storage real, signed URLs reales ni purga real.                                  |
| Sprint 8 | cerrado local     | `c124575`        | Event outbox, jobs, rules, notifications, email templates, webhooks, import/export. | Sin Inngest cloud, emails/webhooks reales, import/export real ni migración aplicada. |

## Decisiones por Sprint

###

### Sprint 1 - Base inicial, entorno y reglas

#### P1. ¿Confirmas que el proyecto debe seguir como framework reusable vendible y no como app vertical específica?

Por qué importa: define si los próximos Sprints priorizan componentes reutilizables o flujos de negocio concretos.

Opciones:

- A. Sí, mantener framework reusable.
- B. Convertirlo gradualmente en una app vertical.
- C. Mantener framework, pero incluir una demo vertical acotada.

Respuesta: No entiendo por qué esta pregunta existe. Ya debería estar resuelta en el cuestionario que llené anteriormente.

Sin embargo, para este proyecto, tal como lo describe claramente la documentación del proyecto en el directorio docs, estamos construyendo el framework reusable que lo vamos a utilizar nosotros para crear aplicaciones. También lo queremos comercializar como un producto de la empresa, es decir, lo vamos a vender.

Información adicional:   Me preocupa esta pregunta porque ya debería de estar sumamente claro desde la documentación, pasando por el cuestionario.

#### P2. ¿Dónde deben vivir los secretos reales de desarrollo y operación?

Por qué importa: evita fugas de credenciales y define cómo se activarán Supabase, Stripe, Resend, OpenRouter, Inngest, SonarQube y MCP.

Opciones:

- A. Variables locales fuera de Git.
- B. Vault o gestor de secretos.
- C. Variables del proveedor cloud.
- D. Combinación por entorno.

Respuesta:  El proyecto base que estamos construyendo, es decir, la plantilla del framework que estamos construyendo, debería de tener al menos el archivo .env.example,  Y este archivo debería de generarse una copia con el nombre .env.local Desde el inicio del proyecto, es decir, debería existir en el Sprint 1 de este proyecto. ¿Por qué? Porque aquí deberíamos mantener toda la información que se necesita para que funcionen las integraciones que necesita el framework. Y como archivos críticos por tener información de llaves, deberían de estar excluidos de cualquier control de Git o de cualquier otro archivo en el cual se puedan ignorar estos archivos. El único que debería de formar parte del repositorio o del código es el .env.example La estructura de este archivo debería tener todas las variables que necesita el framework para funcionar. Se usen o no se usen.

La estructura de este archivo debería ser lo más lógica posible, es decir, agrupar las variables de cada aplicación en forma consecutiva. Si el formato de este archivo permite separaciones entre las secciones, también deberían existir para que tengamos claro dónde empiezan los parámetros que se necesitan de SupaBase, dónde terminan los de SupaBase, dónde comienzan los de SonarQube, etcétera. The structure of this file should be as logical as possible.

Información adicional:  No deberíamos tener ningún problema en manejar un archivo con variables y llaves en el archivo .env.local mientras estemos totalmente seguros que está excluido de cualquier control, git, docker, etc.

#### P3. ¿Quieres mantener ambas variables Supabase públicas (`PUBLISHABLE_KEY` y `ANON_KEY`) o estandarizar una sola?

Por qué importa: `.env.example` contiene ambas; elegir una reduce ambigüedad en clientes y documentación.

Opciones:

- A. Mantener ambas por compatibilidad.
- B. Usar solo `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- C. Usar solo `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Respuesta: Con relación a SupaBase, dado que es uno de los recursos más importantes de este proyecto, me gustaría que tuviéramos la posibilidad de utilizar tanto el CLI como el MCP de Supabase desde el primer momento,  Para comenzar a trabajar directamente con la base de datos, debo ser honesto: no tengo conocimiento suficiente sobre SupaBase para saber cuál es la diferencia entre las dos llaves que me estás dando.

Necesito tu ayuda para que me ayudes a definir cuál es la variable que deberíamos tener, o si existe una forma diferente de registrar la información de SupaBase en las variables de entorno. Para mí es súper importante que, por simplicidad o facilidad, utilicemos el CLI, de preferencia. Si tenemos el MCP y otras capacidades, entonces usemos el MCP. Todo desde la perspectiva de ayudar a agilizar el proceso de creación de software y mejorar el control que tenemos sobre la base de datos.

Información adicional:  Como dije antes, no tengo idea cuál es la mejor opción entre estas dos variables. Necesito tu ayuda para definir cuál es la que necesitamos y que realmente trabajemos con sólo una llave. Si sólo una es suficiente, ayúdame a elegir cuál de ellas es la que necesitamos.

#### P4. ¿Quieres instalar recursos FromZero empaquetados y crear `.fromzero/fromzero.lock.json`?

Por qué importa: el estado indica que no se instalaron packs; instalar recursos puede mejorar reproducibilidad, pero agrega archivos nuevos.

Opciones:

- A. No instalar todavía.
- B. Instalar solo recursos necesarios.
- C. Instalar todos los recursos seleccionados.

Respuesta:  No tengo ni idea a qué te refieres con esta pregunta. No sé qué significa instalar PACS. Necesito que me ayudes a entender bien este tema antes de poder tomar una decisión.

Información adicional:

#### P5. ¿Cuál será la política de actualización de dependencias?

Por qué importa: el stack está fijado en `package.json`, pero falta decidir si se congelan versiones o se aceptan actualizaciones menores.

Opciones:

- A. Versiones exactas y upgrades manuales.
- B. Rangos compatibles con auditoría.
- C. Upgrades frecuentes con CI fuerte.

Respuesta:  Imagino que hace referencia al stack tecnológico que vamos a utilizar para la creación del software.

Si es así, en la documentación debería estar sumamente claro que la preferencia siempre va a ser la utilización de las versiones más recientes y estables de cada uno de los elementos de nuestro stack tecnológico.

Sin embargo, si algunos elementos de este stack tecnológico generan inconsistencias o incompatibilidades con las versiones más recientes de otros, entonces en estos casos sí está permitido utilizar versiones no las últimas, sino las anteriores a las últimas que sean compatibles con la mayoría de los componentes, por no decir todos los componentes, de nuestro stack. Lo más importante es estar lo más actualizado posible sin que existan incompatibilidades que puedan generar problemas en nuestra aplicación final.

Información adicional:

###

### Sprint 2 - UI shell, i18n y experiencia base

#### P6. ¿Qué identidad visual debe usar el framework base?

Por qué importa: la shell existe, pero falta definir marca, tokens finales, logo y tono visual vendible.

Opciones:

- A. Marca neutral From Zero.
- B. Marca blanca sin nombre visible.
- C. Marca comercial propia.

Respuesta: La identidad visual del framework base la va a definir la plantilla que ya tenemos como un elemento de la metodología. La plantilla que vamos a utilizar, como una librería de componentes, ya incluye un design system específico, y ese es el que tenemos que respetar. No debería ser un punto relevante en este momento.

El logo que vamos a utilizar siempre y cuando exista la ubicación y podamos hacer el cambio de forma simple, por ejemplo, a nivel de parámetros (por ejemplo, del path del nombre del logotipo) o que el mismo nombre del logotipo sea estándar para que después solo cambiemos la imagen, la renombremos con el nombre que se espera, las dimensiones que se esperan, para que sea automático el hecho de hacer el cambio del logotipo.

El concepto de marca blanca realmente no es aplicable, porque la plantilla en sí, es decir, el Design System, permite la parametrización de colores, fuentes, etc. Es uno de los principios con los cuales fue creado realmente el UI de la plantilla base que está en Next.js y que forma parte de la librería de componentes que ya tenemos.

  Cada usuario o cliente que utiliza el framework y nuestra metodología va a tener total libertad para modificar la UI desde la perspectiva de colores, logos, etc., para adaptarlo a su marca.

Lo que buscamos con el framework es simplificar el proceso de creación de aplicaciones estables, seguras y escalables para grupos pequeños o emprendedores. El tema de la UI es algo que hoy en día se puede cambiar fácilmente, siempre y cuando se sigan los mismos lineamientos que ya tenemos del UI definido para el framework.

Información adicional:

#### P7. ¿Qué idiomas deben considerarse obligatorios para release?

Por qué importa: hoy existen `es` y `en`; agregar idiomas aumenta costo de mantenimiento.

Opciones:

- A. Español e inglés.
- B. Solo español hasta release interno.
- C. Español, inglés y otros idiomas definidos.

Respuesta:  El sistema de traducción debe ser lo más sencillo posible. Creo que en la documentación hicimos un buen esfuerzo en documentar y explicar cómo quisiéramos que funcionara todo el tema de localización.
La intención es tener archivos en cualquier idioma que puedan ser traducidos de forma fácil, incluso con inteligencia artificial, para agregar idiomas. Lo más importante del mecanismo de traducción que debe tener el framework es que debe incluir todo el texto que pueda ser visible para usuarios. Esto incluye:

- Temas de UI
  - Etiquetas de campos
  - Placeholders
  - Botones
  - Tool Tips, etc.

Información adicional:  Lo más importante que hemos mencionado es que el motor de traducción del framework debe ser lo más simple y fácil de mantener para poder agregar incluso traducciones o idiomas nuevos.

#### P8. ¿La UI debe mostrar datos demo o solo estados vacíos seguros?

Por qué importa: el plan exige datos reales estrictos; una demo puede ayudar a vender, pero debe evitar datos falsos confundibles.

Opciones:

- A. Solo estados vacíos seguros.
- B. Demo separada y marcada como ejemplo.
- C. Datos sembrados solo en entorno demo.

Respuesta: He utilizado algunas plantillas de WordPress. Me gusta que tienen la capacidad de crear información SID de forma controlada y también de eliminar esa información SID una vez que se quiera comenzar a utilizar la plataforma.
Como estamos diseñando en este momento el framework, es decir, la base y los módulos necesarios para que una aplicación final funcione, la cantidad de datos sembrados o de datos demo va a ser bastante reducida. Sin embargo, debemos tener la capacidad de crear datos demo y eliminar esos datos demo.
Eso implica que cada registro que se genere debe tener una variable o un campo específico que indique si es información demo para poder ser eliminada de forma masiva y simplificar el proceso de limpieza de los registros que forman parte de la demo.
Van a haber registros que no deben ser eliminados, como, por ejemplo:

- el usuario superadmin
  - los roles globales
  - los perfiles globales, principalmente
  Todo lo demás puede ser generado como información generada de demostración. También debe tener en los parámetros generales la capacidad de poder eliminar los datos demostrativos.

Información adicional:

#### P9. ¿Qué navegación visible debe quedar en la shell antes del Sprint 10?

Por qué importa: evita exponer módulos incompletos o rutas sin permisos.

Opciones:

- A. Solo dashboard y navegación mínima.
- B. Mostrar módulos bloqueados como próximos.
- C. Mostrar módulos si tienen contrato aunque falte handler.

Respuesta: Es muy importante que tengas en cuenta que la UI debe demostrar todos los elementos de la UI o de los módulos que forman parte del framework, estén o no estén desarrollados. Esto es importante para que podamos tener una idea visual de cómo va a quedar la UI final.
Se deben respetar todos los elementos de la plantilla base o la UI base:

- Las diferentes partes
  - Los menús
  - Las opciones globales
  - Los botones, incluso en la parte del header
  Toda esa funcionalidad debe existir.
  Además, no recuerdo en qué sprint se crean los módulos principales, o por lo menos el de parámetros globales. El de parámetros globales es uno de los módulos más importantes porque es el que permite configurar inicialmente la aplicación y permite incluso parametrizar o customizar el look and feel de la aplicación.
  Respondiendo claramente a la pregunta, la UI debe ser lo más completa posible para poder ir definiendo ajustes desde el primer sprint en el que se pueda ver la UI.

Información adicional:

#### P10. ¿Quieres mantener el enfoque UI operacional denso o hacerlo más comercial/landing?

Por qué importa: afecta layout, componentes y prioridad visual de los próximos módulos.

Opciones:

- A. UI operacional densa.
- B. UI mixta operacional y comercial.
- C. Landing comercial fuerte desde ahora.

Respuesta: No entiendo esta pregunta. Lo que estamos construyendo es una base de una aplicación de software as a service o una aplicación empresarial. Es una UI administrativa la que estamos construyendo. No entiendo la pregunta. Explícamela para poder tomar una decisión.

Información adicional:

###

### Sprint 3 - Datos, bootstrap y Supabase

#### P11. ¿Cuándo autorizas aplicar las migraciones fundacionales a Supabase?

Por qué importa: hasta ahora el SQL está versionado, pero no aplicado contra Supabase local/cloud.

Opciones:

- A. Todavía no aplicar.
- B. Aplicar primero en Supabase local.
- C. Aplicar en proyecto cloud de desarrollo.

Respuesta: Esto es una pregunta que denota que la documentación o incluso la metodología no está funcionando correctamente. Con claridad, deberíamos, desde el inicio, tener claro que tenemos que trabajar con SupaBase Cloud. Se deben tener los accesos al proyecto creado en supabase.com, y se debe trabajar directamente con la base de datos, ya sea por medio del CLI o por medio del MCP.

Información adicional:

#### P12. ¿Quieres levantar Supabase local para validar RLS dinámicamente?

Por qué importa: las pruebas RLS actuales son estáticas sobre SQL; una base local permitiría pruebas reales cross-tenant.

Opciones:

- A. Sí, usar Supabase local.
- B. No, usar solo cloud dev.
- C. Diferir hasta antes del release candidate.

Respuesta: En ningún lado he documentado usar el SupaBase local. Siempre hemos hablado de utilizar SupaBase en la nube directamente, entonces deberíamos haber comenzado a utilizar SupaBase desde el primer momento en que necesitábamos información o interactuar con la base de datos.

Información adicional:

#### P13. ¿Cuáles serán los datos reales de Tenant Zero?

Por qué importa: el bootstrap actual usa valores base; para operar se necesitan nombre, owner, dominio, locale, timezone y moneda.

Respuesta: Estos datos deberías de haberlos pedido desde el inicio, no hasta ahora. Definitivamente hay un error en la metodología. Y la pregunta no deja claro qué nombre necesitas, si es el nombre de la empresa o qué. ¿Y el owner hace referencia a una persona o a quién?
Puedes usar estos datos: Innvenia, Luis Canelo, innvenia.ai, es, GMT-6, USD

Información adicional:

#### P14. ¿Qué estrategia prefieres para bootstrap en ambientes nuevos?

Por qué importa: bootstrap debe ser de un solo uso y auditable.

Opciones:

- A. Script CLI controlado.
- B. Seed SQL revisado.
- C. Setup wizard protegido.
- D. Combinación CLI más wizard.

Respuesta: No entiendo la pregunta. No entiendo a qué bootstrap te refieres. Necesito que me des más información para poder responder.

Información adicional:

#### P15. ¿Se permitirá que un usuario pertenezca a múltiples tenants?

Por qué importa: Sprint 3 validó `allow_multi_tenant_users = false`; cambiarlo impacta auth, selector de tenant, RLS y UI.

Opciones:

- A. No, un usuario por tenant.
- B. Sí, multi-tenant con selector.
- C. Permitirlo solo para super admins.

Respuesta: Por defecto, un usuario no puede pertenecer a múltiples tenants. Sin embargo, este es un parámetro que debería poder modificarse dependiendo de la aplicación final que un usuario o desarrollador vaya a crear con el framework.

Si este cambio impacta la lógica de funcionamiento desde el inicio, entonces tenemos que definir un mecanismo para reducir el impacto. Esto es porque este es un parámetro que debería poderse modificar en el framework antes de construir una aplicación final.

Información adicional:

#### P16. ¿Qué tablas fundacionales requieren datos iniciales adicionales?

Por qué importa: settings, modules, plans, tenants y logs pueden necesitar seeds reales antes de usar handlers.

Respuesta: Las tablas funcionales son:

- Settings
  - Módulos
  - Planes
  - el Tenant, que es el primero
  Los logs definitivamente se van a ir generando conforme se vaya utilizando el framework.

Información adicional:

###

### Sprint 4 - Auth, RBAC, invitaciones y API keys

#### P17. ¿Cuál será la política final de autenticación?

Por qué importa: Sprint 4 dejó contratos; faltan reglas operativas para password, lockout, MFA y sesiones.

Opciones:

- A. Email/password con MFA opcional.
- B. MFA obligatorio para roles administrativos.
- C. MFA obligatorio para todos.

Respuesta:   Me parece que es otra falla de la metodología, o incluso estoy casi seguro de que está definido ya en la documentación del proyecto.

Para responder la pregunta: por defecto, siempre que montemos una instancia del framework o creemos el framework ahorita, el email y password es la opción inicial y el método de autenticación por defecto.    Todas las opciones de autenticación de factor múltiple deben ser opcionales y deben ser manejadas a nivel de tenant por los usuarios administradores del tenant.  Sí, si la opción de autenticación de múltiple factor a nivel de tenant está desactivada o inactiva (llamémosla inactiva), los usuarios quieren activarlo. Los usuarios podrían hacerlo de forma individual.  Si a nivel de tenant se activa el factor de autenticación doble, todos los usuarios de ese tenant obligatoriamente van a tener que respetar esa política.

Información adicional:

#### P18. ¿Qué roles base deben existir en el framework?

Por qué importa: RBAC necesita una matriz real antes de implementar handlers protegidos.

Opciones:

- A. Super admin, owner, admin, member, viewer.
- B. Roles mínimos: owner, admin, member.
- C. Roles configurables por tenant desde el inicio.

Respuesta:  Este me parece que es otro fallo de la metodología porque ya está bien documentado. Deben ser Super Admin, Admin, Member, y Viewer por defecto. Cada uno con su grid de permisos por perfil.

Información adicional:

#### P19. ¿Quién puede crear, rotar y revocar API keys?

Por qué importa: API keys permiten acceso máquina a máquina y pueden exponer datos si los scopes son laxos.

Opciones:

- A. Solo super admin.
- B. Owner y admins con permiso explícito.
- C. Cualquier usuario con scope delegado.

Respuesta: No entiendo la pregunta porque va a depender del contexto.

Si estamos creando una aplicación a partir del framework, el usuario superadmin es el que tiene que definir todas las llaves que necesita para la aplicación que va a crear y usar.

Si estamos hablando de ciertas funcionalidades internas, como el Core AI (donde se definen proveedores y modelo de inteligencia artificial), ahí va a ser el administrador de cada tenant el que tiene que definir los parámetros de uso y las llaves necesarias. Eso va a ser a través del módulo de APIs, que es parte fundamental del framework.

Información adicional:

#### P20. ¿Qué expiración deben tener las API keys por defecto?

Por qué importa: el diseño soporta expiración opcional; falta definir política segura.

Opciones:

- A. Expiran siempre.
- B. Pueden no expirar si hay rotación obligatoria.
- C. Depende del plan del tenant.

Respuesta: Esta no es una decisión que vamos a tomar nosotros. Esta es una decisión que va a depender de quién esté creando la aplicación final.

Información adicional:

#### P21. ¿Cuál debe ser el TTL de invitaciones?

Por qué importa: invitaciones vencidas reducen riesgo de acceso no deseado.

Opciones:

- A. 24 horas.
- B. 7 días.
- C. Configurable por tenant.

Respuesta: Por defecto deben de ser 24 horas. Sin embargo, todo esto debe de ser parametrizable por aplicación.

Información adicional:

#### P22. ¿Cuándo autorizas implementar handlers autenticados para usuarios, perfiles, invitaciones y API keys?

Por qué importa: el inventario API marca contratos versionados, pero endpoints pendientes.

Opciones:

- A. Antes de Sprint 9.
- B. En un Sprint dedicado posterior.
- C. Mantener contratos hasta cerrar más módulos.

Respuesta: No tengo ni la más mínima idea de a qué te refieres con "handlers autenticados para usuarios". Aquí necesito que, por favor, me expliques antes de poder tomar una decisión.

Información adicional:

###

### Sprint 5 - Factory, Grid, filtros, campos y relaciones

#### P23. ¿Qué módulos deben estar en la allowlist inicial del Module Factory?

Por qué importa: evita crear CRUD sobre módulos sensibles o incompletos.

Respuesta: Esta pregunta me preocupa porque el CRUD debe ser global, no un CRUD por módulo. Todos los módulos deberían utilizar el mismo CRUD. El CRUD debe ser multimódulo. La lógica ya está definida en la documentación del proyecto. No debería ser una pregunta en este cuestionario.

Información adicional: Necesito que revises bien la documentación porque debe de estar bien definido cómo debe de funcionar el módulo que llamamos de visualización o el grid. El grid hace referencia a las APIs crude. El módulo de visualización es único y sirve para cualquier módulo. Está centralizado.

#### P24. ¿Cuál será el límite máximo de custom fields por módulo?

Por qué importa: afecta rendimiento, UI, validación y modelo comercial por plan.

Opciones:

- A. Límite bajo por defecto.
- B. Límite por plan.
- C. Sin límite inicial, con monitoreo.

Respuesta: Prefiero que esto sea un parámetro por plan dentro de la aplicación final a crear a partir del framework. Deben existir límites, y esos límites deben ser definidos por ti. Es decir, para poder identificar cuál es el límite máximo de campos que se pueden manejar por módulo o por aplicación

Información adicional:

#### P25. ¿Los filtros compartidos pueden ser editados por todo el tenant o solo por su dueño?

Por qué importa: define ownership, auditoría y riesgo de cambios inesperados en vistas compartidas.

Opciones:

- A. Solo dueño.
- B. Dueño y admins.
- C. Cualquier usuario con permiso de módulo.

Respuesta:  Definitivamente se debe respetar la autoría del registro. Si un filtro lo crea una persona y esa persona define que ese filtro va a ser público, entonces cualquier persona no va a poder modificarlo. Sólo va a poder utilizarlo, pero no modificarlo.

Información adicional:

#### P26. ¿Qué tipos de relaciones deben habilitarse primero?

Por qué importa: relaciones acíclicas, jerárquicas y many-to-many tienen reglas y riesgos distintos.

Opciones:

- A. Solo relaciones simples.
- B. Simples y jerárquicas.
- C. Todas las relaciones previstas.

Respuesta:  A nivel lógico, el framework debería permitir la flexibilidad para manejar estas relaciones y no imponer límites. Cada aplicación va a tener sus propias limitaciones, pero el framework no debería ser quien ponga límites a cuántas relaciones jerárquicas o niveles jerárquicos de relaciones pueden existir en una aplicación. La aplicación misma debe definirlo.  En otras palabras, el motor de relaciones del framework no puede tener límites o no debería de imponerlos.

Información adicional:

#### P27. ¿Cuándo se validará la ejecución real de queries del Factory contra base de datos?

Por qué importa: hoy existen contratos y guards TypeScript, pero no ejecución DB real.

Opciones:

- A. Antes de implementar handlers CRUD.
- B. Durante Sprint 10 con módulo Task.
- C. En Sprint 11 como quality gate.

Respuesta:  Para mí, no deberíamos haber tenido nada pendiente con la base de datos desde el inicio de la ejecución. Me parece que fue un fallo de la metodología no haber tenido lista la conexión con la base de datos antes de iniciar el Sprint 1.
Por otra parte, si yo, como creador del framework, estoy definiendo qué es importante para mí: la seguridad del código fuente. A partir de ahí, también tendríamos que haber tenido lista la conexión e interacción con SonarQube para que todo código que se genere pueda ser validado con SonarQube desde el inicio.

 Todo esto es para evitar ir cargando pendientes de sprint a sprint.

Información adicional:

### Sprint 6 - Billing, Stripe, statements, invoices y PDF

#### P28. ¿Autorizas activar Stripe real en entorno de desarrollo?

Por qué importa: Sprint 6 usó adapter mockeable y no ejecutó cobros reales.

Opciones:

- A. No activar todavía.
- B. Activar solo test mode.
- C. Activar test mode y preparar producción sin cobrar.

Respuesta: Hay un punto importante que hay que tener claro: lo que debe existir a nivel del framework es un motor de procesamiento de transacciones con diferentes proveedores. Los proveedores pueden activarse o desactivarse. El concepto del framework es la flexibilidad y no imponer un proveedor específico.

Nosotros habíamos pensado en utilizar Stripe para poner a prueba el motor de procesamiento de transacciones. Para ello, obviamente, podemos utilizar las credenciales públicas que podamos tener de Stripe, pero podemos utilizar montos pequeños o un ambiente de Sandbox de Stripe. Yo preferiría utilizar el ambiente Sandbox de Stripe para no tener transacciones reales.

Sin embargo, repito: Stripe debería ser uno de los múltiples proveedores de procesamiento de transacciones que el motor de procesamiento de transacciones del framework pueda manejar. Es decir, debemos tener una forma de poder ir registrando los proveedores y poder definir, en base al parámetro global de mi aplicación, cuál proveedor utilizar para las transacciones. Incluso llegaríamos al punto de definir reglas para poder especificar si ciertos montos pueden ser protegidos, procesados con un proveedor o ciertos límites como otros. O sea, tenemos que tener esa capacidad a nivel del motor de procesamiento de transacciones del framework.

Si esta funcionalidad en esta fase inicial se complica, podemos dejarla pendiente, pero tenemos que trabajar la base del motor de procesamiento de transacciones.

Información adicional:

#### P29. ¿Cuál será el catálogo inicial de planes y precios?

Por qué importa: subscriptions, statements, invoices y feature gating necesitan planes reales para validación.

Respuesta: Hay que recordar nuevamente que el framework no es una aplicación final, es decir, no tenemos un catálogo de planes.

Para probar el modelo, podríamos utilizar dos tipos de suscripciones: una freemium y una pagada, con datos inventados o genéricos. No más, porque realmente no estamos construyendo una aplicación.

El motor de planes y precios que tiene que tener el framework debe ser lo suficientemente amplio y completo para poder adaptarse a diferentes tipos de planes que puedan existir en aplicaciones de software as a service, incluso a planes globales o planes individuales.

¿Qué quiero decir con esto? Cuando se defina que la aplicación a crear va a utilizar planes globales y existen tres tipos de suscripciones, el administrador de un tenant puede definir uno de los tres. Ese plan será aplicable a todos los usuarios de ese tenant.

Si, a nivel de parámetros globales, el creador de la aplicación define que pueden existir planes individuales, el administrador de un tenant puede definir cuál es el plan por defecto. También puede cambiar a ciertos usuarios los planes. En ese caso, el motor de suscripciones del framework debería ser lo suficientemente inteligente y completo como para poder hacer el cálculo del monto total a pagar por cada tenant, dependiendo de la configuración de suscripciones que tenga ese tenant.
Lo otro importante es entender que el concepto del statement es lo que se genera después del cálculo que el motor de cálculo de suscripciones del framework va a ejecutar para poder definir el monto total que tiene que pagar cada tenant.

Cuando la transacción o el pago automático de ese statement se ejecute, entonces se va a generar una invoice por el monto total facturado o cobrado a cada uno de los tenants.


Información adicional:

#### P30. ¿Cuál será la duración de trial y la regla de degradación?

Por qué importa: el sistema usa `degrade_to_free`, pero falta política comercial concreta.

Opciones:

- A. Trial de 14 días.
- B. Trial de 30 días.
- C. Sin trial automático.
- D. Configurable por plan.

Respuesta:   Estos dos datos son prácticamente parametrizables por aplicación. No debería estar preguntándome a mí. Por defecto, podemos utilizar el trial de 14 días o de 7 días, incluso. Son parámetros que tiene que definir el super admin que está creando la aplicación a partir del framework.

Información adicional:

#### P31. ¿Qué datos fiscales o legales debe incluir una invoice?

Por qué importa: el PDF actual es mínimo; documentos comerciales reales requieren campos legales.

Respuesta:  Ésta es una excelente pregunta, y creo que, dada el enfoque global que le queremos dar al Framework, estos datos legales son un candidato perfecto para un set de parámetros customizables. Puede que, en cada país, los requisitos y los nombres de los documentos sean diferentes, y algunos pueden ser obligatorios o no.

Es importante considerar esto como una funcionalidad de campos personalizables por país en el lugar donde se va a lanzar la aplicación que se va a construir. Tenemos que tener en cuenta países o zonas geográficas y, obviamente, los datos fiscales que son necesarios para generar una invoice.

Información adicional:

#### P32. ¿Qué eventos Stripe deben aceptarse inicialmente?

Por qué importa: limitar eventos reduce superficie de error en webhooks de billing.

Opciones:

- A. Solo subscription y invoice básicos.
- B. Billing completo de Stripe.
- C. Eventos por allowlist configurable.

Respuesta: Como lo hablamos antes, Stripe va a ser uno de los proveedores de procesamiento de pagos que va a tener el motor del procesamiento de pagos del framework.

En este caso, creo que debe ser parametrizable, es decir, que el usuario debe indicar cuáles son los eventos que quiere manejar a través del motor. Lo que el motor debe tener es la capacidad de manejar las diferentes opciones que pongamos a disposición de ese proveedor específico, es decir, de Stripe.

Información adicional:

#### P33. ¿Qué conciliación quieres entre Stripe, statements e invoices?

Por qué importa: evita estados contables inconsistentes y cobros duplicados.

Opciones:

- A. Conciliación manual inicial.
- B. Job automático con revisión.
- C. Conciliación automática completa.

Respuesta: Como está en la documentación, me parece raro que esta pregunta exista, porque no debería existir. En la documentación, claramente indicamos la relación entre lo que es un statement y un invoice.

El statement es prácticamente la consolidación o el cálculo del monto que se le va a cobrar a cada uno de los tenants de la aplicación final. Ahí tiene que aparecer el detalle de todos los cargos que tienen que ejecutarse.

Cuando se genera el statement de forma automática, la aplicación va a generar el cargo por medio del proveedor de pagos que yo haya definido a nivel de la aplicación. Estoy hablando de la aplicación, no a nivel de tenant.

Entonces, va a generar el invoice para cada uno de los tenants por el monto cargado asociado al statement. El invoice es el que tiene que tener las capacidades de ser modificable, es decir, puede ser anulado o, en el proveedor (en este caso Stripe, por ejemplo). El statement puede sufrir modificaciones de acuerdo a cambios que el dueño de la aplicación (es decir, el Super Admin) pueda ejecutar para un tenant en particular.
Acá es importante también entender que dentro del framework debe de existir un módulo de cobros similar al de la aplicación. ¿Por qué? Porque si estamos construyendo una aplicación, por ejemplo, un CRM, y en el CRM cada tenant puede activar su propio procesador de transacciones y realizar cobros a sus clientes finales, esta misma lógica debería de estar disponible para cada tenant.
Sin embargo, tenemos que entender que hay dos ambientes diferentes:

- A nivel de la aplicación: yo, como usuario, utilizo el framework para crear un CRM y cobrar a mis clientes (que son mis tenants) por el uso de mi CRM.
  - Cada tenant utiliza el CRM para cobrarle a sus clientes finales, por lo que el CRM debe de tener también un motor de cobros muy similar al de la aplicación, en términos de flexibilidad para registrar un proveedor específico y realizar cobros a sus clientes finales.



Información adicional:

###

### Sprint 7 - Storage, documentos, consentimientos y purgas

#### P34. ¿Autorizas conectar Supabase Storage real?

Por qué importa: Sprint 7 validó signed URL intent, pero no generó signed URLs reales.

Opciones:

- A. No conectar todavía.
- B. Conectar en Supabase local.
- C. Conectar en cloud dev.

Respuesta: Esta pregunta es sumamente preocupante porque, a nivel de la metodología, este debería haber sido un stopper para la ejecución de la metodología antes incluso de comenzar con el Sprint 1. Antes de comenzar la ejecución del código, deberíamos haber tenido ya acceso a la base de datos de SupaBase.

Información adicional:

#### P35. ¿Qué buckets deben existir y qué visibilidad tendrán?

Por qué importa: define privacidad, RLS, signed URLs y separación entre documentos, exports e imports.

Respuesta: Esta es una pregunta que ya está ampliamente respondida y documentada en el directorio DOCS. Debes leer la documentación del proyecto para entender cómo queremos manejar los buckets para los archivos anexos.

Información adicional:

#### P36. ¿Cuáles serán los límites de archivo por plan?

Por qué importa: Sprint 7 validó MIME, tamaño y cuota tenant; falta política comercial concreta.

Respuesta: Este es un parámetro que debe definirse por aplicación. No lo podemos definir nosotros ahorita para el tenant, sino que debe definirse a nivel de los parámetros globales de la aplicación.

Información adicional:

#### P37. ¿Qué política de retención y purga debe aplicar a soft-deletes?

Por qué importa: existe pg_cron de purga, pero no se ejecutó purga real.

Opciones:

- A. Purga después de 30 días.
- B. Purga después de 90 días.
- C. Retención configurable por tenant.
- D. No purgar automáticamente todavía.

Respuesta: Este es un parámetro que también debe de definirse a nivel del módulo de parámetros globales de la aplicación.

Información adicional:

#### P38. ¿Qué textos legales de consentimiento se usarán inicialmente?

Por qué importa: consent records están modelados, pero los textos legales finales requieren decisión externa.

Respuesta: El framework debe proveer la opción para poder personalizar todos estos textos. Esto puede ser a través de:

- un módulo de templates que ya existe en el framework
  - los módulos del framework
  - documentación que se defina en archivos planos que la aplicación final pueda manejar (pero esto es a nivel de aplicación final, no a nivel del framework)
  Para mí, lo que necesitaríamos es un módulo de plantillas de documentos en el que cada dueño de aplicación pueda subir y modificar los documentos correspondientes con un código. Es decir, puede existir el código de términos y condiciones, uno de privacidad y así sucesivamente.

Información adicional:

#### P39. ¿Los documentos versionados deben limitar número de versiones o peso total?

Por qué importa: afecta storage, rendimiento, costos y experiencia de auditoría.

Opciones:

- A. Límite por número de versiones.
- B. Límite por tamaño total.
- C. Límite por plan.
- D. Sin límite inicial.

Respuesta: Debe de ser un parámetro definido a nivel general y también por plan.

Información adicional:

###

### Sprint 8 - Eventos, jobs, rules, notificaciones, webhooks, import/export

#### P40. ¿Autorizas activar Inngest cloud o se mantiene adapter local/mock?

Por qué importa: Sprint 8 implementó adapter local; cloud requiere claves y eventos reales.

Opciones:

- A. Mantener local/mock.
- B. Activar Inngest en desarrollo.
- C. Preparar cloud pero dejarlo deshabilitado.

Respuesta: Honestamente, no sé qué es Ingest. No sé si es una librería, una aplicación adicional o un componente del tech stack. Necesito que me expliques primero para poder responder con propiedad a esta pregunta.

Información adicional:

#### P41. ¿Qué jobs deben ejecutarse por pg_cron y cuáles por Inngest?

Por qué importa: el diseño separa tiempo programado y workflows disparados por usuario; falta calendario operativo real.

Respuesta:    Creo que la documentación ya habla claramente de cuáles son las actividades que pueden ser ejecutadas en ciertos periodos.

Definitivamente, los procesos de importación y exportación deben ser manejados como colas. Todos aquellos procesos de batch, como por ejemplo envío masivo de correos o algo por el estilo, deben ser manejados también por colas. No sé si eso responde a la pregunta.

Información adicional:

#### P42. ¿Qué canales de notificación estarán activos al inicio?

Por qué importa: notifications soporta canales, pero email real está deshabilitado.

Opciones:

- A. Solo in-app.
- B. In-app y email.
- C. In-app, email y webhooks.

Respuesta: Por defecto, el canal de la aplicación va a estar siempre activo. Va a ser parametrizable si van a existir notificaciones externas vía email, WhatsApp, etc. Deben existir las conexiones correspondientes. Esas deben manejarse también como un módulo de conexiones, en las cuales deben existir los parámetros específicos para cada uno de los canales a utilizar.

Aquí hay un punto importante.
Por ejemplo, si habláramos de notificaciones por correo electrónico y a nivel de mi aplicación (por ejemplo, de mi CRM), yo voy a ocupar RESEND. Entonces, voy a tener las credenciales de mi aplicación.
Pero si dentro de la aplicación (por ejemplo, el CRM) quiero que cada uno de mis usuarios, como administrador de mi tenant, utilicemos las credenciales de mi empresa, entonces el framework tiene que poder permitir la configuración de la cuenta de correo electrónico:

- vía SMTP
- vía conexión con Google
- vía conexión con Outlook
- con quien sea
  para poder enviar las notificaciones de cada usuario.
  ¿Se comprende esta parte?

Información adicional:

#### P43. ¿Autorizas Resend real para emails transaccionales?

Por qué importa: email templates existen, pero no se enviaron emails reales.

Opciones:

- A. No activar todavía.
- B. Activar sandbox/test.
- C. Activar dev real con allowlist de destinatarios.

Respuesta: La definición del proveedor para envío de mensajes o notificaciones por aplicación la tiene que definir el que va a crear la aplicación. Para nuestro caso de esta prueba, vamos a utilizar RESEND como proveedor de envío de mensajería. Debe activarse desde el inicio.

Información adicional:

#### P44. ¿Qué acciones pueden ejecutar las rules automáticamente?

Por qué importa: rules pueden generar efectos no deseados si se habilitan acciones amplias.

Opciones:

- A. Solo notificar.
- B. Notificar y crear jobs internos.
- C. Notificar, webhooks y cambios de datos.

Respuesta: Creo que nuestra documentación habla bastante sobre las reglas automáticas. Estas pueden tener diferentes acciones:

- Pueden crear notificaciones.
  - Pueden ejecutar algún workflow.
  - Incluso pueden cambiar datos del registro al que se están aplicando.

Información adicional:

#### P45. ¿Qué destinos externos de webhooks estarán permitidos?

Por qué importa: existe SSRF guard, pero falta política de allowlist, dominios y revisión.

Respuesta: Esta pregunta no la entiendo bien. Necesito una explicación.

Por defecto, el framework no tendrá webhooks. Los webhooks se definirán en las aplicaciones creadas a partir del framework. Lo único que debe proveer el framework es la infraestructura necesaria para manejar webhooks.

Información adicional:

#### P46. ¿Cuál será la política de firma, replay y rotación de secretos de webhooks?

Por qué importa: HMAC y anti-replay están cubiertos localmente; operación real necesita rotación.

Respuesta: Esta pregunta no la entiendo y necesito que me aclares a qué te refieres.

Información adicional:

#### P47. ¿Qué tamaño máximo tendrán imports CSV/XLSX?

Por qué importa: impacta memoria, jobs, validación, tiempos y costos.

Opciones:

- A. Límite bajo inicial.
- B. Límite por plan.
- C. Límite alto con procesamiento asíncrono.

Respuesta: Esto debe de ser totalmente parametrizable por aplicación para poder manejar estos límites. O incluso también podríamos manejarlos por plan, pero definitivamente debería ser parametrizable. Es decir, no definidos por el framework.

Información adicional:

#### P48. ¿Qué validación humana requiere un import antes de confirmar escritura?

Por qué importa: Sprint 8 incluye preview; falta decidir si todo import requiere confirmación.

Opciones:

- A. Siempre confirmar preview.
- B. Confirmar solo si hay errores o warnings.
- C. Permitir import directo con permisos altos.

Respuesta:  La documentación del proyecto en el directorio Docs ya debe de proveer suficiente información para entender cómo debería de funcionar el módulo de importación.

El módulo de importación solo va a poder utilizar usuarios que tengan el permiso de importar.

El proceso es un formulario de importación en donde deben de existir fases o diferentes pasos para poder importar un registro. Debe de existir un match entre los datos que forman parte del archivo que se quiere importar y los campos que corresponden al módulo al cual quieren importar los registros.

Esto es un sistema un poco complejo, sin embargo ya está documentado en el proyecto. Por favor, revisa bien la documentación.

Información adicional:

#### P49. ¿Cuánto tiempo deben vivir los exports y sus URLs firmadas?

Por qué importa: Sprint 8 agregó expiración por pg_cron; falta política de retención real.

Opciones:

- A. 1 hora.
- B. 24 horas.
- C. 7 días.
- D. Configurable por tenant.

Respuesta: Este es un parámetro que debe de definirse por aplicación.

Información adicional:

#### P50. ¿Qué formatos deben aceptarse definitivamente en import/export?

Por qué importa: Sprint 8 bloquea JSON import y soporta CSV/XLSX; export puede requerir formatos adicionales.

Opciones:

- A. CSV/XLSX solamente.
- B. CSV/XLSX/PDF para export.
- C. Agregar JSON export, pero no import.

Respuesta: Son parámetros que deben definirse por aplicación.

Información adicional:

##

## Decisiones transversales desbloqueadas por Sprints 1 a 8

#### P51. ¿Cuándo se implementarán handlers autenticados para los endpoints ya inventariados?

Por qué importa: `docs/API_ENDPOINT_INVENTORY.md` marca handlers pendientes desde Sprint 3 hasta Sprint 8.

Opciones:

- A. Sprint dedicado antes de Core AI.
- B. Implementarlos junto con cada módulo visual.
- C. Mantener contratos hasta Sprint 10.

Respuesta: No estoy seguro si el concepto de Handler es a nivel del router de Next.js. Si es así, cada módulo o elemento que se vaya generando debe tener su Handler. Los Handlers también están definidos a nivel de la documentación del proyecto. Deberías revisarla para confirmar toda esta información. Pero, en resumen, cada módulo que se vaya generando debe existir y activar los handlers correspondientes.

Información adicional:

#### P52. ¿Qué entorno será la fuente de verdad para validar migraciones?

Por qué importa: Sprints 3 a 8 crearon SQL versionado, pero no se aplicó en Supabase real.

Opciones:

- A. Supabase local.
- B. Supabase cloud development.
- C. Ambos, local antes de cloud.

Respuesta: Esta es una pregunta que ya está repetida en este cuestionario. Es una pregunta preocupante porque es un error de la metodología.

Deberíamos haber definido, desde el primer momento, antes de comenzar el Sprint 1, el acceso a la base de datos SupaBase que vamos a utilizar para todo el proyecto, para no tener nada pendiente de ejecución de SQL.

Información adicional:

#### P53. ¿Autorizas activar MCP Supabase/SonarQube?

Por qué importa: MCP está preparado/deshabilitado y requiere tokens fuera del repo.

Opciones:

- A. No activar.
- B. Activar Supabase read-only.
- C. Activar Supabase read-only y SonarQube.
- D. Activar con permisos de escritura puntuales.

Respuesta: Este es otro error de la metodología. Debería de haberse definido desde el inicio el acceso a estos dos recursos, que son básicos para la construcción del framework.  Deberían de haberse activado desde el inicio, desde antes de comenzar el Sprint 1.

Información adicional:

#### P54. ¿Dónde debe correr CI con lint, typecheck, tests, build, audit y secret scan?

Por qué importa: localmente pasó `npm run check`, pero release necesita gates reproducibles.

Opciones:

- A. GitHub Actions.
- B. Otro CI.
- C. Solo local por ahora.

Respuesta:  Esta es una pregunta que no entiendo por completo. No sé qué significa CI con lint, type checks, test, etc. Necesito una explicación. Me suena a Github Actions, pero no estoy seguro, entonces necesito tu explicación antes de tomar una decisión.

Información adicional:

#### P55. ¿Quieres activar SonarQube antes del Sprint 11?

Por qué importa: el plan lo ubica en Sprint 11, pero puede detectar problemas antes.

Opciones:

- A. No, mantener Sprint 11.
- B. Sí, activarlo ahora en modo informativo.
- C. Sí, bloquear merges desde ahora.

Respuesta: Otra pregunta que demuestra errores grandes en nuestra metodología: no deberíamos haber comenzado el desarrollo de este proyecto sin tener activo SupaBase y SonarQube!


Información adicional:

#### P56. ¿Qué observabilidad mínima debe existir antes de usar servicios reales?

Por qué importa: jobs, webhooks, billing, imports y AI necesitan logs, métricas y alertas para operar.

Respuesta: No entiendo a qué te refieres con "observabilidad mínima". Necesito que me expliques bien este concepto y sus implicaciones antes de poder tomar una decisión.

Información adicional:

#### P57. ¿Redis seguirá default off o quieres activarlo para cache/locks/colas?

Por qué importa: Redis está diferido; puede ser necesario para producción multi-instancia.

Opciones:

- A. Mantener default off.
- B. Activar solo cache/rate limit.
- C. Activar cache, locks y colas.

Respuesta: Me gustaría manejarlo por el momento en off para no meter mayor complicación al stack en este momento. Es un tema en el que tendremos que activarlo para hacer pruebas futuras, ya cuando hayamos terminado de crear el framework.

Información adicional:

#### P58. ¿Qué datos se pueden usar en pruebas end-to-end y staging?

Por qué importa: el proyecto prohíbe secretos y datos sensibles reales; falta política de datasets.

Opciones:

- A. Datos sintéticos marcados.
- B. Datos anonimizados.
- C. Datos reales solo con aprobación legal.

Respuesta: Esta pregunta me hace pensar que tenemos un error en nuestra metodología, porque, definitivamente, para crear aplicaciones de forma local necesitamos secretos. Entonces, no debería existir una prohibición de tener secretos.

Lo que debería existir es un mecanismo de control para evitar la fuga de los secretos, como, por ejemplo, una función en el control Git de Docker para ignorar los archivos más comunes como .env y .env.local,  Deberían ser totalmente excluidos. De existir, un control que haga una auditoría constante de que no exista ninguna referencia a ninguna llave o ninguno de estos archivos expuestos fuera del desarrollo local Pero sí debería de existir la capacidad para poder tener, por lo menos en el archivo .env.local Cualquier cantidad de llaves que nos sean útiles para la creación y funcionamiento del software que estamos construyendo

Información adicional:

#### P59. ¿Qué autorización exacta darás para iniciar Sprint 9?

Por qué importa: Sprint 9 incluye Core AI/OpenRouter y puede usar proveedor externo, secretos y costos.

Opciones:

- A. Aprobar Sprint 9 sin provider real.
- B. Aprobar Sprint 9 con OpenRouter real en dev.
- C. Diferir Sprint 9 hasta cerrar decisiones anteriores.

Respuesta:  Una vez hayamos aclarado todas las dudas que están pendientes, hayamos corregido todos los errores que hemos identificado con este cuestionario (que se ha realizado desde el Sprint 1), antes de comenzar el Sprint 9, sí deberíamos tener todo.
El Core AI actúa como un gestor de conexiones con modelos de inteligencia artificial. Debe existir la capacidad de:

- Registrar proveedores.
  - Registrar todos los datos necesarios de ese proveedor.
  - Tener la capacidad de utilizar múltiples proveedores.
  Por ejemplo, yo podría registrar Open Router varias veces, cada uno con modelos de inteligencia artificial diferentes, y obviamente tener la capacidad de registrar los parámetros de cada uno de esos módulos (sus costos, etc.). Para poder elegir cuál de los proveedores puedo utilizar dependiendo de mis necesidades.
  Es importante entender que esta es una capacidad que el framework va a proveerle a las aplicaciones finales. No es algo que va a poder ser utilizado directamente en el framework. Se pueden hacer pruebas, pero su objetivo es más utilizarlo ya en las aplicaciones creadas a partir del framework.

Información adicional:

#### P60. ¿El modelo OpenRouter inicial sigue siendo el correcto o debe revalidarse/cambiarse?

Por qué importa: el estado exige revalidar el ID antes de Core AI ejecutable.

Opciones:

- A. Revalidar `google/gemma-4-26b-a4b-it:free`.
- B. Elegir otro modelo antes de Sprint 9.
- C. Implementar adapter sin modelo por defecto.

Respuesta:  Este no debería ser un problema. Se puede ocupar el código que ya tienes, pero, al ser también una opción parametrizable, lo podríamos modificar cuando sea necesario.

Información adicional:

#### P61. ¿Qué límites de costo y uso aplicarán a AI, jobs, exports y storage?

Por qué importa: los módulos ya tienen contratos, pero los límites comerciales reales afectan seguridad y billing.

Respuesta: Este es un tema nuevo que no había identificado anteriormente. Sin embargo, creo que lo podemos definir también como parámetros globales de la aplicación. Esto lo podemos ir trabajando cuando hayamos avanzado con la creación del framework.

Información adicional:

#### P62. ¿Qué decisiones requieren revisión legal externa antes de release?

Por qué importa: consentimientos, licencia comercial, términos, privacidad, billing e invoices pueden requerir revisión legal.

Respuesta: Definitivamente, cada empresario, emprendedor o equipo técnico que vaya a utilizar el framework para construir una aplicación debe ser el responsable de validar la documentación legal que se va a utilizar en la aplicación final. No es el framework quien va a definir estas decisiones.

Información adicional:

## Prioridad sugerida para responder

| Prioridad | Preguntas                                                          | Motivo                                    |
| --------- | ------------------------------------------------------------------ | ----------------------------------------- |
| Alta      | P11, P12, P17, P18, P28, P34, P40, P42, P51, P52, P59, P60         | Desbloquean ejecución técnica y Sprint 9. |
| Media     | P2, P3, P13, P19, P20, P23, P29, P37, P43, P45, P47, P49, P53, P54 | Definen operación segura.                 |
| Baja      | P6, P7, P8, P9, P10, P24, P25, P26, P31, P38, P55, P57, P62        | Pueden cerrarse antes de release.         |

## Aprobaciones explícitas separadas

Estas acciones no quedan aprobadas por responder el cuestionario. Requieren frase explícita antes de ejecutarse:

- Aplicar migraciones local/cloud: Como he dicho a lo largo de este cuestionario, para mí es un error de la metodología el no haber comenzado a trabajar en forma directa con la base de datos identificada en la nube de SupaBase.
- Leer o usar secretos reales: Como he dicho a lo largo de este cuestionario, para mí es un error de la metodología impedir el uso de secretos. No debería impedirse; debería controlarse a través de los archivos que ya están claramente definidos a lo largo de este cuestionario.
- Activar MCP:  Deberíamos tener acceso a los MCPs de SupaBase y Sonarqube, al menos desde el inicio de este proyecto.  Pero también podríamos utilizar el CLI de SupaBase y el CLI de Github.
- Activar Supabase remoto con escritura: No entiendo este punto. El hecho de activar SupaBase remoto con escritura: claro que tendríamos que tener capacidad de escribir para poder hacer cambios, generar registros y borrar registros en toda la fase de desarrollo del framework.
- Activar Stripe real o cobros: Como lo dije a lo largo de este cuestionario, Stripe es uno de los proveedores que pensamos utilizar en el motor de procesamiento de pagos del Framework. No veo como un stopper el hecho de si tenemos o no un Stripe en este momento. Si lo tuviésemos, incluso podríamos utilizar el MCP de Stripe y utilizar credenciales en modo sandbox para hacer pruebas.
- Activar Resend real:  Deberíamos tener activo RESEND desde el inicio para poder ejecutar cualquier envío de mensajes a través del framework.
- Activar Inngest cloud:  El concepto de ingest es uno de los que te pedí ayuda para entender a qué se refiere, porque no tengo claro si es una librería de Next.js o de Node.js, o si es un aplicativo externo que hay que configurar. Necesito explicación antes de tomar una decisión.
- Enviar webhooks reales: No entiendo en qué momento vamos a ocupar webhooks en la construcción del framework. Necesito una explicación.
- Ejecutar purgas reales: No entiendo a qué te refieres con “purgas reales.” En este cuestionario mencioné que podríamos tener la capacidad de generar información demo y eliminar centralizadamente la información demo que podamos generar, para dejar libre o vacío, con sólo los registros necesarios del framework, y servir de base para una aplicación futura.
- Ejecutar k6 contra staging/producción:  No entiendo qué es K6. No sé si es una librería, si es un producto como Redis, SupaBase o SonarQube, pero necesito entenderlo antes de tomar una decisión.
- Activar OpenRouter real: Open Router se va a convertir en un proveedor de lo que va a utilizar la lógica o el motor del Core AI. El Core AI puede tener múltiples proveedores, incluso múltiples instancias de Open Router con modelos diferentes.
- Publicar/deployar servicios cloud: No entiendo a qué te refieres. No sé si te refieres a que, cuando terminemos el proceso de creación del framework, pudiéramos hacer la publicación de esto en un servicio como Coolify para poder ver cómo funciona en un ambiente público. Necesito tu ayuda para entender a qué te refieres con este tema.

## Reconciliación Fase 1 - 2026-06-21

| Decisión | Resultado aplicado |
|---|---|
| Accesos reales primero | GitHub origin, GitHub CLI, Supabase cloud dev y Sonar host fueron validados antes de Sprint 9. |
| Supabase cloud dev como fuente de verdad | Migraciones Sprint 3, 4, 6, 7 y 8 aplicadas al project-ref aprobado. |
| `.env.local` | No se creó ni se leyó por regla de seguridad del repo; `.env.example` documenta placeholders. |
| `bootstrap.json` | Quedó local-only, ignorado por Git y retirado del índice. |
| `bootstrap.example.json` | Quedó versionado como estructura segura para tests. |
| Demo/dummy | Se normalizó como `is_demo = true`; tablas fundacionales quedan protegidas. |
| Handler privado | `GET /api/v1/settings` queda como referencia real; contratos sin route siguen no implementados. |
| SonarQube | `sonar-project.properties` y workflow CI creados; baseline queda pendiente de GitHub Secrets. |
| Sprint 9 | Sigue bloqueado hasta cierre explícito de Fase 1. |
