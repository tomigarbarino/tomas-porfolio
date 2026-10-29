# Descubrimiento del perfil y sus casos

## Objetivo y alcance

Hacer que el HTML público, la identidad profesional, las URLs y sus equivalencias de idioma sean coherentes para buscadores y asistentes que usan búsqueda. No existe garantía de indexación, aparición, cita ni recomendación. Este trabajo no mide posiciones ni demuestra que un asistente haya incorporado el sitio.

La aplicación actual usa Next.js App Router, no Create React App ni un script de prerender separado. Los componentes de contenido y la metadata se comparten con las versiones españolas generadas por `scripts/i18n/build.mjs`. Las páginas de perfil de colaboración usan contenido bilingüe explícito. El render final debe verificarse después del build y, tras un eventual despliegue, en la respuesta HTTP pública.

## Rutas canónicas

| Inglés | Español |
| --- | --- |
| `/` | `/es` |
| `/en/agora` | `/es/agora` |
| `/en/trainly` | `/es/trainly` |
| `/en/orquestador` | `/es/orquestador` |
| `/writing` | `/es/writing` |
| `/writing/jev` | `/es/writing/jev` |
| `/product-engineering` | `/es/product-engineering` |

La portada inglesa es `/`; `/en` redirige allí. Los alias históricos `/agora`, `/trainly` y `/trainyl` redirigen a sus casos en inglés. No deben agregarse como documentos separados al sitemap. Las páginas de figuras son recursos enlazados desde el estudio, no parte de este inventario de páginas principales.

`languageAlternates` define equivalencias `en`, `es` y `x-default` (inglés). Next resuelve sus paths contra `metadataBase`; una URL relativa en ese objeto no es por sí misma un fallo. El sitemap incorpora las mismas equivalencias con URLs absolutas y enlaces recíprocos para ambos idiomas. No se agregan fechas `lastmod` sin una fecha real de actualización.

## Hallazgos y cambios

- **Rastreo general ya permitido:** `public/robots.txt` contiene `User-agent: *`, `Allow: /` y el sitemap correcto. Se conserva sin cambios. No era necesario agregar bloques específicos de agentes.
- **Identidad de páginas:** las versiones EN y ES de `ProfilePage` compartían el identificador `/#profile`. Ahora cada versión deriva su identificador de su propia URL. La persona mantiene un único `/#person` en ambos idiomas.
- **Identidad del sitio:** `WebSite` mantiene `/#website` y declara ambos idiomas. Writing referencia ese mismo identificador, en lugar de describir un sitio desconectado.
- **Estudio y página de lectura:** el artículo de lectura tiene identificador y `mainEntityOfPage`. La fecha del estudio publicado permanece en el trabajo original incluido; no se inventa una fecha de publicación o modificación para la página que lo presenta.
- **Atribución:** la metadata del Orquestador lo describe como desafío del AI Day de Flock. Los autores de los casos son autores del relato; `CreativeWork.author` no implica autoría exclusiva de Agora o Trainly.
- **Perfil para colaboraciones:** `contentPageMetadata` permite metadata propia para las nuevas páginas sin agregar claims ni contenido diferente del visible.
- **Documentación:** se reemplazaron instrucciones obsoletas sobre CRA, idioma por defecto, cuatro rutas y comandos inexistentes.

## Contrato del helper

```ts
import { contentPageMetadata } from '@/lib/seo';

contentPageMetadata({
  path: '/product-engineering', // español: /es/product-engineering
  language: 'en',             // español: es
  title: profile.title,
  description: profile.description,
});
```

La página debe proveer su propio título y descripción visibles o fieles al contenido, elegir el path canónico del idioma y renderizar enlaces navegables a sus casos. El helper devuelve canonical absoluto, alternates de ambos idiomas y `x-default`, Open Graph con URL/locale y Twitter. No crea el archivo de ruta, no publica contenido, no inventa una imagen ni reemplaza la metadata de la página.

Los nuevos textos de casos sí pasan por el flujo existente de traducción: agregar su traducción revisada al catálogo antes de ejecutar `i18n:build`. No editar directamente `src/localized`.

## Evidencia y límites de los claims

Las pantallas de demo de Agora y Trainly usan datos ficticios. Muestran una interfaz o recorrido, no resultados de clientes. La validación del cambio de Agora fue reportada por el equipo; debe conservar esa atribución. El estudio JEV es retrospectivo y mide acuerdo con referencias; no acredita calidad de contratación, equidad ni el resultado de todos los cambios de producción. Ninguna metadata debe ampliar esos límites.

No se agregan ratings, reviews, premios, métricas de negocio, disponibilidad fija, garantías de entrega ni propiedad individual de productos de Flock. No se crea un tipo de schema especial para asistentes. No se agrega `llms.txt` por rutina.

## Crawlers y fuentes oficiales

[OpenAI: bots](https://developers.openai.com/api/docs/bots) distingue `OAI-SearchBot` (búsqueda), `GPTBot` (entrenamiento) y `ChatGPT-User` (accesos iniciados por usuarios). Permitir búsqueda y permitir entrenamiento son decisiones diferentes. El wildcard actual permite rastreo general; este cambio no amplía ni modifica la política de entrenamiento.

[Google: AI features](https://developers.google.com/search/docs/appearance/ai-features) y [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) mantienen los fundamentos de búsqueda: acceso, contenido útil y enlaces, metadata y datos estructurados coherentes con lo visible. No requieren schema especial de IA; la guía indica que Google no usa `llms.txt` para ese fin.

Un robots permisivo no demuestra ausencia de bloqueos de infraestructura. Tras un despliegue hay que revisar HTTP, posibles protecciones de Vercel/WAF y el HTML que recibe un visitante anónimo. No se han modificado cuentas, Search Console, Bing Webmaster Tools ni configuración de infraestructura.

## Verificación

Ejecutar `node --test tests/discoverability.test.mjs` con las dependencias del proyecto instaladas. El test ejecuta los helpers reales, compara metadata contra el sitemap, verifica equivalencias recíprocas, identidad y atribución. La comprobación española requiere los módulos generados por el flujo i18n existente; se marca como omitida si todavía no existen.

La integración completa debe ejecutar los checks habituales del repositorio, incluida la generación de idiomas y el build. Luego inspeccionar las respuestas renderizadas de cada par: status 200, canonical propio, `html lang`, hreflang recíproco, JSON-LD válido y contenido visible sin depender de interacción. Comprobar también que los alias redirigen y que una URL inexistente devuelve 404. Los tests de fuentes no sustituyen esta verificación HTTP.

Después de un despliegue autorizado, el propietario puede enviar el sitemap a Google Search Console y Bing Webmaster Tools y consultar indexación e impresiones. Registrar consultas y referencias observadas antes de atribuir una mejora a estos cambios. ChatGPT Ads es un canal pago separado: no cambia la elegibilidad orgánica ni garantiza recomendaciones.

## Comprobación de la entrega del 29/10/2026

Typecheck y lint completados sin errores; 30 tests pasaron sin omisiones. El build de producción generó las dos páginas nuevas como HTML estático. La comprobación HTTP local confirmó 200, idioma, canonical, hreflang y JSON-LD en ambas portadas, ambos perfiles, los dos casos de Orquestador y las dos páginas del estudio; robots y sitemap respondieron 200 y una URL desconocida respondió 404. Las páginas nuevas mostraron su llamado a conversar y navegación activa en el idioma correcto. Esto verifica implementación y acceso local, no indexación externa.
