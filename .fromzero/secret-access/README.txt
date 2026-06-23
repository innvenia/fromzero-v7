Acceso a tus variables locales (.env.local) en Codex
====================================================
Estos archivos te dejan usar tus llaves y endpoints con Codex sin mostrarlos nunca.

Pasos:
1. Completa el archivo .env.local con tus valores.
2. La config local del proyecto ya quedo creada en .codex/config.toml.
   Usa .fromzero/secret-access/codex-config-snippet.toml solo si necesitas
   copiar la misma politica a tu config global de Codex.
3. Reinicia Codex para heredar las variables de usuario ya cargadas, o inicia
   Codex con el lanzador (carga tus variables y abre Codex):
   - Windows:   ./start-codex.ps1
   - Mac/Linux: ./start-codex.sh

Despues de esto, Codex se conecta a tus herramientas (Supabase, SonarQube, etc.)
por CLI y MCP, y nunca muestra ni guarda tus secretos.
