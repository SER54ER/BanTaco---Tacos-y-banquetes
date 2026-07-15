# Sitio web de Ban Taco

Sitio responsive de Ban Taco preparado para abrirse directamente con `index.html` y publicarse en GitHub Pages. Utiliza HTML, CSS y JavaScript del lado del cliente; no incluye carrito, analítica ni dependencias de pago.

## Cómo abrir el sitio

1. Descomprime el ZIP completo.
2. Conserva la estructura de carpetas.
3. Abre `index.html` con Chrome, Edge, Firefox o Safari.

No es necesario instalar dependencias ni iniciar un servidor. Para pruebas más cercanas a producción también puede abrirse con un servidor local sencillo.

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube el contenido de esta carpeta y deja `index.html` en la raíz.
3. Abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/ (root)`.
6. Sustituye `https://TU-USUARIO.github.io/TU-REPOSITORIO/` en `index.html`, `robots.txt` y `sitemap.xml` por la URL definitiva.
7. Añade la URL pública en `websiteUrl` dentro de `js/config.js`.

## Configuración centralizada

La información general del negocio se encuentra en:

`js/config.js`

Ahí se centralizan:

- Nombre de Ban Taco.
- Número de WhatsApp y teléfono visible.
- Ubicación y enlaces de Google Maps.
- Coordenadas ya existentes en el proyecto.
- Instagram, TikTok y Facebook.
- Texto para compartir.
- Zona horaria `America/Mexico_City`.
- Horarios semanales.
- URL definitiva del sitio.
- Correo y datos legales pendientes.
- Mensajes de pedido, banquetes e información general.

### Cambiar WhatsApp

Modifica estas propiedades sin inventar otro número:

```js
whatsapp: '524494971521',
phone: '449 497 1521',
```

`whatsapp` debe contener código de país, lada y número, sin espacios, guiones ni `+`.

### Cambiar dirección y mapa

Edita:

```js
address: 'Aguascalientes, Aguascalientes, México.',
googleMapsUrl: '...',
directionsUrl: '...',
mapEmbedUrl: '...',
latitude: 21.87804801104877,
longitude: -102.2700457005695,
```

La calle, número y colonia siguen pendientes de confirmación. No se deben publicar datos inventados.

### Modificar redes sociales

Edita exactamente estas propiedades:

```js
instagram: 'https://www.instagram.com/ban_taco/',
tiktok: 'https://www.tiktok.com/@taqueriabantaco?_r=1&_t=ZS-983CUiHzI2a',
facebook: 'https://www.facebook.com/share/1cbcJQbE6D/',
```

Los enlaces se actualizan en la sección social, contacto, pie de página y datos estructurados.

### Modificar el texto para compartir

Busca:

```js
shareText: 'Conoce Ban Taco, consulta el menú, nuestros platillos y servicios.',
```

La URL se toma automáticamente de `window.location.href`.

## Productos destacados

Los productos se encuentran en:

`data/menu-data.js`

Para incluir o retirar un producto de **Los favoritos de Ban Taco**, cambia:

```js
"destacado": true
```

a `false`, o viceversa. Deben existir entre cuatro y seis productos con `destacado: true`.

La etiqueta es opcional:

```js
"etiqueta": "Recomendación de Ban Taco"
```

No uses etiquetas como “Más pedido” o “Favorito de clientes” sin confirmación real.

Cada producto mantiene:

- `category`
- `title`
- `description`
- `price`
- `image`
- `destacado`
- `etiqueta` opcional
- `id` único

Las imágenes de producto se guardan en `assets/images/menu/` con estas variantes:

- `nombre-480.webp`
- `nombre-800.webp`
- `nombre-800.jpg`

## Horario actual de Ban Taco

- Lunes, martes, miércoles y domingo: 1:00 p. m. a 3:00 a. m. del día siguiente.
- Jueves: 1:00 p. m. a 4:00 a. m. del día siguiente.
- Viernes y sábado: 1:00 p. m. a 5:00 a. m. del día siguiente.

## Horarios y estado del negocio

