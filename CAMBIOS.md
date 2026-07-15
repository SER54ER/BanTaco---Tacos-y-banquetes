# Cambios realizados

## Diseño y estructura

- Se reorganizó el sitio con prioridad para Inicio, Menú, productos destacados, Banquetes, Ubicación, Reseñas, Historia, Videos, Galería, Juegos y Contacto.
- Se creó una navegación de computadora más compacta con el menú secundario “Más”.
- Se creó un menú móvil lateral con botón de apertura, botón de cierre, cierre al tocar fuera, cierre con Escape, bloqueo del fondo y control de foco.
- Se añadió una barra inferior móvil con accesos a Menú, WhatsApp y Cómo llegar, respetando el área segura del teléfono.
- Se separaron HTML, estilos, datos y scripts en carpetas mantenibles.

## Inicio y llamadas a la acción

- Se rediseñó la portada con una fotografía definida, degradado de contraste y tipografía legible.
- Se añadieron acciones diferentes para ordenar comida, consultar el menú y abrir la ruta.
- Se corrigieron los mensajes de WhatsApp para no usar el mensaje de banquetes en pedidos de comida.

## Menú

- Se conservaron los 47 productos, nombres, descripciones y precios existentes.
- Se agregó la categoría inicial “Más pedidos”.
- Se añadió búsqueda por nombre, descripción, carne y categoría.
- Se añadió botón para limpiar, contador de resultados y estado sin coincidencias.
- Las categorías se desplazan horizontalmente en celular.
- Cada producto incluye el botón “Pedir este platillo” con un mensaje personalizado y codificado con `encodeURIComponent`.
- Las tarjetas usan proporción 4:3, WebP responsive, JPG de respaldo, carga diferida y dimensiones declaradas.
- En celular las tarjetas cambian a un formato horizontal compacto.

## Redes sociales oficiales

- Se añadió la sección “Síguenos en redes sociales” cerca del final del sitio.
- Se integraron los perfiles oficiales de Instagram, TikTok y Facebook con enlaces exactos.
- Se añadieron íconos SVG ligeros, nítidos y accesibles, sin incorporar bibliotecas externas.
- Los botones incluyen nombre, estado hover, foco visible y distribución responsive.
- Se añadieron enlaces compactos en Contacto y accesos mediante íconos en el pie de página.
- Todos los enlaces externos usan `target="_blank"`, `rel="noopener noreferrer"` y etiquetas `aria-label`.
- Las URL visibles se centralizaron en el objeto `social` de `js/config.js`.
- Se añadió la propiedad `sameAs` al JSON-LD del negocio con las tres redes oficiales.

## Banquetes, ubicación y contacto

- Se rediseñó Banquetes con fondo definido, capa de contraste, lista de beneficios y botón específico para cotizar.
- Se reconstruyó Ubicación con tarjetas legibles, mapa responsive, botones de ruta, Google Maps y WhatsApp.
- Se conservaron las coordenadas ya incluidas en el proyecto.
- No se inventaron calle, colonia ni horarios; se dejaron comentarios `TODO`.
- Se separaron los mensajes de pedido, banquete e información general.

## Galería, videos y reseñas

- La galería conserva únicamente Equipo Ban Taco, Salón Ban Taco y Fachada Ban Taco.
- Se creó una cuadrícula equilibrada y un lightbox con cerrar, anterior, siguiente, teclado y control de foco.
- Se conservaron los dos videos verticales en tarjetas 9:16.
- Los videos usan reproducción manual, `preload="metadata"`, posters y pausa automática del otro video.
- Ambos videos se convirtieron de 120/240 FPS a aproximadamente 30 FPS y H.264 MP4 compatible con web.
- Se reorganizaron las reseñas en tarjetas y se aclaró que son comentarios incluidos en el proyecto, sin afirmar verificación ni promedio.

## Juegos

