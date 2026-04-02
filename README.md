# 💱 Generador de Tasa de Cambio

Un generador visual interactivo para crear imágenes de tasas de cambio COP ↔ VES optimizadas para compartir en WhatsApp y redes sociales. Perfecto para negocios de cambios, casas de cambio y agentes de divisas.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Cómo Usar](#cómo-usar)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración Avanzada](#configuración-avanzada)
- [Personalización](#personalización)
- [Técnica](#técnica)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## ✨ Características

### Funcionalidad Principal
- **Generador Visual**: Crea imágenes de alta calidad (640×960px) con tasas de cambio
- **Conversión Bidireccional**: 
  - Pesos (COP) → Bolívares (VES) usando división (÷)
  - Bolívares (VES) → Pesos (COP) usando multiplicación (×)
- **Tablas Automáticas**: Genera dos tablas con conversiones predefinidas
- **Descarga JPG**: Exporta la imagen en formato JPG (95% calidad) para compartir

### Diseño
- **Formato Vertical (Story/Móvil)**: 640×960px, optimizado para pantallas móviles
- **Diseño Profesional**: 
  - Paleta oscura moderna (#111111, #1E1E1E)
  - Acentos corporativos en oro (#D4A017)
  - Colores diferenciados por moneda (Azul COP, Rojo VES)
- **Tipografía Premium**: Oswald (títulos) + Barlow (cuerpo)
- **Elementos Visuales**:
  - Barra de acento superior e inferior con gradiente
  - Badges con tasas destacadas
  - Tablas con formato cebra para legibilidad
  - Iconos de banderas (🇨🇴 🇻🇪)

### Interfaz de Usuario
- **Campos Editables**:
  - Título personalizable (ej: "Cambios DB&JG")
  - Subtítulo/Fecha opcional
  - Tasa COP→VES con ejemplo de uso
  - Tasa VES→COP con ejemplo de uso
- **Vista Previa Instantánea**: Ve cómo se verá la imagen antes de descargar
- **Validación**: Verifica que las tasas sean válidas antes de generar

---

## 🚀 Instalación

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Ninguna dependencia externa (HTML puro + Canvas API)

### Pasos

1. **Descarga los archivos**:
   ```
   index.html
   style.css
   script.js
   ```

2. **Abre en tu navegador**:
   - Opción 1: Haz doble clic en `index.html`
   - Opción 2: Arrastra `index.html` a tu navegador
   - Opción 3: Sirve localmente con Python:
     ```bash
     python3 -m http.server 8000
     # Luego abre http://localhost:8000
     ```

3. **¡Listo!** La aplicación está lista para usar.

---

## 📖 Cómo Usar

### Paso 1: Configuración Básica

1. **Título**: Ingresa el nombre de tu negocio (ej: "Cambios DB&JG")
2. **Subtítulo** (opcional): Agrega fecha, horario o tu usuario de redes (ej: "02 de Abril 2026 — @micambio")

### Paso 2: Ingresa las Tasas

**Tasa Pesos → Bolívares (÷)**
- Esta es la tasa de **venta** de bolívares
- Ejemplo: Si ingresas `6.09`, significa que 10.000 COP = 1.642 BS
- Fórmula: `COP ÷ Tasa = BS`

**Tasa Bolívares → Pesos (×)**
- Esta es la tasa de **compra** de bolívares
- Ejemplo: Si ingresas `4.25`, significa que 5.000 BS = 21.250 COP
- Fórmula: `BS × Tasa = COP`

### Paso 3: Generar

1. Haz clic en **"Generar imagen"**
2. Verás una vista previa de cómo se verá en WhatsApp/redes

### Paso 4: Descargar

- Haz clic en **"⬇ Descargar JPG"**
- Se descargará como `tasa-de-cambio-movil.jpg`
- Comparte en WhatsApp, Instagram, etc.

### Ejemplo Práctico

```
Título: Cambios Santa Fe
Subtítulo: 2 Abril — Actualizado
Tasa COP→BS: 6.09
Tasa BS→COP: 4.25

Resultado: Una imagen hermosa lista para enviar a clientes
```

---

## 📁 Estructura del Proyecto

```
proyecto/
├── index.html          # Estructura HTML y formulario
├── style.css          # Estilos de la interfaz
├── script.js          # Lógica de generación de canvas
└── README.md          # Este archivo
```

### Archivos Detallados

#### `index.html`
- Define la estructura del formulario
- Campos de entrada para tasas y configuración
- Canvas para mostrar la vista previa
- Botones de acción (Generar, Descargar)

#### `style.css`
- Variables CSS para colores y tipografía
- Estilos del panel de configuración
- Diseño responsive (adaptable a móviles)
- Animaciones sutiles en botones

#### `script.js`
- Función `generate()`: Dibuja la imagen en canvas
- Función `rrect()`: Dibuja rectángulos redondeados
- Función `fmtNum()`: Formatea números al español
- Función `drawVerticalTable()`: Genera tablas de conversión
- Función `downloadJPG()`: Exporta como JPG

---

## ⚙️ Configuración Avanzada

### Modificar Colores

En `script.js`, busca las constantes al inicio:

```javascript
const COP_COL = '#4A8FE8';      // Azul para Pesos
const VES_COL = '#E05530';      // Rojo para Bolívares
const GOLD = '#D4A017';         // Oro principal
const BG = '#111111';           // Fondo oscuro
```

**Ejemplo**: Cambiar a una paleta más clara:
```javascript
const BG = '#FFFFFF';           // Blanco
const TEXT = '#1A1A1A';         // Texto oscuro
```

### Modificar Dimensiones

```javascript
const CARD_W = 640;   // Ancho en píxeles
const CARD_H = 960;   // Alto en píxeles
```

**Nota**: Si cambias estas dimensiones, también ajusta `MARGIN` y tamaños de fuente para que se vea bien.

### Modificar Tipografía

En `index.html`, busca en `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
```

Puedes reemplazar con otras fuentes de Google Fonts.

### Modificar Valores de Conversión

En `script.js`, busca:
```javascript
const copVals = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
const bsVals = [5000, 6000, 7000, 8000, 9000, 10000, 20000];
```

Cambia estos valores para que coincidan con los que quieres mostrar en las tablas.

---

## 🎨 Personalización

### 1. **Cambiar Nombre del Negocio**
- Modifica el texto por defecto en `index.html`:
```html
<input type="text" id="titulo" value="Mi Negocio de Cambios" />
```

### 2. **Cambiar Mensaje de Pie**
En `script.js`, busca:
```javascript
ctx.fillText('Tasas de referencia — Los valores pueden variar', CARD_W/2, CARD_H - 25);
```

### 3. **Agregar Logo o Imagen**
Para agregar un logo a la imagen generada:
```javascript
// En la función generate(), después del fondo:
const img = new Image();
img.src = 'tu-logo.png';
img.onload = () => {
    ctx.drawImage(img, CARD_W - 80, 40, 60, 60);
    // x, y, width, height
};
```

### 4. **Cambiar Formato de Exportación**
En `script.js`, busca `downloadJPG()`:
```javascript
link.href = lastCanvas.toDataURL('image/jpeg', 0.95); // Cambiar a PNG
link.href = lastCanvas.toDataURL('image/png');        // PNG sin compresión
```

---

## 🛠️ Técnica

### Canvas API
La aplicación usa HTML5 Canvas para dibujar:
- Rectángulos redondeados
- Texto con diferentes estilos
- Gradientes lineales
- Líneas y bordes

### Fórmulas de Conversión

**COP → VES (División)**
```
Bolívares = Pesos ÷ Tasa
Ej: 10.000 ÷ 6.09 = 1.642 BS
```

**VES → COP (Multiplicación)**
```
Pesos = Bolívares × Tasa
Ej: 5.000 × 4.25 = 21.250 COP
```

### Localización (es-CO)
Se usa `toLocaleString('es-CO')` para:
- Separador de miles: punto (.)
- Separador decimal: coma (,)
- Ejemplo: 1.000.000,50

---

## 📸 Ejemplos de Uso

### Caso 1: Cambista Individual
```
Título: Carlos Cambios
Subtítulo: Cel: 3001234567
Tasa COP→BS: 6.09
Tasa BS→COP: 4.25
→ Descarga y comparte en WhatsApp
```

### Caso 2: Casa de Cambios
```
Título: Giros y Cambios Santa Fe
Subtítulo: 2 Abril 2026 — Actualizado
Tasa COP→BS: 6.09
Tasa BS→COP: 4.25
→ Publica en historias de Instagram
```

### Caso 3: Múltiples Tasas
Genera varias imágenes con diferentes tasas según la hora del día:
- Mañana: 6.05 / 4.23
- Tarde: 6.09 / 4.25
- Noche: 6.12 / 4.27

---

## 🔒 Notas de Seguridad

- **Offline First**: Toda la aplicación funciona sin conexión (excepto Google Fonts)
- **Sin datos enviados**: Nada se envía a servidores externos
- **Responsabilidad**: Las tasas que ingreses son tu responsabilidad

---

## 📝 Licencia

Este proyecto es de uso libre para propósitos personales y comerciales.

---

## 💡 Tips & Trucos

### ✅ Actualizar Rápido
Genera una nueva imagen cada vez que cambian las tasas, sin perder configuración anterior.

### ✅ Mantener Consistencia
Usa siempre el mismo título y diseño para que clientes te reconozcan.

### ✅ Compartir Antes de Vencer
Actualiza las tasas regularmente (cada 1-2 horas) en negocios activos.

### ✅ Probar en Móvil
Abre la imagen descargada en tu teléfono antes de compartir, para verificar que se vea bien.

---

## 🐛 Solución de Problemas

### Las tasas no se generan
- Verifica que ambos campos tengan números válidos
- Los números deben ser mayores a 0
- Usa punto (.) para decimales, no coma

### La imagen se ve cortada
- Aumenta el zoom del navegador (Ctrl/Cmd + +)
- Prueba en otro navegador
- Revisa la resolución de tu pantalla

### No puedo descargar la imagen
- Verifica que tu navegador permita descargas
- Intenta con otro navegador
- Comprueba el espacio en disco

---

## 🚀 Próximas Características (Sugerencias)

- [ ] Agregar más pares de monedas (USD, EUR, etc.)
- [ ] Guardar configuración en navegador (LocalStorage)
- [ ] Historial de tasas anteriores
- [ ] Temas predefinidos (claro/oscuro)
- [ ] Agregar código QR con enlace a contacto

---

## 📞 Soporte

Si tienes problemas o sugerencias:
1. Verifica que todos los archivos estén en la misma carpeta
2. Recarga la página (Ctrl/Cmd + R)
3. Intenta en otro navegador
4. Revisa la consola del navegador (F12) para errores

---

**Hecho con ❤️ para cambistas y negocios de divisas**

*Última actualización: Abril 2026*
