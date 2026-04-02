# 📄 Generador de Tasa de Cambio — Documentación

## ¿Qué hace este archivo?

Es una **herramienta web de una sola página** (HTML + CSS + JS puro, sin dependencias externas) que permite generar una **imagen JPG** con las tasas de cambio entre **Pesos colombianos (COP)** y **Bolívares venezolanos (VES)**, lista para compartir en redes sociales o WhatsApp.

---

## 🏗️ Estructura del archivo

```
cambio-pesos-bolivares.html
├── <head>
│   ├── Google Fonts (Oswald + Barlow)
│   └── <style>  ← Todo el CSS
├── <body>
│   ├── <h1>              Título de la herramienta
│   ├── <div.panel>       Formulario de configuración
│   ├── <button.btn-generate>   Botón "Generar imagen"
│   ├── <div#preview-wrap>      Vista previa del canvas
│   ├── <button.btn-download>   Botón "Descargar JPG"
│   └── <div#card>        Canvas off-screen (invisible)
└── <script>  ← Toda la lógica JS
```

---

## 🎨 CSS — Variables y diseño

### Variables de color (`:root`)

| Variable       | Valor     | Uso                          |
|----------------|-----------|------------------------------|
| `--gold`       | `#D4A017` | Acento principal (dorado)    |
| `--gold-light` | `#F0C040` | Hover y énfasis              |
| `--dark`       | `#1A1A1A` | Fondo de paneles             |
| `--mid`        | `#2A2A2A` | Fondo de inputs              |
| `--border`     | `#3A3A3A` | Bordes sutiles               |
| `--text`       | `#F5F0E8` | Texto principal (blanco cálido) |
| `--muted`      | `#9A9080` | Etiquetas / texto secundario |
| `--cop`        | `#3A7BD5` | Azul Colombia                |
| `--ves`        | `#CF4520` | Rojo Venezuela               |

### Clases principales

| Clase / ID          | Descripción                                      |
|---------------------|--------------------------------------------------|
| `.panel`            | Tarjeta del formulario de configuración          |
| `.field`            | Wrapper de cada campo (label + input)            |
| `.row2`             | Grid de 2 columnas para los campos de tasa       |
| `.rate-label`       | Etiqueta con punto de color indicador de moneda  |
| `.dot-cop / .dot-ves` | Indicadores visuales de moneda (círculo color) |
| `.btn-generate`     | Botón dorado principal                           |
| `.btn-download`     | Botón outline para descargar (oculto al inicio)  |
| `#preview-wrap`     | Contenedor de la vista previa (oculto al inicio) |
| `#preview-canvas`   | Canvas visible donde se muestra la preview       |
| `#card`             | Div off-screen (fuera de pantalla, no visible)   |

---

## ⚙️ JavaScript — Lógica principal

### Constantes globales

```js
const CARD_W = 900;        // Ancho de la imagen exportada en píxeles
const COP_COL = '#4A8FE8'; // Azul Colombia (canvas)
const VES_COL = '#E05530'; // Rojo Venezuela (canvas)
```

> ⚠️ Los colores JS son **independientes** de las variables CSS — el canvas no puede leer variables CSS directamente.

---

### `fmtNum(n)` — Formateador de números

```js
function fmtNum(n) {
  return Number(n).toLocaleString('es-CO', { maximumFractionDigits: 4 });
}
```

Convierte un número a formato colombiano con separadores de miles.
Ejemplo: `1642.5` → `"1.642,5"`

---

### `generate()` — Función principal

**Flujo paso a paso:**

```
1. Leer inputs del formulario
       ↓
2. Validar que ambas tasas sean números positivos
       ↓
3. Crear un <canvas> en memoria (900 × 660 px)
       ↓
4. Dibujar en orden:
   ├── Fondo oscuro
   ├── Barra superior tricolor (degradado COP→GOLD→VES)
   ├── Panel de encabezado (título + subtítulo)
   ├── Badges de tasa (÷ y ×)
   └── Tablas de conversión (con banderas 🇨🇴🇻🇪 / 🇻🇪🇨🇴)
       ↓
5. Guardar canvas en `lastCanvas`
       ↓
6. Llamar showPreview() para mostrarlo
```

---

### `rrect(x, y, w, h, r, fill, stroke)` — Rectángulo redondeado

Helper interno dentro de `generate()`. Dibuja rectángulos con esquinas redondeadas usando la API de Canvas 2D (`arcTo`).

