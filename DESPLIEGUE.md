# Koh Tao Café · Web

Web pública de una sola página (React + Vite + Tailwind), publicada en **Netlify**: https://cafeteriakohtao.netlify.app

No hay servidor ni base de datos: todo el contenido está en el código y se publica con `git push` a `main`.

> La versión con panel interno (login, carta editable, encargos y usuarios, con backend .NET en Render y MySQL en Aiven) está guardada en la rama **`panel-interno`**.

## Editar el contenido

| Qué | Dónde |
|---|---|
| Especiales (tartas del día) y carta con precios | `KohTaoFront/src/config/contenido.js` |
| Dirección, teléfono, horario y redes sociales | `KohTaoFront/src/config/negocio.js` |
| Firma del desarrollador y enlace a su web | `KohTaoFront/src/config/desarrollador.js` |
| Fotos | `KohTaoFront/public/images/` (webp o jpg de unos 800 px) |

Los datos de `contenido.js` son **ejemplos** hasta que la dueña facilite la carta, los precios y las fotos reales.

## Desarrollo local

```bash
cd KohTaoFront
npm install
npm run dev      # http://localhost:5173
npm run build    # comprueba que compila antes de publicar
```

## Publicar

`git push` a `main` → Netlify compila y publica en 1-2 minutos (`netlify.toml` define la carpeta y el build; las cabeceras de seguridad y los enlaces cortos están en `KohTaoFront/public/_headers` y `_redirects`).

## Mudanza a Cloudflare Pages (preparada, pendiente)

Motivo: el plan gratuito de Netlify muestra a los visitantes un distintivo "Powered by Netlify"; Cloudflare Pages es gratis y no lo pone.
El proyecto ya funciona en las dos plataformas (`_headers`, `_redirects` y `KohTaoFront/.node-version` las leen ambas). Pasos el día de la mudanza (~5 min):

1. Crear cuenta en https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → autorizar GitHub y elegir el repositorio `cafeteria-koh-tao`.
2. Configuración del build:
   - Project name: `cafeteriakohtao` (será la dirección `https://cafeteriakohtao.pages.dev`)
   - Production branch: `main`
   - Framework preset: *None* · Build command: `npm run build` · Build output directory: `dist`
   - Root directory (Advanced): `KohTaoFront`
3. **Save and Deploy**. Cuando termine, cambiar `NEGOCIO.sitioUrl` en `src/config/negocio.js` por la nueva dirección (canonical, vista previa al compartir y sitemap) y hacer `git push`.
4. Pendiente al abrir el local: el formulario "Escríbenos" usa Netlify Forms y **no funciona en Cloudflare** → sustituirlo por un botón de correo como el de empleo.
5. Cuando todo funcione, borrar el sitio en Netlify (el enlace `netlify.app` deja de funcionar) y volver a enviar el sitemap en Google Search Console con la nueva dirección.

Si se compra dominio propio, conectarlo en Cloudflare (**Custom domains**) y poner esa dirección en `NEGOCIO.sitioUrl`.

## Formulario "Escríbenos" (Netlify Forms)

Los mensajes llegan a Netlify sin servidor propio (plan gratuito: 100 al mes).
1. En Netlify, ve a **Site configuration → Forms → Enable form detection** (una sola vez) y vuelve a desplegar.
2. En **Forms → Form notifications**, añade una notificación por email para recibir cada mensaje en el correo de la cafetería.

El campo oculto `bot-field` descarta el spam de bots.

## Modo pre-apertura (local en obras)

Con `MODO_PREAPERTURA = true` en `KohTaoFront/src/config/negocio.js`, la web entera es solo el vídeo de cabecera + la oferta de empleo + el pie (sin horario). Al compartir el enlace principal se ve el cartel de empleo.
**Al abrir el local:** ponerlo en `false` y hacer `git push` → vuelve la web completa con la carta, sobre nosotros y contacto, más una franja que enlaza a la oferta mientras `EMPLEO.activa` sea `true`.

## Trabaja con nosotros (oferta de empleo)

Página propia para compartir por WhatsApp/Instagram: **https://cafeteriakohtao.netlify.app/trabaja-con-nosotros/** (atajos: `/empleo` y `/trabajo`).
- Textos, puesto, correo y fecha: `KohTaoFront/src/config/empleo.js`. Para cerrar la oferta, `activa: false` (se quita el aviso de la portada).
- El botón **Envíanos tu CV** abre la app de correo del propio dispositivo con destinatario, asunto y un texto base ya escritos; el candidato adjunta el CV y lo envía directo a `kohtaocafeelejido@gmail.com`. No pasa por Netlify ni requiere configuración.
- Vista previa al compartir: `public/empleo-cartel.jpg` (el cartel). Incluye datos `JobPosting` para Google Empleos.

## SEO (buscadores y vista previa al compartir)

Se genera solo en cada build con `KohTaoFront/seo/vitePluginSeo.js`, a partir de `src/config/negocio.js` (bloques `NEGOCIO` y `SEO`):
- `<title>`, meta descripción, URL canónica y Open Graph (imagen `public/og-image.jpg`, 1200×630).
- Datos estructurados schema.org `CafeOrCoffeeShop` con la dirección. El teléfono y los perfiles de redes se añaden solos cuando estén en `negocio.js`. El horario **no** se publica hasta tener el real.
- `robots.txt` y `sitemap.xml`.

Si se compra dominio propio, basta con cambiar `NEGOCIO.sitioUrl`.

**Google Search Console** (una vez): https://search.google.com/search-console → Añadir propiedad → *Prefijo de URL* `https://cafeteriakohtao.netlify.app/` → verificar con **Etiqueta HTML** (copia el valor de `content` y se añade a `index.html`) → Sitemaps → enviar `sitemap.xml` → Inspección de URLs → *Solicitar indexación*.