- Se conservaron Atrapa los tacos y Taco Runner.
- Cada juego quedó dentro de un panel plegable y no ejecuta animaciones mientras permanece cerrado.
- Se añadieron controles visibles para iniciar, pausar y reiniciar.
- Se añadieron controles táctiles y de teclado.
- Los juegos se pausan al cambiar de pestaña o cerrar su panel.
- Taco Runner muestra limones grandes, amarillos, con borde oscuro, brillo y hoja verde.
- El canvas conserva proporción 16:9 y evita desplazamiento accidental durante los controles.

## Tipografía, accesibilidad y responsive

- Se limitaron las familias tipográficas a una para títulos y otra para contenido.
- Se aplicaron tamaños fluidos con `clamp()`, mejor interlineado y contraste.
- Se agregó enlace “Saltar al contenido”, un solo `h1`, encabezados jerárquicos y textos alternativos.
- Se añadieron focos visibles, controles con etiquetas, estados ARIA y soporte para `prefers-reduced-motion`.
- Se revisaron diseños desde 320 px hasta monitores grandes mediante reglas responsive.
- Se eliminaron dependencias externas y animaciones decorativas pesadas.

## Rendimiento y SEO

- Se convirtieron las imágenes del menú y del sitio a WebP.
- Se crearon tamaños específicos para celular y computadora con `srcset` y `<picture>`.
- Se mantuvo JPG como respaldo.
- Se precarga únicamente la imagen principal de la portada.
- Se agregaron `loading="lazy"`, `decoding="async"`, dimensiones y scripts con `defer`.
- Se añadieron title, description, Open Graph, Twitter Card, favicon, Apple Touch Icon, manifest y `theme-color`.
- Se añadieron datos estructurados `Restaurant` usando solo nombre, teléfono, ciudad y coordenadas existentes.
- Se añadieron `robots.txt` y `sitemap.xml` con marcadores para el dominio definitivo.

## Archivos eliminados o no trasladados

La versión final se construyó desde una carpeta limpia. No se trasladaron archivos duplicados o sin uso visible, entre ellos:

- `img/historia-bantaco-trompo.png`, al existir una versión horizontal más apropiada.
- `img/hero-bantaco-comida.png` y `img/hero-bantaco-inicio-promocional.png`, al utilizar una sola portada optimizada.
- Fotografías de platillos que aparecían fuera del menú.
- Fotografías adicionales de galería distintas de Equipo, Salón y Fachada.
- Copias originales de videos a 120 y 240 FPS, reemplazadas por versiones web a 30 FPS.
- El CSS y JavaScript duplicado que estaba concentrado en un solo `index.html`.
- Archivos informativos anteriores `LEEME.txt`, sustituidos por `README.md` y `CAMBIOS.md`.

## Verificaciones realizadas

- Rutas relativas de HTML, CSS, JavaScript, imágenes y videos.
- Conteo de un solo `h1` y presencia de texto alternativo en imágenes.
- Sintaxis JavaScript mediante `node --check`.
- Compatibilidad estructural con apertura directa mediante `index.html`: scripts clásicos con `defer`, sin módulos, sin `fetch` y con rutas relativas; estructura apta para GitHub Pages.
- Navegación principal y móvil.
- Buscador, filtros, categoría “Más pedidos” y botones de productos.
- Mensajes separados de WhatsApp.
- Galería y controles del lightbox.
- Pausa entre videos.
- Inicio, pausa y reinicio de ambos juegos.
- Pausa de juegos al cerrar paneles o cambiar de pestaña.
- Mapa responsive y enlaces externos con `noopener noreferrer`.
- Ausencia de referencias locales absolutas.
- Comprobación de videos H.264 a aproximadamente 30 FPS.

## Mejoras adicionales: favoritos, horarios, promociones, compartir y legal

