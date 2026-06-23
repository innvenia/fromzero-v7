# Prompt para Claude Code

Necesito modificar la metodologia FromZero para permitir acceso operativo controlado a variables locales de entorno.

Problema:
Actualmente los agentes no pueden usar `.env.local`, aunque el usuario ya lleno ahi los endpoints, tokens, llaves y credenciales necesarias para operar el TechStack del proyecto. Esto bloquea consultas reales a herramientas como SonarQube, Supabase, MCPs, CLIs y APIs directas.

Objetivo:
Actualizar la metodologia para que Codex, Claude Code, Google Antigravity y subagentes puedan usar variables de `.env.local` de forma segura, sin exponer secretos, para operar herramientas del TechStack del proyecto.

Politica requerida:
Implementa una politica llamada:

Controlled Secret Runtime Access

Regla central:
Los agentes pueden leer `.env.local` unicamente como fuente secreta de configuracion operativa. Pueden usar sus valores en memoria, variables de proceso, MCPs, CLIs, SDKs o APIs del TechStack. Nunca pueden mostrar, copiar, registrar ni versionar esos valores.

Usos permitidos:

- Conexion directa a herramientas via API HTTP.
- Conexion a herramientas via MCP.
- Conexion a herramientas via CLI.
- Ejecucion de scanners, quality gates, coverage, security checks y auditorias.
- Configuracion local de MCPs.
- Uso por agentes y subagentes dentro del proyecto autorizado.

Usos prohibidos:

- Imprimir secretos.
- Mostrar `.env.local` completo.
- Ejecutar comandos que impriman todo el entorno sin redaccion.
- Copiar secretos a documentacion.
- Copiar secretos a prompts, respuestas o resumenes.
- Guardar secretos en archivos versionados.
- Incluir secretos en commits o diffs.
- Exponer secretos en logs.
- Usar credenciales fuera del proyecto.

Reglas de reporte:
Solo se permite reportar presencia o ausencia.

Ejemplo permitido:

    SONARQUBE_TOKEN_set: true
    SUPABASE_ACCESS_TOKEN_set: true

Ejemplo prohibido:

    SONARQUBE_TOKEN=valor_real

Alcance:
Esta politica debe aplicar a:

- Codex
- Claude Code
- Google Antigravity
- subagentes
- scripts de metodologia
- flujos MCP
- flujos CLI
- flujos API directa

No debe convertirse en permiso libre para exponer secretos. Debe abrir el uso operativo, no la visibilidad.

Tareas:

1. Revisa la estructura real de la metodologia antes de editar.

   Incluye, si existen:

   - AGENTS.md
   - README.md
   - FIRST_STEPS.md
   - templates
   - skills
   - checklists
   - library/resources
   - tools
   - documentacion MCP
   - adaptadores/plugins de Codex
   - adaptadores/plugins de Claude Code
   - adaptadores/plugins de Google Antigravity

2. Localiza reglas actuales que prohiben leer `.env`, `.env.local` o secretos locales.

3. Reemplaza la prohibicion absoluta por la politica nueva:

   - lectura operativa permitida;
   - exposicion prohibida.

4. Agrega o actualiza un script reutilizable para cargar `.env.local`.

   Requisitos:

   - leer `.env.local`;
   - no imprimir valores;
   - cargar variables en el proceso;
   - soportar actualizacion cuando `.env.local` cambie;
   - mostrar solo nombres y estado;
   - funcionar para API, MCP y CLI;
   - ser entendible por una persona no tecnica.

5. El script debe soportar aliases minimos:

   - `SONAR_TOKEN` -> `SONARQUBE_TOKEN`
   - `SONAR_HOST_URL` -> `SONARQUBE_URL`
   - `SONAR_PROJECT_KEY` -> `SONARQUBE_PROJECT_KEY`

6. Documenta un flujo simple para usuario final:

   1. Completa `.env.local`.
   2. Ejecuta el comando de carga.
   3. Reinicia el agente si aplica.
   4. Listo.

7. Actualiza documentacion MCP:

   - MCPs pueden usar variables tomadas de `.env.local`;
   - no deben tener secretos versionados;
   - `.mcp.json` local puede usar variables o placeholders;
   - secretos inline solo si el archivo esta ignorado por Git, no se imprime y es tecnicamente necesario.

8. Actualiza `.env.example` solo si faltan nombres necesarios.

   No agregues valores reales.

9. Agrega guardrails:

   - si un secreto aparece en salida, detenerse;
   - recomendar rotacion;
   - revisar diff antes de finalizar;
   - confirmar que `.env.local` esta ignorado por Git.

10. No cambies logica de aplicacion salvo que sea necesario para esta politica.

11. No borres cambios existentes del usuario.

12. No inventes rutas, herramientas ni plugins. Descubre primero.

Verificacion minima:

- Probar el script con un archivo temporal sin secretos reales.
- Confirmar que no imprime valores.
- Confirmar aliases de SonarQube.
- Confirmar que `.env.local` sigue ignorado por Git.
- Revisar diff para asegurar que no hay secretos.
- Reportar comandos ejecutados.

Criterios de aceptacion:

- Los agentes pueden usar `.env.local` para API, MCP y CLI.
- Los secretos no se imprimen ni se versionan.
- El flujo es simple para usuarios normales.
- SonarQube puede consultarse usando variables locales.
- Supabase y demas herramientas del TechStack quedan cubiertas.
- La politica aplica tambien a subagentes.
- La metodologia distingue claramente uso operativo vs exposicion.

Entrega final:
Devuelve un resumen breve con:

- reglas modificadas;
- scripts agregados o modificados;
- documentacion actualizada;
- comandos probados;
- riesgos restantes.

Nota de formato:
No uses bloques Markdown con triple backtick dentro de este prompt. Si necesitas mostrar ejemplos, usa texto indentado como en los ejemplos anteriores.
