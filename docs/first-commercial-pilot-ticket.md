# Primera prueba comercial · 12 septiembre 2026

Autorización inicial: implementar localmente y preparar revisión. Ampliación del 12 septiembre 2026: Tomás pidió actualizar el portfolio, realizar la primera captación y registrar mensajes y seguimientos. Publicación y primera tanda de cinco contactos autorizadas; sin compra de publicidad ni compromisos de precio o entrega. Sitio indicado por Tomás: https://tomas-garbarino.vercel.app/. Base local limpia: `6a876e9`, rama `codex/first-commercial-pilot-20260912`. La carpeta inicial `porfolio accis` es otra versión y queda fuera de alcance.

## Problema y cambio

El portfolio demuestra criterio de producto pero sus ofertas abarcan demasiado. Un comerciante necesita reconocer su problema, entender qué recibe primero y poder escribir con pocos datos. Probar un piloto de pedidos por WhatsApp como primera oferta, conservando Tomás Garbarino, Trainly, Batech, diseño y movimiento actuales.

## Alcance

- `src/i18n/content.ts`: propuesta de valor ES/EN, tres servicios delimitados, primer piloto destacado, vínculo honesto entre Trainly y la oferta, contacto breve.
- `src/App.tsx`: tarjeta prioritaria, límites por servicio y email visible como alternativa al cliente de correo.
- `src/App.css`: estilos mínimos para esas adiciones.
- `public/index.html`: metadata inicial equivalente. El SEO generado ya deriva de `content.ts`.
- `scripts/verify-seo.cjs`: actualizar exclusivamente las dos frases esperadas del hero. Corregir en `App.tsx` los dos enlaces iniciales a secciones eliminadas, hacia Batech y el piloto.
- `outputs/commercial-pilot/`: diagnóstico, comparación de ofertas, 15 prospectos actuales, cinco mensajes, plan y evidencia de verificación.

No cambiar arquitectura, dependencias, datos, APIs, proveedores, hooks de animación ni afirmaciones de experiencia. No construir el producto comercial en este ticket. El piloto es un servicio propuesto, no un caso entregado.

## Aceptación

1. La primera pantalla nombra un problema comercial, mantiene la identidad personal y ofrece un contacto directo.
2. Tres servicios como máximo; el primero propone un flujo de pedidos, revisión humana y lista de preparación. Límites visibles; sin promesas de ahorro, plazos garantizados ni clientes inventados.
3. Trainly mantiene capturas, ruta y estado de validación; su conexión con el piloto no implica resultados en pedidos.
4. ES y EN equivalentes; asunto identifica el servicio; correo real y LinkedIn accesibles.
5. `npm run type-check`, `npm run build`, `npm run seo:verify`; ejecutar suite existente si la hay. Revisar navegador móvil/escritorio, enlaces internos, idiomas, correo y reduced motion; guardar capturas.
6. Prospectos: 15 nombres únicos, fuente directa y fecha, señal comprobada separada de hipótesis, canal público y prioridad. Registro comercial privado con envíos confirmados, pendientes y un seguimiento por negocio. Excluir `outputs/` de Git y Vercel; el estado de contacto depende de evidencia del canal.

## Riesgos y rollback

Riesgo bajo de contenido y medio de desborde por textos más largos. Verificar tamaños y traducciones. La evidencia pública de un canal no demuestra trabajo manual ni presupuesto: preguntarlo en descubrimiento.

Rollback previo a commit: restaurar únicamente `src/i18n/content.ts`, `src/App.tsx`, `src/App.css`, `public/index.html`, `scripts/verify-seo.cjs` desde `6a876e9` tras revisar que no haya ediciones posteriores ajenas. Conservar los entregables de investigación. Si luego se agrupa en un commit, revertir ese commit. Sin migraciones ni efectos externos.

## Implementación

Editar contenido y las tres adiciones visuales, verificar una sola compilación completa tras agrupar cambios, preparar diff y preview local. La autorización de implementación está incluida en el pedido del usuario.
