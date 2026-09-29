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

`git push` a `main` → Netlify compila y publica en 1-2 minutos (`netlify.toml` ya define la carpeta, el build y las cabeceras de seguridad).

## Formulario "Escríbenos" (Netlify Forms)

Los mensajes llegan a Netlify sin servidor propio (plan gratuito: 100 al mes).
1. En Netlify, ve a **Site configuration → Forms → Enable form detection** (una sola vez) y vuelve a desplegar.
2. En **Forms → Form notifications**, añade una notificación por email para recibir cada mensaje en el correo de la cafetería.

El campo oculto `bot-field` descarta el spam de bots.
