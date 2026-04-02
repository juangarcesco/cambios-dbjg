// Constantes de diseño - AHORA VERTICAL (Portrait)
const CARD_W = 640;  // Más angosto
const CARD_H = 960;  // Más alto (proporción tipo Story/Móvil)

const COP_COL = '#4A8FE8';
const VES_COL = '#E05530';
const GOLD = '#D4A017';
const GOLD_LIGHT = '#F0C040';
const BG = '#111111';
const MID = '#1E1E1E';
const MID2 = '#252525';
const BORDER = '#333333';
const TEXT = '#F5F0E8';
const MUTED = '#787060';
const WHITE = '#FFFFFF';

let lastCanvas = null;

// Formateador de números
function fmtNum(n) {
    return Number(n).toLocaleString('es-CO', { maximumFractionDigits: 4 });
}

// Función para dibujar rectángulos redondeados
function rrect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x+w,y, x+w,y+r, r);
    ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w,y+h, x+w-r,y+h, r);
    ctx.lineTo(x+r, y+h); ctx.arcTo(x,y+h, x,y+h-r, r);
    ctx.lineTo(x, y+r); ctx.arcTo(x,y, x+r,y, r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

// Función principal de generación
function generate() {
    const titulo = document.getElementById('titulo').value.trim() || 'Cambios DB&JG';
    const subtitulo = document.getElementById('subtitulo').value.trim();
    const tasaCopToBs = parseFloat(document.getElementById('tasaCopToBs').value);
    const tasaBsToCop = parseFloat(document.getElementById('tasaBsToCop').value);

    if (isNaN(tasaCopToBs) || isNaN(tasaBsToCop) || tasaCopToBs <= 0 || tasaBsToCop <= 0) {
        alert('Por favor ingresa las dos tasas de cambio válidas.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const ctx = canvas.getContext('2d');

    // Margen general interno para elementos
    const MARGIN = 30;
    const CONTENT_W = CARD_W - (MARGIN * 2);

    // Fondo
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // Barra de acento superior
    const gBar = ctx.createLinearGradient(0,0,CARD_W,0);
    gBar.addColorStop(0, COP_COL);
    gBar.addColorStop(0.5, GOLD);
    gBar.addColorStop(1, VES_COL);
    ctx.fillStyle = gBar;
    ctx.fillRect(0, 0, CARD_W, 6); // Un poco más gruesa para móvil

    // --- 1. CABECERA ---
    const headerH = 100;
    const headerY = 30;
    rrect(ctx, MARGIN, headerY, CONTENT_W, headerH, 12, MID, BORDER);

    // Título
    ctx.fillStyle = GOLD_LIGHT;
    ctx.font = 'bold 32px Oswald, sans-serif'; // Un poco más pequeña
    ctx.textAlign = 'center';
    ctx.fillText(titulo.toUpperCase(), CARD_W/2, headerY + 45);

    if (subtitulo) {
        ctx.fillStyle = MUTED;
        ctx.font = '500 15px Barlow, sans-serif';
        ctx.fillText(subtitulo, CARD_W/2, headerY + 75);
    }

    // --- 2. BADGES DE TASAS (UNO DEBAJO DEL OTRO) ---
    const badgeH = 75;
    const badgeGap = 15;
    
    // Badge 1 (VES)
    const badge1Y = headerY + headerH + 25;
    rrect(ctx, MARGIN, badge1Y, CONTENT_W, badgeH, 10, MID2, VES_COL);
    
    ctx.fillStyle = VES_COL;
    ctx.font = '600 13px Barlow, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TASA PESOS → BOLÍVARES', MARGIN + 20, badge1Y + 25);
    
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 34px Oswald, sans-serif';
    ctx.fillText('÷ ' + fmtNum(tasaCopToBs), MARGIN + 20, badge1Y + 60);

    // Badge 2 (COP)
    const badge2Y = badge1Y + badgeH + badgeGap;
    rrect(ctx, MARGIN, badge2Y, CONTENT_W, badgeH, 10, MID2, COP_COL);
    
    ctx.fillStyle = COP_COL;
    ctx.font = '600 13px Barlow, sans-serif';
    ctx.fillText('TASA BOLÍVARES → PESOS', MARGIN + 20, badge2Y + 25);
    
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 34px Oswald, sans-serif';
    ctx.fillText('× ' + fmtNum(tasaBsToCop), MARGIN + 20, badge2Y + 60);

    // --- 3. TABLAS (UNA DEBAJO DE LA OTRA) ---
    const tableHeaderH = 38;
    const tableRowH = 36;
    const copVals = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
    const bsVals = [5000, 6000, 7000, 8000, 9000, 10000, 20000];
    
    // Altura total necesaria para una tabla (header + rows + padding bottom)
    const singleTableH = tableHeaderH + (copVals.length * tableRowH) + 10;
    const tablesGap = 25;

    // Función de dibujo de tabla adaptada para ancho completo
    function drawVerticalTable(y, title, titleColor, col1Label, col2Label, rows) {
        // Contenedor
        rrect(ctx, MARGIN, y, CONTENT_W, singleTableH, 12, MID, BORDER);
        
        // Encabezado de la tabla
        rrect(ctx, MARGIN, y, CONTENT_W, tableHeaderH, 12, titleColor, null);
        
        ctx.fillStyle = WHITE;
        ctx.font = 'bold 16px Oswald, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title.toUpperCase(), CARD_W/2, y + 25);

        // Etiquetas de columnas
        ctx.fillStyle = MUTED;
        ctx.font = '600 12px Barlow, sans-serif';
        const colW = CONTENT_W / 2;
        ctx.fillText(col1Label, MARGIN + colW*0.5, y + tableHeaderH + 22);
        ctx.fillText(col2Label, MARGIN + colW*1.5, y + tableHeaderH + 22);

        // Línea divisoria horizontal bajo labels
        ctx.strokeStyle = BORDER;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(MARGIN + 15, y + tableHeaderH + 32);
        ctx.lineTo(MARGIN + CONTENT_W - 15, y + tableHeaderH + 32);
        ctx.stroke();

        // Línea divisoria vertical central
        ctx.beginPath();
        ctx.moveTo(CARD_W/2, y + tableHeaderH + 10);
        ctx.lineTo(CARD_W/2, y + singleTableH - 10);
        ctx.stroke();

        // Filas
        rows.forEach((row, i) => {
            const ry = y + tableHeaderH + 35 + i * tableRowH;
            
            // Fondo cebra
            if (i % 2 === 1) {
                ctx.fillStyle = 'rgba(255,255,255,0.03)';
                ctx.fillRect(MARGIN + 2, ry - 20, CONTENT_W - 4, tableRowH);
            }
            
            // Texto Columna 1
            ctx.fillStyle = TEXT;
            ctx.font = '600 16px Barlow, sans-serif'; // Un poco más grande para leer en móvil
            ctx.textAlign = 'center';
            ctx.fillText(row[0], MARGIN + colW*0.5, ry + 5);
            
            // Texto Columna 2 (Color acento)
            ctx.fillStyle = titleColor === COP_COL ? '#7BBFFF' : '#FF9070';
            ctx.fillText(row[1], MARGIN + colW*1.5, ry + 5);
        });
    }

    // Datos Tabla 1
    const copRows = copVals.map(v => [
        '$ ' + v.toLocaleString('es-CO'),
        fmtNum(Math.round((v / tasaCopToBs) * 100) / 100) + ' Bs'
    ]);

    // Datos Tabla 2
    const bsRows = bsVals.map(v => [
        v.toLocaleString('es-CO') + ' Bs',
        '$ ' + fmtNum(Math.round(v * tasaBsToCop))
    ]);

    // Dibujar Tabla 1 (VES)
    const table1Y = badge2Y + badgeH + 30;
    drawVerticalTable(table1Y, '🇨🇴 Pesos → Bolívares', VES_COL, 'PESOS (COP)', 'BOLÍVARES (BS)', copRows);

    // Dibujar Tabla 2 (COP)
    const table2Y = table1Y + singleTableH + tablesGap;
    drawVerticalTable(table2Y, '🇻🇪 Bolívares → Pesos', COP_COL, 'BOLÍVARES (BS)', 'PESOS (COP)', bsRows);

    // --- 4. PIE DE PÁGINA ---
    ctx.fillStyle = MUTED;
    ctx.font = '400 14px Barlow, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tasas de referencia — Los valores pueden variar', CARD_W/2, CARD_H - 25);
    
    // Barra de acento inferior
    ctx.fillStyle = gBar;
    ctx.fillRect(0, CARD_H-6, CARD_W, 6);

    lastCanvas = canvas;
    showPreview(canvas);
}

// --- Funciones de Preview y Descarga (Sin cambios) ---
function showPreview(canvas) {
    const previewCanvas = document.getElementById('preview-canvas');
    const wrap = document.getElementById('preview-wrap');
    const dlBtn = document.getElementById('btn-dl');

    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    const pCtx = previewCanvas.getContext('2d');
    pCtx.drawImage(canvas, 0, 0);

    wrap.style.display = 'flex';
    dlBtn.style.display = 'block';
}

function downloadJPG() {
    if (!lastCanvas) return;
    const link = document.createElement('a');
    link.download = 'tasa-de-cambio-movil.jpg';
    link.href = lastCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
}