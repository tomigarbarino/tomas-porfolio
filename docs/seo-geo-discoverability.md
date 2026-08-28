# Visibilidad SEO y GEO

## Resumen

El portfolio entrega HTML completo para la portada y el caso Trainly en español e inglés. Antes de este cambio, cualquier crawler que no ejecutara JavaScript recibía solamente la plantilla vacía de Create React App. Ahora cada URL contiene el texto real, metadata propia, enlaces de idioma y datos estructurados desde la primera respuesta.

Esto mejora la capacidad de Google, Bing, OAI-SearchBot y otros sistemas de búsqueda para descubrir, interpretar y citar el perfil y el caso de producto. No garantiza posiciones ni citas: esas señales también dependen de indexación, autoridad externa, relevancia y tiempo.

## Experiencia de usuario

- `/` mantiene español rioplatense como idioma principal.
- `/en` es la portada inglesa indexable.
- `/trainly` es el caso Trainly en español.
- `/en/trainly` es el caso Trainly en inglés.
- El selector `ES / EN` navega entre URLs equivalentes y conserva la sección actual cuando existe un hash.
- `/es`, `/es/trainly` y el alias histórico `/trainyl` redirigen a sus rutas canónicas.
- El diseño, el movimiento y el comportamiento responsive no cambian.

## Descripción técnica

### Renderizado

`npm run build` ejecuta primero `react-scripts build` y luego `scripts/prerender-seo.cjs`. El segundo paso usa `react-dom/server` para renderizar el componente real de cada ruta con su idioma correspondiente. No mantiene una copia paralela del contenido: consume `src/i18n/content.ts` y los mismos componentes que usa el navegador.

`src/index.js` hidrata ese HTML con `hydrateRoot`. Si la aplicación se ejecuta sin prerender, conserva el fallback de `createRoot`.

### Metadata y entidades

`src/lib/seo.ts` centraliza:

- paths canónicos por página e idioma;
- títulos, descripciones y Open Graph;
- alternates `es-AR`, `en` y `x-default`;
- `ProfilePage` con `Person` para la portada;
- `WebPage` con `SoftwareApplication` y autor para Trainly;
- actualización de metadata durante navegación cliente.

El contenido estructurado describe solamente información visible o verificable. No agrega métricas de impacto no validadas.

### Crawlers y despliegue

- `public/robots.txt` permite el rastreo general y explicita acceso para `OAI-SearchBot`.
- `public/sitemap.xml` declara las cuatro URLs y sus equivalencias lingüísticas.
- `vercel.json` sirve cada documento prerenderizado y elimina el catch-all que hacía responder la portada para cualquier URL.

## Flujo

```mermaid
flowchart LR
    Content[src/i18n/content.ts] --> React[Componentes React]
    Content --> SEO[src/lib/seo.ts]
    React --> Build[react-scripts build]
    SEO --> Prerender[scripts/prerender-seo.cjs]
    Build --> Prerender
    Prerender --> ES[/]
    Prerender --> EN[/en]
    Prerender --> TrainlyES[/trainly]
    Prerender --> TrainlyEN[/en/trainly]
    ES --> Hydrate[hydrateRoot + GSAP]
    EN --> Hydrate
    TrainlyES --> Hydrate
    TrainlyEN --> Hydrate
```

## Notas operativas

- Ejecutar `npm run seo:verify` después de cada build. Falla si falta contenido, canonical, schema, idioma, alternates, sitemap o acceso de OAI-SearchBot.
- Las rutas inglesa y española deben mantenerse en pares.
- Cualquier nueva página indexable debe agregarse a `scripts/prerender-seo.cjs`, `scripts/verify-seo.cjs`, el sitemap y las reglas de Vercel.
- Google Search Console y Bing Webmaster Tools requieren verificación desde una cuenta del propietario. No se registran automáticamente desde el repositorio.
- El dominio propio sigue siendo un posible paso posterior; el sitio continúa usando el alias público actual de Vercel.

## Validación

- `npm run type-check`: aprobado.
- `npm run build`: aprobado; cuatro rutas prerenderizadas.
- `npm run seo:verify`: aprobado.
- `npm test -- --watchAll=false --runInBand --passWithNoTests`: aprobado sin tests existentes.
- Playwright en 1440 px y 390 px: cuatro rutas, selector de idioma, canonicals y `lang` correctos; sin overflow horizontal, imágenes rotas ni errores de consola.
- Cantidad de texto visible en HTML inicial: entre 4.133 y 4.975 caracteres según la ruta.

## Riesgos y próximos pasos

- La indexación y las citas generativas no son inmediatas ni garantizadas.
- Registrar el sitio y enviar el sitemap en Google Search Console y Bing Webmaster Tools.
- Solicitar reindexación de las cuatro URLs después del despliegue.
- Evaluar un dominio propio para consolidar la identidad y los enlaces externos.
- Monitorear consultas, impresiones, páginas indexadas y citas en experiencias de IA antes de cambiar el contenido por intuición.