- Se movió la selección destacada antes del menú completo y se renombró **Los favoritos de Ban Taco**.
- Se configuraron exactamente seis productos reales mediante `destacado: true` en `data/menu-data.js`.
- Cada favorito muestra fotografía, nombre, descripción, precio, etiqueta neutral, enlace al producto y pedido individual por WhatsApp.
- Se creó una configuración centralizada en `js/config.js` para WhatsApp, teléfono, dirección, mapas, horarios, redes, texto para compartir, dominio, correo e información legal.
- Se añadió la sección de horarios con lista semanal, identificación del día actual, zona horaria `America/Mexico_City` y soporte para horarios que terminan después de medianoche.
- Al no existir horarios confirmados, el sitio muestra el mensaje neutral “Consulta nuestros horarios por WhatsApp” y no inventa estados de apertura.
- Se creó `data/promotions-data.js` con ejemplos desactivados.
- Se añadió un renderizador seguro en `js/promotions.js`, sin `innerHTML` procedente de datos, con validación de fechas, enlaces e imágenes.
- La sección de promociones permanece completamente oculta cuando no hay elementos activos o vigentes.
- Se añadieron opciones para compartir mediante Web Share API, WhatsApp, Facebook y copiar enlace.
- La confirmación “Enlace copiado” utiliza `aria-live` y existe un fallback para navegadores sin Clipboard API.
- Se rediseñó el pie de página en columnas con identidad, navegación completa, contacto, horarios, redes oficiales y enlaces legales.
- Se añadió el aviso: “Los precios, productos, promociones y disponibilidad pueden cambiar sin previo aviso”.
- Se añadió el año automático y el texto de derechos reservados.
- Se creó `aviso-de-privacidad.html` con marcadores visibles para los datos legales pendientes y una nota de revisión profesional antes de publicar.
- Se documentó el uso de WhatsApp, Google Maps, enlaces externos, videos locales y almacenamiento local de récords de los juegos.
- Se creó `aviso-de-precios.html` para explicar variaciones de precios, productos y disponibilidad.
- Se añadieron estilos responsive, foco visible, áreas táctiles y soporte para `prefers-reduced-motion` en las funciones nuevas.
- Se actualizaron `README.md` y `CAMBIOS.md` con instrucciones de mantenimiento.

## Verificaciones de esta entrega

- Sintaxis validada con `node --check` en todos los archivos JavaScript de `js/`, `js/games/` y `data/`.
- Rutas de HTML, CSS, JavaScript, imágenes, videos y páginas legales revisadas; no se encontraron referencias locales faltantes.
- Verificación de 47 productos y exactamente 6 productos con `destacado: true`.
- Enlaces externos revisados para usar `target="_blank"` y `rel="noopener noreferrer"`.
- Comprobación de IDs únicos, destinos internos y elementos referidos por `aria-controls`.
- Renderizado automatizado en Chromium a 320, 360, 390, 430, 768, 1366 y 1920 px sin desplazamiento horizontal.
- Comprobación responsive de la barra inferior móvil, favoritos, horarios, pie de página y controles para compartir.
- Prueba del menú hamburguesa con apertura y cierre mediante Escape.
- Prueba del buscador del menú, limpieza de búsqueda y enlaces individuales de WhatsApp.
- Prueba de promociones desactivadas: la sección queda oculta sin espacio vacío.
- Prueba con promoción temporal activada: tarjeta y botón de WhatsApp renderizados correctamente.
- Prueba de horarios configurados: estado “Abierto ahora” y hora de cierre calculados.
- Prueba de los paneles de juegos cerrados inicialmente y apertura manual.
- Prueba de `aviso-de-privacidad.html` y `aviso-de-precios.html` en ancho móvil sin desbordamiento.
## Ajuste de botones del menú y favoritos

- Se eliminó el botón **“Pedir este platillo”** de todas las tarjetas del menú.
- Se eliminó el botón **“Pedir por WhatsApp”** de la sección **Selección de la casa / Los favoritos de Ban Taco**.
- En los favoritos se conserva únicamente el botón **“Ver en el menú”**.
- Se actualizó el texto introductorio del menú para enfocarlo en consultar productos y precios.

## Horarios reales actualizados

- Todos los días la apertura está configurada a la 1:00 p. m.
- Lunes, martes, miércoles y domingo cierran a las 3:00 a. m. del día siguiente.
- Jueves cierra a las 4:00 a. m. del día siguiente.
- Viernes y sábado cierran a las 5:00 a. m. del día siguiente.
- El indicador automático de “Abierto ahora” reconoce correctamente los cierres después de medianoche.
