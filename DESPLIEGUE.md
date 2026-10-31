# Koh Tao Café · Web

Web pública de una sola página (React + Vite + Tailwind), publicada en **Cloudflare Pages**: https://cafeteriakohtao.pages.dev

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

`git push` a `main` → **Cloudflare Pages** compila y publica en 1-2 minutos. Proyecto `cafeteriakohtao` conectado al repositorio: directorio raíz `KohTaoFront`, `npm run build`, salida `dist`. Las cabeceras de seguridad y los enlaces cortos están en `KohTaoFront/public/_headers` y `_redirects`; la versión de Node en `KohTaoFront/.node-version`.

Se dejó Netlify porque su plan gratuito muestra a los visitantes un distintivo "Powered by Netlify". El sitio de Netlify sigue activo **solo para redirigir** los enlaces antiguos (`cafeteriakohtao.netlify.app/...`) a la nueva dirección (`netlify.toml`); al ser una redirección no muestra el distintivo. No borrarlo mientras circulen enlaces antiguos.

Si se compra dominio propio: conectarlo en Cloudflare (**Custom domains**), poner esa dirección en `NEGOCIO.sitioUrl` y en el `to` de `netlify.toml`.

## Formulario "Escríbenos" (pendiente al abrir el local)

Usa Netlify Forms, que **no funciona en Cloudflare Pages**. Mientras dure el modo pre-apertura no se muestra; antes de abrir hay que sustituirlo por un botón de correo como el de empleo (o por otro servicio de formularios).

## Modo pre-apertura (local en obras)

Con `MODO_PREAPERTURA = true` en `KohTaoFront/src/config/negocio.js`, la web entera es solo el vídeo de cabecera + la oferta de empleo + el pie (sin horario). Al compartir el enlace principal se ve el cartel de empleo.
**Al abrir el local:** ponerlo en `false` y hacer `git push` → vuelve la web completa con la carta, sobre nosotros y contacto, más una franja que enlaza a la oferta mientras `EMPLEO.activa` sea `true`.

## Trabaja con nosotros (oferta de empleo)

Página propia para compartir por WhatsApp/Instagram: **https://cafeteriakohtao.pages.dev/trabaja-con-nosotros/** (atajos: `/empleo` y `/trabajo`).
- Textos, puesto, correo y fecha: `KohTaoFront/src/config/empleo.js`. Para cerrar la oferta, `activa: false` (se quita el aviso de la portada).
- El botón **Envíanos tu CV** abre la app de correo del propio dispositivo con destinatario, asunto y un texto base ya escritos; el candidato adjunta el CV y lo envía directo a `kohtaocafeelejido@gmail.com`. No pasa por Netlify ni requiere configuración.
- Vista previa al compartir: `public/empleo-cartel.jpg` (el cartel). Incluye datos `JobPosting` para Google Empleos.

## SEO (buscadores y vista previa al compartir)

Se genera solo en cada build con `KohTaoFront/seo/vitePluginSeo.js`, a partir de `src/config/negocio.js` (bloques `NEGOCIO` y `SEO`):
- `<title>`, meta descripción, URL canónica y Open Graph (imagen `public/og-image.jpg`, 1200×630).
- Datos estructurados schema.org `CafeOrCoffeeShop` con la dirección. El teléfono y los perfiles de redes se añaden solos cuando estén en `negocio.js`. El horario **no** se publica hasta tener el real.
- `robots.txt` y `sitemap.xml`.

Si se compra dominio propio, basta con cambiar `NEGOCIO.sitioUrl`.

**Google Search Console** (una vez): https://search.google.com/search-console → Añadir propiedad → *Prefijo de URL* `https://cafeteriakohtao.pages.dev/` → verificar con **Etiqueta HTML** (copia el valor de `content` y se añade a `index.html`) → Sitemaps → enviar `sitemap.xml` → Inspección de URLs → *Solicitar indexación*.
