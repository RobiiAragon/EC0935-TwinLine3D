// Anexos de evidencia (caso de estudio simulado)
const fs = require("fs");
const { sigPara, p, h1, h2, bullet, num, spacer, table, kv, img, caption, firmas, save, money } = require("./lib");
const { P, people } = require("./data");
const OUT = (process.argv[2] || "out") + "/anexos";
fs.mkdirSync(OUT, { recursive: true });
const N = (k) => people[k].nombre;
const EL = "Anexo de evidencia · E2924 Implementar el proyecto";
const meta = (c) => ({ codigo: c, elemento: EL, proyecto: P });
const NOTE = p("Caso de estudio simulado para la evaluación del EC0935. La empresa, las personas y los datos son ficticios.", { run: { size: 16, italics: true, color: "777777" } });

const maquinas = [
  ["M01", "LD-1", "Cargador de tarjetas"], ["M02", "SPI-1", "Inspección de pasta de soldadura"], ["M03", "PP-1", "Colocadora de componentes"],
  ["M04", "PP-2", "Colocadora de componentes"], ["M05", "PP-3", "Colocadora de componentes"], ["M06", "PP-4", "Colocadora de componentes"],
  ["M07", "RF-1", "Horno de reflujo"], ["M08", "LD-2", "Cargador de tarjetas"], ["M09", "SPI-2", "Inspección de pasta de soldadura"],
  ["M10", "PP-5", "Colocadora de componentes"], ["M11", "RF-2", "Horno de reflujo"], ["M12", "ULD-1", "Descargador de tarjetas"],
];
const loss = JSON.parse(fs.readFileSync("loss.json", "utf8"));

// generador determinista
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const dias = ["02/11", "03/11", "04/11", "05/11", "06/11", "09/11", "10/11", "11/11", "12/11", "13/11"];
const mttr = [18.4, 17.9, 17.1, 16.8, 16.5, 15.9, 15.6, 15.4, 15.2, 15.0];
const nparos = [4, 3, 3, 4, 2, 3, 4, 3, 3, 2];
const causas = ["Falta de componente en alimentador", "Atasco de tarjeta en banda", "Error de visión en boquilla", "Alarma de temperatura del horno", "Sensor de tarjeta sucio", "Cambio de modelo no programado"];
const ids = [...maquinas.map((m) => m[1]), "AOI-1", "AOI-2"];
const paros = [];
dias.forEach((d, i) => {
  const n = nparos[i]; const target = Math.round(mttr[i] * n * 10) / 10; let acc = 0;
  for (let j = 0; j < n; j++) {
    let dur = j < n - 1 ? Math.round((mttr[i] + (rnd() - 0.5) * 6) * 10) / 10 : Math.round((target - acc) * 10) / 10;
    acc += dur;
    const h = 7 + Math.floor(rnd() * 9), mi = Math.floor(rnd() * 60);
    paros.push([`${d}/2026`, `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`, ids[Math.floor(rnd() * ids.length)], causas[Math.floor(rnd() * causas.length)], `${4 + Math.floor(rnd() * 11)} s`, dur.toFixed(1)]);
  }
});
const tot = paros.reduce((a, x) => a + parseFloat(x[5]), 0);
const mttrP = tot / paros.length;
if (paros.length !== 31 || Math.abs(mttrP - 16.47) > 0.02) throw new Error("piloto " + paros.length + " " + mttrP);
const alertAvg = paros.reduce((a, x) => a + parseInt(x[4]), 0) / paros.length;

