// Constantes de diseño
const CARD_W = 640;

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

// Rectángulos redondeados
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

// FUNCIÓN PRINCIPAL
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
    const ctx = canvas.getContext('2d');

    const MARGIN = 30;
    const CONTENT_W = CARD_W - (MARGIN * 2);

    const headerH = 100;
    const headerY = 30;

    const badgeH = 75;
    const badgeGap = 15;

    const tableHeaderH = 38;
    const tableRowH = 36;
    const tablesGap = 25;

    const copVals = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
    const bsVals = [5000, 6000, 7000, 8000, 9000, 10000, 20000];

    const singleTableH = tableHeaderH + (copVals.length * tableRowH) + 45;

    // 🔥 ALTURA DINÁMICA
    const totalHeight =
        headerY +
        headerH +
        25 +
        (badgeH * 2) +
        badgeGap +
        30 +
        (singleTableH * 2) +
        tablesGap +
        80;

    canvas.height = totalHeight;

    // FONDO
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CARD_W, canvas.height);

    const gBar = ctx.createLinearGradient(0,0,CARD_W,0);
    gBar.addColorStop(0, COP_COL);
    gBar.addColorStop(0.5, GOLD);
    gBar.addColorStop(1, VES_COL);

    ctx.fillStyle = gBar;
    ctx.fillRect(0, 0, CARD_W, 6);

    // HEADER
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

    // BADGE 1
    const badge1Y = headerY + headerH + 25;

    rrect(ctx, MARGIN, badge1Y, CONTENT_W, badgeH, 10, MID2, VES_COL);

    ctx.fillStyle = VES_COL;
    ctx.font = '600 13px Barlow, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TASA PESOS → BOLÍVARES', MARGIN + 20, badge1Y + 25);

    ctx.fillStyle = WHITE;
    ctx.font = 'bold 34px Oswald, sans-serif';
    ctx.fillText('÷ ' + fmtNum(tasaCopToBs), MARGIN + 20, badge1Y + 60);

    // BADGE 2
    const badge2Y = badge1Y + badgeH + badgeGap;

    rrect(ctx, MARGIN, badge2Y, CONTENT_W, badgeH, 10, MID2, COP_COL);

    ctx.fillStyle = COP_COL;
    ctx.fillText('TASA BOLÍVARES → PESOS', MARGIN + 20, badge2Y + 25);

    ctx.fillStyle = WHITE;
    ctx.fillText('× ' + fmtNum(tasaBsToCop), MARGIN + 20, badge2Y + 60);

    // FUNCIÓN TABLA
    function drawVerticalTable(y, title, titleColor, col1Label, col2Label, rows) {
        rrect(ctx, MARGIN, y, CONTENT_W, singleTableH, 12, MID, BORDER);

        rrect(ctx, MARGIN, y, CONTENT_W, tableHeaderH, 12, titleColor, null);

        ctx.fillStyle = WHITE;
        ctx.font = 'bold 16px Oswald, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title.toUpperCase(), CARD_W/2, y + 25);

        ctx.fillStyle = MUTED;
        ctx.font = '600 12px Barlow, sans-serif';

        const colW = CONTENT_W / 2;

        ctx.fillText(col1Label, MARGIN + colW*0.5, y + tableHeaderH + 22);
        ctx.fillText(col2Label, MARGIN + colW*1.5, y + tableHeaderH + 22);

        ctx.strokeStyle = BORDER;
        ctx.beginPath();
        ctx.moveTo(MARGIN + 15, y + tableHeaderH + 32);
        ctx.lineTo(MARGIN + CONTENT_W - 15, y + tableHeaderH + 32);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(CARD_W/2, y + tableHeaderH + 10);
        ctx.lineTo(CARD_W/2, y + singleTableH - 10);
        ctx.stroke();

        rows.forEach((row, i) => {
            const ry = y + tableHeaderH + 35 + i * tableRowH;

            if (i % 2 === 1) {
                ctx.fillStyle = 'rgba(255,255,255,0.03)';
                ctx.fillRect(MARGIN + 2, ry - 20, CONTENT_W - 4, tableRowH);
            }

            ctx.fillStyle = TEXT;
            ctx.font = '600 16px Barlow, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(row[0], MARGIN + colW*0.5, ry + 5);

            ctx.fillStyle = titleColor === COP_COL ? '#7BBFFF' : '#FF9070';
            ctx.fillText(row[1], MARGIN + colW*1.5, ry + 5);
        });
    }

    // DATOS
    const copRows = copVals.map(v => [
        '$ ' + v.toLocaleString('es-CO'),
        fmtNum(Math.round((v / tasaCopToBs) * 100) / 100) + ' Bs'
    ]);

    const bsRows = bsVals.map(v => [
        v.toLocaleString('es-CO') + ' Bs',
        '$ ' + fmtNum(Math.round(v * tasaBsToCop))
    ]);

    const table1Y = badge2Y + badgeH + 30;
    drawVerticalTable(table1Y, '🇨🇴 Pesos → Bolívares', VES_COL, 'PESOS (COP)', 'BOLÍVARES (BS)', copRows);

    const table2Y = table1Y + singleTableH + tablesGap;
    drawVerticalTable(table2Y, '🇻🇪 Bolívares → Pesos', COP_COL, 'BOLÍVARES (BS)', 'PESOS (COP)', bsRows);

    // FOOTER
    ctx.fillStyle = MUTED;
    ctx.font = '400 14px Barlow, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tasas de referencia — Los valores pueden variar', CARD_W/2, canvas.height - 25);

    ctx.fillStyle = gBar;
    ctx.fillRect(0, canvas.height - 6, CARD_W, 6);

    lastCanvas = canvas;
    showPreview(canvas);
}

// PREVIEW
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

// DESCARGA
function downloadJPG() {
    if (!lastCanvas) return;

    const link = document.createElement('a');
    link.download = 'tasa-de-cambio-movil.jpg';
    link.href = lastCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
}
