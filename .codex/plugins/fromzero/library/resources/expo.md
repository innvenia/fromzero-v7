# Expo

## Activar cuando

- El PRD menciona app movil, Expo, React Native, iOS, Android o EAS.

## Reglas

- Separar API backend de cliente movil.
- Usar variables `EXPO_PUBLIC_*` solo para valores públicos.
- Tokens y secretos no deben ir al bundle movil.
- Revisar almacenamiento seguro para sesiones o tokens.
- Validar navegación, permisos de dispositivo y builds.

## Variables

Públicas:

- `EXPO_PUBLIC_API_URL`

Secretas de CI:

- `EXPO_TOKEN`

## Gates

- EAS build definido si hay release movil.
- Pruebas en al menos un viewport/dispositivo objetivo.
- Manejo de offline, permisos y errores.
- No incluir secretos en cliente.