Los horarios se editan en `js/config.js`, dentro de `businessHours`.

Mientras no existan horarios confirmados, conserva los valores en `null`:

```js
businessHours: {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null
}
```

Ejemplo para un horario confirmado:

```js
friday: { open: '18:00', close: '00:30' }
```

También se permiten dos periodos en el mismo día:

```js
sunday: [
  { open: '13:00', close: '17:00' },
  { open: '19:00', close: '23:30' }
]
```

Usa formato de 24 horas `HH:MM`. El sistema calcula el estado con la zona horaria `America/Mexico_City` y admite cierres después de medianoche.

## Promociones administrables

Las promociones se encuentran en:

`data/promotions-data.js`

Los ejemplos incluidos están desactivados y no aparecen en el sitio.

### Agregar una promoción

Copia un objeto existente y modifica únicamente datos confirmados:

```js
{
  id: 'promocion-unica',
  titulo: 'Título real',
  descripcion: 'Descripción confirmada',
  imagen: 'assets/images/site/promocion.webp',
  imagenAlt: 'Descripción de la imagen',
  fechaInicio: '2026-07-20',
  fechaFin: '2026-07-31',
  activa: true,
  botonTexto: 'Pedir por WhatsApp',
  tipoEnlace: 'whatsapp',
  enlace: '',
  mensajeWhatsApp: 'Hola, me interesa la promoción...'
}
```

### Activar o desactivar

- `activa: true`: puede mostrarse si la fecha es vigente.
- `activa: false`: queda oculta.

Si no hay promociones activas, toda la sección desaparece sin dejar espacio vacío.

### Configurar fechas

Utiliza `AAAA-MM-DD`:

```js
fechaInicio: '2026-07-20',
fechaFin: '2026-07-31',
```

Deja ambos campos vacíos para no limitar por fecha. Las promociones vencidas se ocultan automáticamente.

### Botón externo

Para abrir una página externa:

```js
tipoEnlace: 'external',
enlace: 'https://ejemplo.com/',
```

No insertes HTML dentro de los datos; el sitio crea el contenido con APIs seguras del navegador.

## Aviso de privacidad

La página se encuentra en:

`aviso-de-privacidad.html`

Los datos legales se centralizan en `js/config.js`:

```js
legal: {
  responsibleName: '',
  responsibleAddress: '',
  privacyEmail: '',
  lastUpdated: '15 de julio de 2026'
}
```

Antes de publicar se deben completar:

- `[AGREGAR NOMBRE DEL RESPONSABLE]`
- `[AGREGAR DOMICILIO]`
- `[AGREGAR CORREO DE CONTACTO]`

El aviso contiene una nota de revisión legal. Debe revisarlo una persona con conocimientos jurídicos antes de considerarlo definitivo.

También existe `aviso-de-precios.html` con el aviso sobre cambios de precios, productos, promociones y disponibilidad.

## Fotografías y videos

Las fotografías generales están en `assets/images/site/`. La galería conserva Equipo, Salón y Fachada.

Los videos están en `assets/videos/`:

- `preparacion-pastor.mp4`
- `preparacion-torta.mp4`

Recomendación: MP4 H.264, audio AAC, aproximadamente 30 FPS, formato vertical 9:16 y resolución máxima aproximada de 720 × 1280.

## Estructura principal

```text
index.html
aviso-de-privacidad.html
aviso-de-precios.html
css/
  styles.css
  responsive.css
js/
  config.js
  navigation.js
  menu.js
  hours.js
  promotions.js
  share.js
  gallery.js
  videos.js
  legal.js
  main.js
  games/
    atrapa-tacos.js
    taco-runner.js
data/
  menu-data.js
  promotions-data.js
assets/
  images/
    menu/
    site/
  videos/
  icons/
README.md
CAMBIOS.md
```

## Datos reales pendientes

- Dirección completa: calle, número y colonia.
- Horarios reales de cada día.
- Enlace oficial de reseñas de Google.
- Dominio o URL definitiva.
- Nombre del responsable del aviso de privacidad.
- Domicilio legal.
- Correo de contacto para privacidad.