async function main() {
  // A-02
  await save(`${OUT}/A-02 Requerimientos e inventario de máquinas.docx`, { titulo: "Documento de requerimientos e inventario de máquinas", ...meta("TL3D-A-02"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-02 Levantamiento de requerimientos e inventario de máquinas"], ["Fecha", "14/08/2026"], ["Elaboró", `${N("lider")} — Líder del proyecto`],
      ["Fuentes", `Entrevistas con ${N("mant")} (06/08), ${N("prod")} (06/08) y ${N("ti")} (07/08); recorrido por la Línea SMT-2 (10 – 12/08)`]]),
    h1("Requerimientos"),
    table(["ID", "Requerimiento", "Solicitó", "Criterio para comprobarlo"], [
      ["RQ-01", "Detectar automáticamente si cada máquina está en marcha, en paro o en falla.", N("mant"), "Prueba de 48 h con pérdida menor a 1%"],
      ["RQ-02", "Mostrar la línea en 3D con colores por estado.", N("prod"), "Actualización de 5 s o menos"],
      ["RQ-03", "Enviar una alerta al técnico cuando una máquina para.", N("mant"), "Alerta en 30 s o menos"],
      ["RQ-04", "Calcular el MTTR diario y enviar un reporte semanal.", N("prod"), "Tablero y reporte automáticos"],
      ["RQ-05", "No modificar el PLC ni el firmware de las máquinas.", N("mant"), "Sensado no invasivo"],
      ["RQ-06", "Operar en una VLAN aislada, sin acceso desde internet.", N("ti"), "Escaneo de puertos sin hallazgos"],
      ["RQ-07", "Cargar en la tablet de planta en menos de 5 s.", N("prod"), "Modelo glTF de menos de 15 MB"],
    ], [10, 42, 24, 24], { size: 17 }),
    h1("Inventario de máquinas de la Línea SMT-2"),
    table(["ID nodo", "ID máquina", "Tipo", "Señales a monitorear"], maquinas.map((m) => [m[0], m[1], m[2], "Corriente (marcha/paro), torreta roja (falla), vibración"]), [12, 15, 33, 40], { size: 17 }),
    p("Nota: las 2 máquinas de inspección óptica (AOI) no quedaron en este inventario. Se agregaron después con el cambio autorizado CC-01 (15/09/2026)."),
    spacer(200), firmas([{ nombre: N("dueno"), rol: "Dueño del proyecto", leyenda: "Aprobó", sig: "dueno", fecha: "14/08/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: "14/08/2026" }]),
  ] });

  // A-03
  await save(`${OUT}/A-03 Acta de recepción de material.docx`, { titulo: "Acta de recepción e inspección de material", ...meta("TL3D-A-03"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-03 Suministro de hardware IoT"], ["Proveedor", "Automatización y Control del Noroeste, S.A. de C.V. (E1)"], ["Orden de compra", "OC-EIP-2026-0841 del 24/08/2026"],
      ["Fecha de recepción", "27/08/2026"], ["Fecha de inspección", "28/08/2026"], ["Lugar", "Almacén general de EIP"]]),
    h1("Material recibido"),
    table(["Concepto", "Pedido", "Recibido", "Inspección", "Resultado"], [
      ["Nodo ESP32 industrial con gabinete IP54", "14", "14", "Encendido y conexión a la VLAN de prueba", "Conforme"],
      ["Sensor de corriente no invasivo", "14", "14", "Lectura con carga de prueba", "Conforme"],
      ["Sensor de vibración", "14", "14", "Lectura en banco", "Conforme"],
      ["Cableado y accesorios", "1 lote", "1 lote", "Conteo contra la lista de empaque", "Conforme"],
    ], [34, 10, 11, 30, 15], { size: 17 }),
    p("Resultado: material completo y sin defectos. Se libera el pago a 15 días, según TL3D-3.3. Las fichas técnicas y la carta de garantía (12 meses) quedan en el expediente de compras."),
    spacer(200), firmas([{ nombre: N("fin"), rol: "Contralora de Planta", leyenda: "Recibió", sig: "fin", fecha: "28/08/2026" }, { nombre: N("mant"), rol: "Jefe de Mantenimiento", leyenda: "Inspeccionó", sig: "mant", fecha: "28/08/2026" }]),
  ] });

  // A-04
  await save(`${OUT}/A-04 Acta de entrega de la instalación.docx`, { titulo: "Acta de entrega-recepción de la instalación de sensores", ...meta("TL3D-A-04"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-04 Instalación eléctrica de sensores (y PT-13 para las AOI)"], ["Contratista", "Instalaciones Eléctricas Industriales Otay, S.A. de C.V. (E2)"],
      ["Periodo", "31/08/2026 – 11/09/2026, en paros programados"], ["Procedimiento", "Bloqueo y etiquetado (LOTO); sin intervención en el PLC"]]),
    h1("Máquinas instaladas"),
    table(["ID nodo", "Máquina", "Fecha de instalación", "Prueba de señal", "Etiqueta"], maquinas.map((m, i) => [m[0], m[1], ["31/08", "31/08", "01/09", "01/09", "04/09", "04/09", "05/09", "07/09", "08/09", "08/09", "10/09", "10/09"][i] + "/2026", "OK", "Sí"]), [14, 16, 26, 22, 22], { size: 17 }),
    h2("Ampliación por CC-01 (PT-13)"),
    table(["ID nodo", "Máquina", "Fecha de instalación", "Prueba de señal", "Etiqueta"], [["M13", "AOI-1", "19/10/2026", "OK", "Sí"], ["M14", "AOI-2", "20/10/2026", "OK", "Sí"]], [14, 16, 26, 22, 22], { size: 17 }),
    img("img/instalacion.png", 6.2, 2.2), caption("Esquema de instalación aplicado en cada máquina."),
    spacer(120), firmas([{ nombre: N("mant"), rol: "Jefe de Mantenimiento", leyenda: "Recibió la instalación a entera satisfacción", sig: "mant", fecha: "11/09/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Verificó", sig: "lider", fecha: "11/09/2026" }]),
  ] });

  // A-05
  await save(`${OUT}/A-05 Reporte de prueba de 48 h.docx`, { titulo: "Reporte de la prueba de transmisión de 48 horas", ...meta("TL3D-A-05"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-05 Red IoT y servidor local"], ["Periodo de prueba", "15/09/2026 08:00 – 17/09/2026 08:00 (48 h)"], ["Criterio de aceptación", "Pérdida de mensajes menor a 1% por máquina"], ["Envío", "1 mensaje cada 2 s por nodo (86,400 esperados por máquina)"]]),
    table(["Máquina", "Mensajes esperados", "Recibidos", "Pérdida", "Cumple"], maquinas.map((m, i) => [m[1], "86,400", Math.round(86400 * (1 - loss[i] / 100)).toLocaleString("en-US"), loss[i].toFixed(2) + "%", "Sí"]), [20, 22, 22, 18, 18], { size: 17 }),
    p(`Pérdida promedio: ${(loss.reduce((a, b) => a + b, 0) / loss.length).toFixed(2)}%. Hallazgo: PP-1 y RF-1 tenían interferencia Wi-Fi el primer día; se cambiaron a antena externa (plan alterno del riesgo R3).`),
    img("img/prueba48h.png", 6.2, 2.35),
    spacer(120), firmas([{ nombre: N("ti"), rol: "Coordinador de TI", leyenda: "Validó", sig: "ti", fecha: "18/09/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: "18/09/2026" }]),
  ] });

  // A-06
  await save(`${OUT}/A-06 Acta de aceptación del modelo 3D.docx`, { titulo: "Acta de aceptación del modelo 3D", ...meta("TL3D-A-06"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-06 Modelo 3D de la línea"], ["Proveedor", "Daniela Fernanda Ortiz Medina, Estudio Polígono 3D (E3)"], ["Fecha de entrega", "18/09/2026"], ["Fecha de aceptación", "25/09/2026"]]),
    table(["Criterio", "Requerido", "Resultado", "Cumple"], [
      ["Peso del archivo .glb", "Menos de 15 MB", "11.8 MB", "Sí"], ["Máquinas modeladas", "12, con su ID", "12 objetos nombrados de LD-1 a ULD-1", "Sí"],
      ["Tiempo de carga en la tablet de planta", "Menos de 5 s", "3.6 s (promedio de 5 cargas)", "Sí"], ["Archivo fuente", "Archivo .blend", "Entregado", "Sí"],
      ["Rondas de corrección", "Máximo 2", "1 (escala del horno RF-2)", "Sí"],
    ], [32, 22, 32, 14], { size: 17 }),
    p("Archivos entregados: twinline_smt2.blend, twinline_smt2.glb y la tabla de IDs de objetos. Se resguardan en el servidor local de EIP (no se publican por confidencialidad del layout de la planta)."),
    spacer(200), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Acepto el modelo", sig: "lider", fecha: "25/09/2026" }, { nombre: N("prod"), rol: "Supervisora de Producción", leyenda: "Validó el layout", sig: "prod", fecha: "25/09/2026" }]),
  ] });

  // A-07
  await save(`${OUT}/A-07 Capturas del visor y del tablero.docx`, { titulo: "Capturas del visor 3D y del tablero de indicadores", ...meta("TL3D-A-07"), body: [
    NOTE, p("Capturas tomadas del sistema en operación. Paquetes: PT-07 Plataforma web y visor 3D, PT-08 Alertas y tablero de indicadores y PT-13 (las AOI-1 y AOI-2 visibles)."),
    h2("Visor 3D en la pantalla de la línea (12/11/2026)"), img("img/visor3d.png", 6.4, 3.47), caption("PP-2 en paro (amarillo), LD-2 en falla (rojo) y alerta enviada a Teams."),
    h2("Tablero de MTTR durante el piloto"), img("img/tablero_mttr.png", 6.2, 2.48), caption("MTTR diario contra la línea base y la meta."),
    h2("Arquitectura del sistema"), img("img/arquitectura.png", 6.3, 2.65),
    spacer(120), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Integró", sig: "lider", fecha: "13/11/2026" }]),
  ] });

  // A-10
  await save(`${OUT}/A-10 Reporte del piloto.docx`, { titulo: "Reporte del piloto en operación real", ...meta("TL3D-A-10"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-10 Pruebas integrales y piloto"], ["Periodo", "02/11/2026 – 13/11/2026 (10 días hábiles)"], ["Línea base", "20.0 min de MTTR (junio – julio 2026, 46 paros)"],
      ["Resultado", `${paros.length} paros · MTTR ponderado de ${mttrP.toFixed(1)} min (−${((1 - Number(mttrP.toFixed(1)) / 20) * 100).toFixed(1)}%) · alerta promedio en ${alertAvg.toFixed(0)} s · 0 incidentes de seguridad`]]),
    h1("Pruebas de integración y seguridad (28 – 30/10/2026)"),
    table(["Prueba", "Resultado"], [["Escaneo de puertos desde fuera de la VLAN", "Sin puertos expuestos"], ["Corte de red de 10 min", "El nodo guarda los eventos y los reenvía al reconectar"],
      ["Reinicio del servidor", "Servicio arriba en 48 s; sin pérdida de eventos"], ["Prueba de alerta en Teams (20 eventos)", "20/20 entregadas; máximo de 21 s"]], [50, 50], { size: 17 }),
    h1("Registro de paros del piloto"),
    table(["Fecha", "Hora", "Máquina", "Causa", "Alerta", "Respuesta (min)"], paros, [14, 9, 11, 40, 10, 16], { size: 16 }),
    p(`Suma de tiempos de respuesta: ${tot.toFixed(1)} min ÷ ${paros.length} paros = **${mttrP.toFixed(2)} min**. Meta (17 min o menos) cumplida.`),
    spacer(120), firmas([{ nombre: N("prod"), rol: "Supervisora de Producción", leyenda: "Validó las mediciones", sig: "prod", fecha: "13/11/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: "13/11/2026" }]),
  ] });

  // A-11
  const asist = [["Técnico de mantenimiento", "Raúl Enrique Domínguez Vega", 9.5], ["Técnico de mantenimiento", "José Luis Arreola Partida", 8.5], ["Técnico de mantenimiento", "Brenda Guadalupe Soto Macías", 9.0],
    ["Técnico de mantenimiento", "Iván Alejandro Ruelas Cota", 10], ["Técnico de mantenimiento", "Cristian Omar Félix Lugo", 8.5], ["Técnico de mantenimiento", "Martha Elena Rosas Inzunza", 9.0],
    ["Técnico de mantenimiento", "Diego Armando Valle Sandoval", 8.0], ["Técnico de mantenimiento", "Kevin Ulises Moreno Haro", 9.5], ["Supervisora de producción", N("prod"), 9.5],
    ["Supervisor de producción", "Héctor Daniel Ayala Bernal", 9.0], ["Supervisora de producción", "Gabriela Ivonne Torres Medrano", 9.5]];
  const avg = asist.reduce((a, x) => a + x[2], 0) / asist.length;
  await save(`${OUT}/A-11 Registro de capacitación.docx`, { titulo: "Registro de capacitación y evaluación práctica", ...meta("TL3D-A-11"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-11 Capacitación"], ["Fechas", "10/11/2026 (turno A) y 11/11/2026 (turno B), 2 h cada sesión"], ["Instructores", `${N("lider")} y ${N("mant")}`],
      ["Temas", "Lectura del visor 3D · respuesta a alertas en Teams · tablero de MTTR · qué hacer si no hay red"], ["Evaluación", "Práctica: atender 3 paros simulados en el visor (calificación mínima de 8/10)"]]),
    table(["#", "Nombre completo", "Puesto", "Calificación", "Firma de asistencia"], asist.map((a, i) => [String(i + 1), a[1], a[0], a[2].toFixed(1), sigPara(i === 8 ? "prod" : `cap${i + 1}`)]), [5, 33, 25, 13, 24], { size: 17 }),
    p(`Asistencia: 11 de 11 (100%). Promedio: ${avg.toFixed(1)}/10. Calificación mínima: 8.0. Todos aprobaron.`),
    img("img/capacitacion.png", 6.2, 2.2),
    spacer(120), firmas([{ nombre: N("mant"), rol: "Jefe de Mantenimiento", leyenda: "Instructor", sig: "mant", fecha: "11/11/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Instructor", sig: "lider", fecha: "11/11/2026" }]),
  ] });

  // A-12
  await save(`${OUT}/A-12 Cierre de contratos y entrega de manuales.docx`, { titulo: "Acta de cierre de contratos y entrega de manuales", ...meta("TL3D-A-12"), body: [
    NOTE, kv([["Paquete de trabajo", "PT-12 Documentación y cierre"], ["Fecha", "19/11/2026"]]),
    h1("Cierre de contratos con proveedores"),
    table(["Proveedor", "Monto final (incluye CC-01)", "Pagado", "Pendiente", "Estado"], [
      ["E1 Automatización y Control del Noroeste, S.A. de C.V.", money(44200), money(44200), money(0), "Cerrado; garantía hasta el 28/08/2027"],
      ["E2 Instalaciones Eléctricas Industriales Otay, S.A. de C.V.", money(31700), money(31700), money(0), "Cerrado"],
      ["E3 Daniela Fernanda Ortiz Medina (Estudio Polígono 3D)", money(26800), money(26800), money(0), "Cerrado; archivos fuente entregados"],
    ], [36, 17, 14, 12, 21], { size: 17, right: [1, 2, 3] }),
    p("Elementos revisados en cada cierre: entregables recibidos contra el alcance de TL3D-3.3, facturas pagadas, garantías vigentes, devolución de credenciales de acceso a planta y archivos fuente entregados."),
    h1("Manuales entregados"),
    table(["Documento", "Para quién", "Ubicación"], [["Manual técnico (arquitectura, instalación, respaldo y recuperación)", "TI y Mantenimiento", "Servidor local /docs y copia impresa en TI"],
      ["Manual de usuario y guía rápida", "Técnicos y supervisores", "Tablet de mantenimiento y tarjetas en la línea"]], [44, 24, 32], { size: 17 }),
    h2("Guía rápida de usuario (resumen)"),
    ...["Verde = marcha, amarillo = paro, rojo = falla.", "Al recibir una alerta en Teams, toca el enlace: el visor resalta la máquina.", "Al llegar a la máquina, marca \"Atendiendo\" en la tablet; al resolver, marca \"Resuelto\" (así se calcula el MTTR).", "Si el visor no carga, usa la red de respaldo de la tablet y avisa a TI."].map(num),
    spacer(200), firmas([{ nombre: N("fin"), rol: "Contralora de Planta", leyenda: "Cerró los contratos", sig: "fin", fecha: "19/11/2026" }, { nombre: N("mant"), rol: "Jefe de Mantenimiento", leyenda: "Recibió los manuales", sig: "mant", fecha: "19/11/2026" }]),
  ] });
  console.log({ paros: paros.length, mttrP, alertAvg, avg });
}
main().catch((e) => { console.error(e); process.exit(1); });
