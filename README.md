# Quetzal Fleet Supply — sitio web

Este es el proyecto completo, listo para publicar gratis en internet.

## Opción más fácil: Vercel (recomendada, gratis)

1. Ve a https://vercel.com y crea una cuenta gratis (puedes usar tu correo o GitHub).
2. Una vez adentro, busca la opción **"Add New" → "Project"**.
3. Te va a pedir subir el código. La forma más simple sin usar GitHub:
   - Instala [Vercel CLI](https://vercel.com/docs/cli) o simplemente arrastra la carpeta del proyecto a la sección de "Import" si Vercel te da esa opción para tu cuenta.
   - Si prefieres por GitHub (recomendado a mediano plazo): sube esta carpeta a un repositorio nuevo en https://github.com (gratis), luego en Vercel elige "Import Git Repository" y selecciona ese repositorio.
4. Vercel detecta automáticamente que es un proyecto Vite + React. No cambies nada, solo dale **"Deploy"**.
5. En 1-2 minutos te da un link público gratis, tipo `quetzal-fleet-supply.vercel.app`.
6. Cada vez que quieras actualizar el catálogo, subes los cambios y Vercel actualiza el sitio solo.

## Alternativa: Netlify (también gratis)

Mismo proceso: cuenta gratis en https://netlify.com, luego "Add new site" → conectar el repositorio o arrastrar la carpeta ya compilada (ver abajo cómo compilarla).

## Si quieres probarlo o compilarlo tú mismo en tu computadora

Necesitas tener [Node.js](https://nodejs.org) instalado (versión 18 o más reciente). Luego, en la terminal, dentro de esta carpeta:

```bash
npm install
npm run dev
```

Eso abre el sitio en tu computadora para probarlo (usualmente en `http://localhost:5173`).

Para generar la versión final que se sube a cualquier hosting:

```bash
npm run build
```

Esto crea una carpeta `dist/` con el sitio ya listo — esa carpeta es la que se puede arrastrar directamente a Netlify, o subir a cualquier hosting que acepte archivos estáticos (HTML/CSS/JS).

## Dominio propio

Una vez publicado en Vercel o Netlify, en la configuración del proyecto puedes conectar un dominio propio (ej. `quetzalfleetsupply.com`) si más adelante compras uno — el hosting en sí sigue siendo gratis, solo el dominio tiene un costo aparte (usualmente unos $10-15 USD al año).
