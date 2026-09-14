# Oferta frontend para la primera prueba comercial

## Problema y alcance

La captación actual ofrece una entrega React/TypeScript a agencias y equipos con un producto existente, pero la tarjeta de tablero y su CTA piden información sobre pedidos de negocios. Hipótesis: un alcance concreto con evidencia próxima facilita una conversación relevante. No hay una mejora de conversión medida.

Implementación local autorizada por Tomás: sustituir esa tarjeta en ES/EN por un flujo o hasta dos pantallas acordadas, conexión a API existente, estados y comprobaciones del proyecto, PR y documentación. Darle ancla `#frontend`, una prueba vinculada a Batech y un mailto específico. Conservar identidad, piloto de pedidos y capacitación. Tres archivos: `src/i18n/content.ts`, `src/App.tsx`, `src/App.css`.

## Aceptación y verificaciones

- ES y EN explican comprador, entregable y límites; sin precios, plazos, métricas ni experiencia inventada.
- `/#frontend` y `/en#frontend` llegan a la tarjeta; el título queda visible debajo de la cabecera, también en móvil.
- El CTA usa el correo profesional y solicita producto, flujo, diseño/API existente, presupuesto y fecha objetivo. Abrirlo no envía mensajes.
- El enlace de evidencia llega al aporte personal en Batech. Los otros servicios conservan su CTA.
- `npm run type-check`, `npm run build`, `npm run seo:verify` y suite disponible; inspección visual en 390 px y 1440 px, ambos idiomas. Sin nueva suite que replique la copia.
- Revisar el diff local y dejar evidencia. Publicación pendiente de revisión; no subir el CV privado al sitio.

## Riesgos y rollback

Riesgo bajo: altura desigual de tarjetas y anclas bajo la cabecera. Reusar estilos; aplicar margen de scroll. La prueba visual detectó desplazamientos del enlace durante la carga inicial. La entrada por `#frontend` usa scroll inmediato y se alinea en un cuadro de renderizado posterior a la carga de página y fuentes; conserva las animaciones existentes. El efecto se limpia al salir y vuelve a alinear al cambiar idioma. Sin API, base de datos, dependencias ni nuevos mecanismos de tracking.

Rollback: revertir únicamente el commit de esta entrega; hasta entonces, deshacer sus cambios en los tres archivos. No afecta captación ni datos del ledger.

Propuesta: tarjeta identificada por clave estable, contenido bilingüe y CTA contextual. Medir después consultas útiles, propuestas y entregas pagas, sin atribuir causalidad a visitas o clics.

## Verificación local — 14/09/2026

- TypeScript, compilación de producción y verificación SEO de las cuatro páginas: correctos.
- La suite existente no contiene tests; ejecución en CI terminó con código 0 por `--passWithNoTests`. No equivale a pruebas funcionales automatizadas.
- Chrome a 390 × 844 y 1440 × 1000, ES/EN: contenido legible, sin desbordamiento horizontal; título visible al entrar por `#frontend` y al cambiar idioma.
- Título en móvil ES: y≈148 px; móvil EN: y≈197 px. En escritorio EN: y≈191 px; ES: y≈197 px. El CTA completo entra en escritorio y se alcanza mediante scroll en móvil.
- Verificados destinatario, asunto y campos del mailto en ambos idiomas sin enviar; enlace de evidencia abre `#batech` y su contribución frontend.
- Advertencias existentes: Browserslist desactualizado y carga CommonJS/ESM de GSAP durante prerender. La compilación termina correctamente; no se cambiaron dependencias.
- Vista local: `http://127.0.0.1:4174/#frontend`. Publicación pendiente de revisión.
