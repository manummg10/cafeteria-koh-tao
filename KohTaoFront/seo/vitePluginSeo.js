// Plugin de Vite: SEO generado desde src/config/negocio.js (única fuente de datos).
// - Inyecta en index.html: title, description, canonical, Open Graph / Twitter y datos estructurados (schema.org)
// - Genera robots.txt y sitemap.xml en el build
import { NEGOCIO, SEO, mapaComoLlegarUrl } from '../src/config/negocio.js';

const REDES_GENERICAS = /^https:\/\/www\.(instagram|facebook)\.com\/?$/;
const urlAbsoluta = ruta => `${NEGOCIO.sitioUrl}${ruta}`;

// Datos de negocio local que Google usa para búsquedas y fichas ("cafetería en El Ejido")
function datosEstructurados() {
  const { calle, codigoPostal, localidad, provincia, pais } = NEGOCIO.direccion;
  const datos = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: NEGOCIO.nombre,
    url: urlAbsoluta('/'),
    description: SEO.descripcion,
    image: urlAbsoluta(SEO.imagen),
    logo: urlAbsoluta('/favicon-192.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: calle.replace(/^C\/\s*/, 'Calle '),
      postalCode: codigoPostal,
      addressLocality: localidad,
      addressRegion: provincia,
      addressCountry: pais,
    },
    hasMap: mapaComoLlegarUrl,
    servesCuisine: ['Café', 'Repostería', 'Desayunos'],
    priceRange: '€',
  };
  // El horario NO se publica aquí hasta tener el real: Google lo mostraría en los resultados
  if (NEGOCIO.telefono) datos.telephone = NEGOCIO.telefono;
  const perfiles = Object.values(NEGOCIO.redes).filter(url => url && !REDES_GENERICAS.test(url));
  if (perfiles.length) datos.sameAs = perfiles;

  // Evita que un "<" en los datos cierre la etiqueta <script>
  return JSON.stringify(datos).replace(/</g, '\\u003c');
}

const meta = (atributos) => ({ tag: 'meta', attrs: atributos, injectTo: 'head' });

export default function seoPlugin() {
  return {
    name: 'koh-tao-seo',

    transformIndexHtml() {
      const url = urlAbsoluta('/');
      const imagen = urlAbsoluta(SEO.imagen);
      return [
        { tag: 'title', children: SEO.titulo, injectTo: 'head' },
        meta({ name: 'description', content: SEO.descripcion }),
        { tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' },
        // Vista previa al compartir (WhatsApp, Facebook, Instagram, X)
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:locale', content: 'es_ES' }),
        meta({ property: 'og:site_name', content: NEGOCIO.nombre }),
        meta({ property: 'og:title', content: SEO.titulo }),
        meta({ property: 'og:description', content: SEO.descripcion }),
        meta({ property: 'og:url', content: url }),
        meta({ property: 'og:image', content: imagen }),
        meta({ property: 'og:image:width', content: '1200' }),
        meta({ property: 'og:image:height', content: '630' }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: datosEstructurados(), injectTo: 'head' },
      ];
    },

    generateBundle() {
      const hoy = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${urlAbsoluta('/sitemap.xml')}\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url><loc>${urlAbsoluta('/')}</loc><lastmod>${hoy}</lastmod></url>\n` +
          '</urlset>\n',
      });
    },
  };
}
