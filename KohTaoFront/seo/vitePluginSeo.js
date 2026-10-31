// Plugin de Vite: SEO generado desde src/config/negocio.js y src/config/empleo.js (únicas fuentes de datos).
// - Inyecta en cada página: title, description, canonical, Open Graph / Twitter y datos estructurados (schema.org)
// - Genera robots.txt y sitemap.xml en el build
import { NEGOCIO, SEO, MODO_PREAPERTURA, mapaComoLlegarUrl } from '../src/config/negocio.js';
import { EMPLEO, RUTA_EMPLEO, SEO_EMPLEO } from '../src/config/empleo.js';

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

  return aJsonSeguro(datos);
}

// Oferta de empleo para Google Empleos (solo mientras esté activa)
function datosOfertaEmpleo() {
  const { calle, codigoPostal, localidad, provincia, pais } = NEGOCIO.direccion;
  return aJsonSeguro({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: EMPLEO.puesto,
    description: `<p>${EMPLEO.intro}</p><p><strong>Imprescindible:</strong> ${EMPLEO.imprescindible}</p>` +
      `<p><strong>También valoramos:</strong></p><ul>${EMPLEO.valoramos.map(({ texto }) => `<li>${texto}</li>`).join('')}</ul>`,
    datePosted: EMPLEO.fechaPublicacion,
    hiringOrganization: { '@type': 'Organization', name: NEGOCIO.nombre, sameAs: urlAbsoluta('/'), logo: urlAbsoluta('/favicon-192.png') },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: calle.replace(/^C\/\s*/, 'Calle '),
        postalCode: codigoPostal,
        addressLocality: localidad,
        addressRegion: provincia,
        addressCountry: pais,
      },
    },
  });
}

// Evita que un "<" en los datos cierre la etiqueta <script>
const aJsonSeguro = datos => JSON.stringify(datos).replace(/</g, '\\u003c');

const meta = (atributos) => ({ tag: 'meta', attrs: atributos, injectTo: 'head' });
const jsonLd = (datos) => ({ tag: 'script', attrs: { type: 'application/ld+json' }, children: datos, injectTo: 'head' });

// Datos de cada página (clave: ruta del HTML en el proyecto)
function datosPagina(rutaHtml) {
  const oferta = EMPLEO.activa ? [datosOfertaEmpleo()] : [];
  if (rutaHtml.startsWith(RUTA_EMPLEO)) {
    return { ...SEO_EMPLEO, ruta: RUTA_EMPLEO, estructurados: oferta, dimensionesImagen: ['919', '1378'] };
  }
  // En obras la portada es la oferta: al compartir el enlace principal se ve el cartel
  if (MODO_PREAPERTURA) {
    return { ...SEO_EMPLEO, ruta: '/', estructurados: [datosEstructurados(), ...oferta], dimensionesImagen: ['919', '1378'] };
  }
  return { ...SEO, ruta: '/', estructurados: [datosEstructurados()], dimensionesImagen: ['1200', '630'] };
}

export default function seoPlugin() {
  return {
    name: 'koh-tao-seo',

    transformIndexHtml(_html, ctx) {
      const pagina = datosPagina(ctx.path);
      const url = urlAbsoluta(pagina.ruta);
      const [ancho, alto] = pagina.dimensionesImagen;
      return [
        { tag: 'title', children: pagina.titulo, injectTo: 'head' },
        meta({ name: 'description', content: pagina.descripcion }),
        { tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' },
        // Vista previa al compartir (WhatsApp, Facebook, Instagram, X)
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:locale', content: 'es_ES' }),
        meta({ property: 'og:site_name', content: NEGOCIO.nombre }),
        meta({ property: 'og:title', content: pagina.titulo }),
        meta({ property: 'og:description', content: pagina.descripcion }),
        meta({ property: 'og:url', content: url }),
        meta({ property: 'og:image', content: urlAbsoluta(pagina.imagen) }),
        meta({ property: 'og:image:width', content: ancho }),
        meta({ property: 'og:image:height', content: alto }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        ...pagina.estructurados.map(jsonLd),
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
          `  <url><loc>${urlAbsoluta(RUTA_EMPLEO)}</loc><lastmod>${hoy}</lastmod></url>\n` +
          '</urlset>\n',
      });
    },
  };
}
