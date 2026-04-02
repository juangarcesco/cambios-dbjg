const CARD_W = 640; 
// La altura (CARD_H) ahora se calcula automáticamente según el contenido

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

function fmtNum(n) {
    return Number(n).toLocaleString('es-CO', { maximumFractionDigits: 4 });
}

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

function generate() {
    const titulo = document.getElementById('titulo').value.trim() || 'Cambios DB&JG';
    const subtitulo = document.getElementById('subtitulo').value.trim();
    const tasaCopToBs = parseFloat(document.getElementById('tasaCopToBs').value);
    const tasaBsToCop = parseFloat(document.getElementById('tasaBsToCop').value);

    if (isNaN(tasaCopToBs) || isNaN(tasaBsToCop) || tasaCopToBs <= 0 || tasaBsToCop <= 0) {
        alert('Por favor ingresa las dos tasas de cambio válidas.');
        return;
    }

    const MARGIN = 30;
    const CONTENT_W = CARD_W - (MARGIN * 2);
    const tableHeaderH = 38;
    const tableRowH = 36;
    
    // Datos de ejemplo para calcular altura
    const copVals = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
    const bsVals = [5000, 6000, 7000, 8000, 9000, 10000, 20000];
    
    const singleTableH_1 = tableHeaderH + (copVals.length * tableRowH) + 20;
    const singleTableH_2 = tableHeaderH + (bsVals.length * tableRowH) + 20;
    
    // ALTURA DINÁMICA: Suma de todos los elementos + márgenes
    const dynamicH = 30 + 100 + 25 + 60 + 10 + 60 + 30 + singleTableH_1 + 25 + singleTableH_2 + 80;

    const canvas = document.createElement('canvas');
    canvas.width = CARD_W;
    canvas.height = dynamicH;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CARD_W, dynamicH);

    const gBar = ctx.createLinearGradient(0,0,CARD_W,0);
    gBar.addColorStop(0, COP_COL);
    gBar.addColorStop(0.5, GOLD);
    gBar.addColorStop(1, VES_COL);
    ctx.fillStyle = gBar;
    ctx.fillRect(0, 0, CARD_W, 6);

    // 1. CABECERA
    const headerH = 100;
    const headerY = 30;
    rrect(ctx, MARGIN, headerY, CONTENT_W, headerH, 12, MID, BORDER);
    ctx.fillStyle = GOLD_LIGHT;
    ctx.font = 'bold 32px Oswald, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(titulo.toUpperCase(), CARD_W/2, headerY + 45);
    if (subtitulo) {
        ctx.fillStyle = MUTED;
        ctx.font = '500 15px Barlow, sans-serif';
        ctx.fillText(subtitulo, CARD_W/2, headerY + 75);
    }

    // 2. BADGES (Ajustados para móvil - sin símbolos)
    const badgeH = 60;
    const badge1Y = headerY + headerH + 25;
    rrect(ctx, MARGIN, badge1Y, CONTENT_W, badgeH, 10, MID2, VES_COL);
    ctx.fillStyle = VES_COL;
    ctx.font = '600 10px Barlow, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TASA PESOS → BOLÍVARES', MARGIN + 15, badge1Y + 20);
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 24px Oswald, sans-serif';
    ctx.fillText(fmtNum(tasaCopToBs), MARGIN + 15, badge1Y + 48);

    const badge2Y = badge1Y + badgeH + 10;
    rrect(ctx, MARGIN, badge2Y, CONTENT_W, badgeH, 10, MID2, COP_COL);
    ctx.fillStyle = COP_COL;
    ctx.font = '600 10px Barlow, sans-serif';
    ctx.fillText('TASA BOLÍVARES → PESOS', MARGIN + 15, badge2Y + 20);
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 24px Oswald, sans-serif';
    ctx.fillText(fmtNum(tasaBsToCop), MARGIN + 15, badge2Y + 48);

    // 3. TABLAS
    function drawVerticalTable(y, title, titleColor, col1Label, col2Label, rows, tableH) {
        rrect(ctx, MARGIN, y, CONTENT_W, tableH, 12, MID, BORDER);
        rrect(ctx, MARGIN, y, CONTENT_W, tableHeaderH, 12, titleColor, null);
        ctx.fillStyle = WHITE;
        ctx.font = 'bold 16px Oswald, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, CARD_W/2, y + 25); // Usa el emoji directo aquí si lo deseas

        ctx.fillStyle = MUTED;
        ctx.font = '600 12px Barlow, sans-serif';
        const colW = CONTENT_W / 2;
        ctx.fillText(col1Label, MARGIN + colW*0.5, y + tableHeaderH + 22);
        ctx.fillText(col2Label, MARGIN + colW*1.5, y + tableHeaderH + 22);

        rows.forEach((row, i) => {
            const ry = y + tableHeaderH + 45 + i * tableRowH;
            if (i % 2 === 1) {
                ctx.fillStyle = 'rgba(255,255,255,0.03)';
                ctx.fillRect(MARGIN, ry - 22, CONTENT_W, tableRowH);
            }
            ctx.fillStyle = TEXT;
            ctx.font = '600 16px Barlow, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(row[0], MARGIN + colW*0.5, ry);
            ctx.fillStyle = titleColor === COP_COL ? '#7BBFFF' : '#FF9070';
            ctx.fillText(row[1], MARGIN + colW*1.5, ry);
        });
        return y + tableH;
    }

    const copRows = copVals.map(v => [
        '$ ' + v.toLocaleString('es-CO'),
        fmtNum(Math.round((v / tasaCopToBs) * 100) / 100) + ' Bs'
    ]);
    const bsRows = bsVals.map(v => [
        v.toLocaleString('es-CO') + ' Bs',
        '$ ' + fmtNum(Math.round(v * tasaBsToCop))
    ]);

    const table1Y = badge2Y + badgeH + 30;
    const endT1 = drawVerticalTable(table1Y, '🇨🇴 Pesos → Bolívares', VES_COL, 'PESOS (COP)', 'BOLÍVARES (BS)', copRows, singleTableH_1);
    const table2Y = endT1 + 25;
    const endT2 = drawVerticalTable(table2Y, '🇻🇪 Bolívares → Pesos', COP_COL, 'BOLÍVARES (BS)', 'PESOS (COP)', bsRows, singleTableH_2);

    // 4. PIE DE PÁGINA (Posición dinámica)
    ctx.fillStyle = MUTED;
    ctx.font = '400 14px Barlow, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tasas de referencia — Los valores pueden variar', CARD_W/2, endT2 + 35);
    ctx.fillStyle = gBar;
    ctx.fillRect(0, dynamicH - 6, CARD_W, 6);

    lastCanvas = canvas;
    showPreview(canvas);
}

function showPreview(canvas) {
    const previewCanvas = document.getElementById('preview-canvas');
    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    const pCtx = previewCanvas.getContext('2d');
    pCtx.drawImage(canvas, 0, 0);
    document.getElementById('preview-wrap').style.display = 'flex';
    document.getElementById('btn-dl').style.display = 'block';
}

function downloadJPG() {
    if (!lastCanvas) return;
    const link = document.createElement('a');
    link.download = 'tasa-cambio.jpg';
    link.href = lastCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
}
