const fs = require("fs");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType,
  BorderStyle, Header, Footer, PageNumber, ImageRun, LevelFormat, HeadingLevel, TabStopType, VerticalAlign } = D;

const TEAL = "0F4C5C", LIGHT = "E3ECEF", ACC = "E36414";
const W = 9360; // ancho útil carta con márgenes de 1"
const money = (n) => (n < 0 ? "−$" : "$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const border = { style: BorderStyle.SINGLE, size: 4, color: "9AAFB6" };
const borders = { top: border, bottom: border, left: border, right: border };

function runs(text, o = {}) {
  // soporta **negritas** simples
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((t) => t.startsWith("**") ? new TextRun({ text: t.slice(2, -2), bold: true, ...o }) : new TextRun({ text: t, ...o }));
}
const p = (text, o = {}) => new Paragraph({ children: runs(text, o.run || {}), spacing: { after: 120, line: 276 }, alignment: o.align, ...(o.para || {}) });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const bullet = (t) => new Paragraph({ numbering: { reference: "bul", level: 0 }, children: runs(t), spacing: { after: 60 } });
const num = (t, ref = "num") => new Paragraph({ numbering: { reference: ref, level: 0 }, children: runs(t), spacing: { after: 60 } });
const spacer = (n = 120) => new Paragraph({ children: [], spacing: { after: n } });

function cell(content, w, o = {}) {
  const paras = (Array.isArray(content) ? content : [content]).map((c) =>
    c instanceof Paragraph ? c : new Paragraph({ children: runs(c, { size: o.size || 18, bold: o.bold, color: o.color }), alignment: o.align, spacing: { after: 40 } }));
  return new TableCell({ children: paras, width: { size: w, type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 }, columnSpan: o.span });
}
// table(headers, rows, widths(relativos), opts)
function table(headers, rows, rel, o = {}) {
  const tot = rel.reduce((a, b) => a + b, 0);
  const widths = rel.map((r) => Math.floor((r / tot) * W)); widths[widths.length - 1] += W - widths.reduce((a, b) => a + b, 0);
  const trs = [];
  if (headers) trs.push(new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, widths[i], { bold: true, color: "FFFFFF", fill: TEAL, size: o.size })) }));
  rows.forEach((r, ri) => {
    const isTotal = o.totalRows && o.totalRows.includes(ri);
    trs.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, widths[i], { size: o.size, fill: isTotal ? LIGHT : (o.firstColFill && i === 0 ? LIGHT : undefined), bold: isTotal || (o.firstColBold && i === 0), align: (o.right || []).includes(i) ? AlignmentType.RIGHT : undefined })) }));
  });
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: trs });
}
// tabla de 2 columnas etiqueta/valor
const kv = (pairs, rel = [30, 70]) => table(null, pairs, rel, { firstColFill: true, firstColBold: true, size: 19 });

function img(path, wIn, hIn) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [new ImageRun({ type: "png", data: fs.readFileSync(path), transformation: { width: wIn * 96, height: hIn * 96 } })] });
}
const caption = (t) => new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, italics: true, size: 17, color: "555555" })], spacing: { after: 200 } });


const sizeOf = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });
function sigRun(key, hIn) {
  const buf = fs.readFileSync(`sig/${key}.png`); const { w, h } = sizeOf(buf);
  let H = hIn * 96, Wd = (w / h) * H; if (Wd > 200) { Wd = 200; H = (h / w) * Wd; }
  return new ImageRun({ type: "png", data: buf, transformation: { width: Math.round(Wd), height: Math.round(H) } });
}
const sigPara = (key) => new Paragraph({ alignment: AlignmentType.CENTER, children: [sigRun(key, 0.42)] });

// bloque de firmas: [{nombre, rol, leyenda?}]
function firmas(list) {
  const w = Math.floor(W / list.length);
  const noB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const nb = { top: noB, bottom: noB, left: noB, right: noB };
  const cells = list.map((f) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: nb, margins: { left: 200, right: 200 },
    children: [
      ...(f.leyenda ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.leyenda, size: 17, italics: true })], spacing: { after: 80 } })] : []),
      f.sig ? new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 } },
          children: [sigRun(f.sig, 0.62)] })
        : new Paragraph({ children: [], spacing: { before: 700 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 } } }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.nombre, bold: true, size: 19 })], spacing: { before: 60 } }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.rol, size: 18 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: f.fecha ? "Fecha: " + f.fecha : "Firma y fecha", size: 16, color: "777777" })] }),
    ] }));
  return new Table({ width: { size: w * list.length, type: WidthType.DXA }, columnWidths: list.map(() => w), rows: [new TableRow({ cantSplit: true, children: cells })] });
}

function titleBlock(titulo, codigo, elemento) {
  return [
    new Paragraph({ children: [new TextRun({ text: elemento.toUpperCase(), size: 18, color: ACC, bold: true })], spacing: { after: 40 } }),
    new Paragraph({ children: [new TextRun({ text: titulo, size: 36, bold: true, color: TEAL, font: "Arial" })], spacing: { after: 60 } }),
    new Paragraph({ children: [new TextRun({ text: codigo, size: 18, color: "666666" })], spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 4 } } }),
  ];
}

async function save(path, { titulo, codigo, elemento, body, proyecto }) {
  const doc = new Document({
    creator: "Jesús Roberto Aragón López", title: titulo,
    styles: {
      default: { document: { run: { font: "Arial", size: 21 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 26, bold: true, color: TEAL }, paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 22, bold: true, color: "333333" }, paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, outlineLevel: 1 } },
      ],
    },
    numbering: { config: [
      { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1300, bottom: 1200, left: 1440, right: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: W }],
        children: [new TextRun({ text: proyecto.corto, bold: true, color: TEAL, size: 17 }), new TextRun({ text: "\t" + proyecto.empresa, size: 16, color: "777777" })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB", space: 4 } } })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: W }],
        children: [new TextRun({ text: codigo + " · EC0935 Gestión de trabajo por proyectos", size: 15, color: "777777" }),
          new TextRun({ children: ["\tPágina ", PageNumber.CURRENT, " de ", PageNumber.TOTAL_PAGES], size: 15, color: "777777" })] })] }) },
      children: [...titleBlock(titulo, codigo, elemento), ...body],
    }],
  });
  fs.writeFileSync(path, await Packer.toBuffer(doc));
}

module.exports = { sigPara, p, h1, h2, bullet, num, spacer, table, kv, img, caption, firmas, save, money, runs, Paragraph, TextRun };