| Parámetro | Tipo   | Descripción                     |
|-----------|--------|---------------------------------|
| `x, y`    | number | Posición superior izquierda     |
| `w, h`    | number | Ancho y alto                    |
| `r`       | number | Radio de esquinas               |
| `fill`    | string | Color de relleno (o `null`)     |
| `stroke`  | string | Color de borde (o `null`)       |

---

### `drawTable(...)` — Dibuja una tabla de conversión

Función interna de `generate()`. Dibuja una tabla completa con encabezado coloreado, etiquetas de columna, separadores y filas de datos.

**Parámetros:**

| Parámetro    | Tipo   | Descripción                              |
|--------------|--------|------------------------------------------|
| `x`          | number | Posición X de la tabla                   |
| `tableWidth` | number | Ancho en px                              |
| `title`      | string | Texto del encabezado (con emojis 🇨🇴🇻🇪) |
| `titleColor` | string | Color de fondo del encabezado            |
| `col1Label`  | string | Etiqueta columna izquierda               |
| `col2Label`  | string | Etiqueta columna derecha                 |
| `rows`       | Array  | `[[valor_orig, valor_dest], ...]`        |

**Lógica de colores en celdas:**
```js
// Si la tabla es de Colombia (azul), el valor destino va en azul claro
// Si la tabla es de Venezuela (rojo), el valor destino va en naranja claro
ctx.fillStyle = titleColor === COP_COL ? '#7BBFFF' : '#FF9070';
```

---

### `showPreview(canvas)` — Muestra la vista previa

Copia el canvas de alta resolución al `#preview-canvas` visible, y muestra el botón de descarga.

---

### `downloadJPG()` — Descarga la imagen

Convierte el canvas a base64 JPEG con calidad 95% y lo descarga como `tasa-de-cambio.jpg`.

---

## 🗺️ Flujo visual de la imagen generada

```
┌──────────────────────────────────────────────────────┐
│ ▓▓▓▓▓ BARRA TRICOLOR (COP → GOLD → VES) ▓▓▓▓▓▓▓▓▓▓ │  ← 4px
├──────────────────────────────────────────────────────┤
│                                                      │
│            TÍTULO DEL NEGOCIO (Oswald Bold)          │
│               subtítulo / fecha (Barlow)             │
│                                                      │
├──────────────────────────────────────────────────────┤
│  [ BADGE: Pesos → Bs  ÷ X.XX ]  [ BADGE: Bs → Pesos × X.XX ] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  🇨🇴🇻🇪 PESOS → BOLÍVARES   │  🇻🇪🇨🇴 BOLÍVARES → PESOS  │
│  ──────────────────────   │  ──────────────────────  │
│  $ 10.000  │  1.642 Bs   │  5.000 Bs  │  $ 21.250   │
│  $ 20.000  │  3.284 Bs   │  6.000 Bs  │  $ 25.500   │
│     ...    │    ...      │    ...     │    ...       │
│                                                      │
├──────────────────────────────────────────────────────┤
│         Tasas de referencia — Los valores pueden variar       │
│ ▓▓▓▓▓ BARRA TRICOLOR (COP → GOLD → VES) ▓▓▓▓▓▓▓▓▓▓ │  ← 3px
└──────────────────────────────────────────────────────┘
              900 × 660 px  |  JPG calidad 95%
```

---

## 🚀 Cómo usar

1. Abrir el archivo `cambio-pesos-bolivares.html` en cualquier navegador moderno.
2. Llenar el **título** (nombre del negocio) y opcionalmente el **subtítulo** (fecha, usuario, etc.).
3. Ingresar la **tasa ÷** (Pesos → Bolívares) y la **tasa ×** (Bolívares → Pesos).
4. Clic en **"Generar imagen"**.
5. Revisar la vista previa y clic en **"Descargar JPG"**.

---

## 📦 Dependencias

| Dependencia | Versión | Uso                      | Enlace           |
|-------------|---------|--------------------------|------------------|
| Google Fonts | CDN    | Oswald + Barlow          | fonts.google.com |
| Canvas API  | Nativa  | Generación de la imagen  | Navegador        |

> No requiere Node.js, npm, ni ningún framework. Funciona abriendo el `.html` directamente.

---

## 💡 Posibles mejoras futuras

- [ ] Agregar campo para logo/imagen de marca
- [ ] Permitir personalizar los montos de las filas de la tabla
- [ ] Exportar también como PNG (fondo transparente)
- [ ] Modo claro / oscuro
- [ ] Guardar configuración en `localStorage` para no re-ingresar tasas cada vez
- [ ] Botón "Copiar al portapapeles" para pegar directo en WhatsApp
