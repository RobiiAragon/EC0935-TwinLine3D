const fs = require("fs");
const L = require("./lib");
const { sigPara, p, h1, h2, bullet, num, spacer, table, kv, img, caption, firmas, save, money } = L;
const D = require("./data");
const { P, people, clave, paquetes, ptAOI, cambios, riesgos, proveedores, trabajoProv, corte, estado16, notas16, pagos16 } = D;

const OUT = process.argv[2] || "out";
const N = (k) => people[k].nombre;
const NR = (k) => `${people[k].nombre} (${people[k].puesto})`;
const cost = (pt) => pt.costo.reduce((a, c) => a + c[1], 0);
const base = paquetes.reduce((a, pt) => a + cost(pt), 0);
const netCambios = cambios.reduce((a, c) => a + c.costo, 0);
const vigente = base + netCambios;
const autorizadoTotal = base + P.reserva;
const pt08Final = cost(paquetes.find((x) => x.id === "PT-08")) + 2800;
const allPT = [...paquetes, ptAOI];
const costFinal = (pt) => pt.id === "PT-09" ? 0 : pt.id === "PT-08" ? pt08Final : cost(pt);
const totalFinal = allPT.reduce((a, pt) => a + costFinal(pt), 0);
if (totalFinal !== vigente) throw new Error("totales no cuadran " + totalFinal + " " + vigente);

const dir = (d) => { fs.mkdirSync(`${OUT}/${d}`, { recursive: true }); return `${OUT}/${d}`; };
const D1 = dir("1. Inicio"), D2 = dir("2. Organizacion"), D3 = dir("3. Implementacion"), D4 = dir("4. Verificacion"), D5 = dir("5. Finalizacion");
const meta = (codigo, elemento) => ({ codigo, elemento, proyecto: P });
const E1 = "Elemento 1 de 5 · E2922 Iniciar el proyecto", E2 = "Elemento 2 de 5 · E2923 Organizar el proyecto",
  E3 = "Elemento 3 de 5 · E2924 Implementar el proyecto", E4 = "Elemento 4 de 5 · E2925 Verificar el proyecto", E5 = "Elemento 5 de 5 · E2926 Finalizar el proyecto";

// ---------- Reporte de junta (minuta) genérico ----------
function minuta(m) {
  const body = [
    kv([["Proyecto", P.nombre], ["Lugar", m.lugar], ["Fecha de la junta", m.fecha], ["Horario", m.horario],
      ["Elaboró el reporte", `${N("lider")} — Líder del proyecto`], ["Fecha de la próxima reunión", m.proxima]]),
    h1("Objetivo de la junta"), p(m.objetivo),
    h1("Asistentes"),
    table(["Nombre completo", "Puesto / rol en el proyecto", "Asistió", "Firma de confirmación"],
      m.asistentes.map((k) => [N(k), `${people[k].puesto} — ${people[k].rol}`, "Sí", sigPara(k)]), [28, 36, 9, 27], { size: 18 }),
    h1("Temas tratados"), ...m.temas.map((t) => num(t)),
    h1("Acuerdos"),
    table(["#", "Acuerdo", "Responsable", "Fecha"], m.acuerdos.map((a, i) => [String(i + 1), a[0], N(a[1]), a[2]]), [5, 55, 25, 15], { size: 18 }),
  ];
  if (m.aprendizajes) { body.push(h1("Aprendizajes del equipo durante el proyecto")); m.aprendizajes.forEach((a) => body.push(bullet(a))); }
  if (m.pendientes) {
    body.push(h1("Tareas pendientes"));
    body.push(table(["#", "Tarea pendiente", "Responsable", "Fecha compromiso"], m.pendientes.map((a, i) => [String(i + 1), a[0], N(a[1]), a[2]]), [5, 55, 25, 15], { size: 18 }));
  }
  body.push(h1("Próxima reunión"), p(m.proximaTxt));
  body.push(spacer(200), firmas([{ nombre: N("lider"), rol: "Elaboró · Líder del proyecto", sig: "lider", fecha: m.fecha }]));
  return body;
}

async function main() {
  // =============== 1.1 PLAN BÁSICO ===============
  await save(`${D1}/1.1 Plan Básico.docx`, { titulo: "Plan básico del proyecto", ...meta("TL3D-1.1", E1), body: [
    kv([["Nombre del proyecto", P.nombre], ["Empresa", `${P.empresa}, ${P.ubicacion}`],
      ["Dueño del proyecto", NR("dueno")], ["Líder del proyecto", NR("lider")], ["Fecha de elaboración", "04/08/2026"]]),
    h1("Participantes clave"),
    table(["Nombre completo", "Puesto", "Función en el proyecto"], clave.map((k) => [N(k), people[k].puesto, people[k].rol]), [32, 33, 35]),
    h1("Expectativas de los participantes clave"),
    p("Cada expectativa es realista, se puede medir y tiene una fecha."),
    table(["Participante clave", "Expectativa (medible y con fecha)"], [
      [N("dueno"), "Reducir el tiempo promedio de respuesta a paros no programados de la Línea SMT-2 de 20 a 17 minutos o menos (−15%) a más tardar el 20/11/2026, con una inversión total no mayor a $233,000.00 MXN."],
      [N("mant"), "Recibir en el celular una alerta de paro en 30 segundos o menos y ubicar la máquina en el modelo 3D, a partir del inicio del piloto (02/11/2026)."],
      [N("prod"), "Ver en una pantalla de la línea el estado de todas las máquinas con actualización de 5 segundos o menos, y recibir un reporte semanal automático de paros a partir del 02/11/2026."],
      [N("ti"), "Que la solución opere en una red aislada (VLAN IoT), sin abrir puertos a internet y con 0 incidentes de seguridad durante el piloto (02/11 – 13/11/2026)."],
      [N("fin"), "Que el 100% de los pagos a proveedores tenga orden de compra y factura, y que al cierre (20/11/2026) no queden pagos pendientes."],
      [N("lider"), "Entregar los paquetes de trabajo en 16 semanas (03/08 – 20/11/2026) sin rebasar el presupuesto autorizado de $233,000.00 MXN."],
    ], [28, 72]),
    h1("Objetivo del proyecto (SMART)"),
    p("**Reducir al menos un 15% (de 20 a 17 minutos) el tiempo promedio de respuesta (MTTR) ante paros no programados de las máquinas de la Línea SMT-2 de EIP, con un gemelo digital 3D web que monitoree en tiempo real el estado de cada máquina, entre el 3 de agosto y el 20 de noviembre de 2026, con un presupuesto máximo de $233,000.00 MXN.**"),
    table(["Criterio", "Cómo se cumple"], [
      ["Específico", "Reducir el MTTR de paros no programados en una línea concreta (SMT-2) usando un gemelo digital 3D."],
      ["Medible", "MTTR medido por el sistema: línea base de 20 min (junio – julio 2026, 46 paros) y meta de 17 min o menos."],
      ["Aterrizado (alcanzable)", "Usa sensores no invasivos y tecnología web probada; no requiere modificar las máquinas."],
      ["Realista", "Presupuesto de $233,000 MXN y un líder dedicado con apoyo de Mantenimiento, Producción y TI."],
      ["Tiempo específico", "Del 03/08/2026 al 20/11/2026 (16 semanas)."],
    ], [25, 75]),
    h1("Descripción del proyecto"),
    p("El proyecto abarca todo el trabajo necesario para lograr el objetivo:"),
    ...[
      "Levantar los requerimientos con Mantenimiento, Producción y TI, e inventariar las máquinas y las señales a monitorear.",
      "Comprar el hardware IoT (nodos ESP32 con sensores de corriente, vibración y torreta) a un proveedor calificado.",
      "Contratar la instalación eléctrica de los sensores en las máquinas sin intervenir su PLC.",
      "Configurar una red IoT aislada (VLAN) y un servidor local con broker MQTT.",
      "Contratar el modelado 3D de la nave y las máquinas, y optimizarlo para la web.",
      "Desarrollar la plataforma web: API, base de datos de eventos y visor 3D con colores por estado.",
      "Desarrollar las alertas al celular del técnico y un tablero de indicadores (MTTR) con reporte semanal.",
      "Realizar pruebas integrales y de seguridad, y un piloto de 2 semanas en operación real.",
      "Capacitar a los técnicos y supervisores, documentar el sistema y cerrar los contratos.",
    ].map(bullet),
    h1("Descripción del producto que se obtendrá"),
    p("Un sistema funcionando en la planta, llamado **TwinLine 3D**, compuesto por:"),
    ...[
      "Un nodo IoT instalado en cada máquina de la Línea SMT-2, que detecta si la máquina está en marcha, en paro o en falla.",
      "Un visor 3D web (en la tablet de mantenimiento y en una pantalla de la línea) donde cada máquina cambia de color según su estado en tiempo real.",
      "Alertas automáticas al celular del técnico cuando una máquina se detiene.",
      "Un tablero de indicadores con el MTTR diario y un reporte semanal automático.",
      "Un manual técnico y un manual de usuario.",
    ].map(bullet),
    p("La diferencia con el proyecto: el **proyecto** es el trabajo descrito arriba; el **producto** es el sistema TwinLine 3D que queda operando al terminar."),
    h1("Supuestos del proyecto"),
    p("Condiciones que se consideran ciertas para planear:"),
    ...[
      "La planta tiene espacio en su rack de TI y energía disponible para un servidor local.",
      "Producción dará ventanas de paro programado (fines de semana) para instalar los sensores.",
      "Las máquinas tienen alimentación de 24 VCD y una torreta de señal accesible para conectar un sensor no invasivo.",
      "Los técnicos de mantenimiento cuentan con celular corporativo con acceso a la red interna.",
      "La bitácora de paros de junio – julio 2026 es confiable como línea base (MTTR de 20 min).",
    ].map(bullet),
    h1("Limitantes del proyecto"),
    table(["Tipo", "Limitante"], [
      ["Costo", "El presupuesto máximo es de $233,000.00 MXN, incluida una reserva de riesgos del 5%."],
      ["Tiempo", "El proyecto debe terminar a más tardar el 20/11/2026, antes de la temporada alta de producción de diciembre."],
      ["Alcance", "Solo cubre la Línea SMT-2; las líneas SMT-1 y SMT-3 quedan fuera."],
      ["Calidad / técnica", "No se puede modificar el PLC ni el firmware de las máquinas (garantía del fabricante): el sensado debe ser no invasivo."],
      ["Seguridad", "Por política de TI, el sistema debe operar en la red local sin exposición a internet."],
    ], [20, 80]),
    h1("Fechas importantes"),
    table(["Fecha", "Evento"], [
      ["03/08/2026", "Inicio del proyecto"], ["05/08/2026", "Junta de inicio"], ["19/08/2026", "Junta de presentación del plan detallado"],
      ["11/09/2026", "Sensores instalados en las máquinas"], ["09/10/2026", "Visor 3D funcionando"], ["02/11/2026", "Inicio del piloto en operación real"],
      ["13/11/2026", "Fin del piloto y medición del MTTR"], ["20/11/2026", "Término del proyecto y junta de cierre"],
    ], [25, 75]),
    h1("Información histórica relevante"),
    p("EIP es una maquiladora de ensamble electrónico con 3 líneas de montaje superficial (SMT) en el Parque Industrial El Florido. Hoy los paros se reportan por radio y se anotan en una bitácora en papel. En junio y julio de 2026 la Línea SMT-2 tuvo 46 paros no programados, con un tiempo promedio de respuesta de 20 minutos (cerca de 15 horas de producción perdidas)."),
    h2("Lecciones aprendidas de proyectos similares anteriores"),
    table(["Proyecto anterior", "Lección aprendida", "Cómo se aplica en este proyecto"], [
      ["Tablero de paros en Excel, EIP (2025)", "Se abandonó en 3 meses porque dependía de que los técnicos capturaran los datos a mano.", "La captura se automatiza con sensores; nadie tiene que registrar el paro."],
      ["Prototipo académico de visor 3D web del líder (UTT, may – jul 2026)", "Los modelos 3D pesados tardaban más de 20 s en cargar en la tablet.", "El modelo glTF se limita a menos de 15 MB y se prueba en la tablet real de la planta."],
      ["Proyecto SaaS freelance del líder (2025)", "No tener fecha de término definida y no verificar las sumas del presupuesto generó retrabajo en la documentación.", "La fecha de término se fija desde el plan básico y los totales se validan antes de cada firma."],
    ], [26, 37, 37], { size: 18 }),
    spacer(300),
    firmas([{ nombre: N("dueno"), rol: "Dueño del proyecto", leyenda: "Autorizo el inicio del proyecto", sig: "dueno", fecha: "04/08/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: "04/08/2026" }]),
  ] });

  // =============== 1.2 MINUTA INICIO ===============
  await save(`${D1}/1.2 Minuta Junta de Inicio.docx`, { titulo: "Reporte de la junta de inicio del proyecto", ...meta("TL3D-1.2", E1), body: minuta({
    lugar: "Sala de juntas B, planta EIP", fecha: "05/08/2026", horario: "09:00 – 10:30 h (90 minutos)", proxima: "19/08/2026",
    objetivo: "Presentar el plan básico del proyecto TwinLine 3D, alinear las expectativas de los participantes clave y acordar cómo se trabajará.",
    asistentes: clave,
    temas: ["Bienvenida y presentación de los participantes clave.", "Presentación del plan básico: objetivo SMART, alcance, producto, supuestos y limitantes.",
      "Revisión de la expectativa de cada participante clave.", "Línea base: 46 paros y MTTR de 20 min en junio – julio 2026.",
      "Ventanas de paro disponibles para instalar los sensores.", "Política de seguridad de TI para dispositivos IoT.", "Canales de comunicación y frecuencia de las juntas."],
    acuerdos: [
      ["Se aprueba el plan básico y el objetivo de reducir el MTTR de 20 a 17 min al 20/11/2026.", "dueno", "05/08/2026"],
      ["La instalación de los sensores se hará solo en los paros programados de fin de semana.", "prod", "05/08/2026"],
      ["El sistema operará en una VLAN aislada, sin acceso desde internet.", "ti", "05/08/2026"],
      ["Toda compra requiere 3 cotizaciones, orden de compra y factura.", "fin", "05/08/2026"],
      ["Habrá juntas de seguimiento cada 15 días y un reporte de estado por correo cada viernes.", "lider", "05/08/2026"],
    ],
    pendientes: [
      ["Entregar la bitácora de paros de junio – julio 2026.", "mant", "07/08/2026"],
      ["Enviar el calendario de paros programados de agosto – septiembre.", "prod", "07/08/2026"],
      ["Enviar la política de seguridad de dispositivos IoT.", "ti", "10/08/2026"],
      ["Entregar el documento de requerimientos e inventario de máquinas.", "lider", "14/08/2026"],
      ["Presentar el plan detallado para su autorización.", "lider", "19/08/2026"],
    ],
    proximaTxt: "19/08/2026, 09:00 h, sala de juntas B: presentación del plan detallado del proyecto.",
  }) });

  // =============== 2.1 PLAN DETALLADO ===============
  const pdBody = [
    kv([["Proyecto", P.nombre], ["Dueño del proyecto", NR("dueno")], ["Líder del proyecto", NR("lider")],
      ["Objetivo (del plan básico)", "Reducir el MTTR de paros no programados de la Línea SMT-2 de 20 a 17 min o menos entre el 03/08 y el 20/11/2026."],
      ["Duración total del proyecto", P.duracion], ["Fecha de elaboración", "18/08/2026"], ["Fecha de autorización", "19/08/2026, en la junta de presentación del plan"]]),
    h1("1. Paquetes de trabajo, actividades y criterios de aceptación"),
    p("El trabajo total se divide en 12 paquetes de trabajo. Cada uno tiene sus actividades, su responsable, sus fechas y su criterio de aceptación."),
  ];
  paquetes.forEach((pt) => {
    pdBody.push(h2(`${pt.id} ${pt.nombre}${pt.ext ? " (paquete realizado por un externo)" : ""}`));
    pdBody.push(table(null, [
      ["Responsable", `${N(pt.resp)}${pt.ext ? " (supervisa al proveedor externo)" : ""}`],
      ["Fechas", `${pt.inicio} – ${pt.fin}`],
      ["Actividades", pt.acts.map((a, i) => `${pt.id.slice(3)}.${i + 1} ${a}`)],
      ["Criterio de aceptación", pt.criterio],
    ], [22, 78], { firstColFill: true, firstColBold: true, size: 18 }));
  });
  pdBody.push(h1("2. Costo estimado por paquete de trabajo"));
  const costRows = [];
  paquetes.forEach((pt) => pt.costo.forEach((c, i) => costRows.push([i === 0 ? `${pt.id} ${pt.nombre}` : "", c[0], money(c[1])])));
  costRows.push(["Subtotal de paquetes de trabajo", "", money(base)]);
  costRows.push(["Reserva de riesgos (5%)", "Se usa solo con un cambio autorizado por el dueño", money(P.reserva)]);
  costRows.push(["COSTO TOTAL AUTORIZADO", "", money(autorizadoTotal)]);
  pdBody.push(table(["Paquete de trabajo", "Concepto", "Costo (MXN)"], costRows, [38, 44, 18], { size: 17, right: [2], totalRows: [costRows.length - 3, costRows.length - 2, costRows.length - 1] }));
  pdBody.push(p(`Resumen por paquete: ${paquetes.map((pt) => `${pt.id} ${money(cost(pt))}`).join(" · ")}. La suma de los 12 paquetes es ${money(base)}; con la reserva, ${money(autorizadoTotal)}, dentro del límite de $233,000.00 del plan básico.`, { run: { size: 18 } }));
  pdBody.push(h1("3. Duración del proyecto"));
  pdBody.push(p(`El proyecto se llevará a cabo en **${P.duracion}**.`));
  pdBody.push(table(["Paquete", "Inicio", "Término"], paquetes.map((pt) => [`${pt.id} ${pt.nombre}`, pt.inicio, pt.fin]), [60, 20, 20], { size: 18 }));
  pdBody.push(h1("4. Fechas importantes"));
  pdBody.push(table(["Fecha", "Hito"], [
    ["03/08/2026", "Inicio del proyecto"], ["19/08/2026", "Junta de presentación del plan detallado y autorización para implementar"],
    ["28/08/2026", "Hardware IoT recibido"], ["11/09/2026", "Sensores instalados en las 12 máquinas"], ["25/09/2026", "Modelo 3D aceptado"],
    ["09/10/2026", "Visor 3D funcionando"], ["02/11/2026", "Inicio del piloto"], ["13/11/2026", "Fin del piloto y medición del MTTR"],
    ["20/11/2026", "Reporte final y junta de cierre"]], [22, 78], { size: 18 }));
  pdBody.push(h1("5. Roles y responsabilidades de los participantes internos"));
  pdBody.push(table(["Nombre completo", "Rol", "Responsabilidades"], [
    [N("dueno"), "Dueño del proyecto", "Autorizar el presupuesto, los cambios y el paso entre fases; aceptar el reporte final."],
    [N("lider"), "Líder del proyecto", "Planear, coordinar y dar seguimiento; desarrollar la plataforma web, el visor 3D y las alertas; administrar los cambios y los riesgos; elaborar los reportes."],
    [N("mant"), "Jefe de Mantenimiento", "Definir las señales de falla, supervisar al contratista eléctrico, calibrar las alertas y coordinar la capacitación."],
    [N("prod"), "Supervisora de Producción", "Dar las ventanas de paro, validar el tablero y medir el MTTR durante el piloto."],
    [N("ti"), "Coordinador de TI", "Configurar la VLAN y el servidor, revisar la seguridad y autorizar el canal de alertas."],
    [N("fin"), "Contralora de Planta", "Gestionar cotizaciones, órdenes de compra, facturas y pagos; cerrar contratos."],
  ], [28, 20, 52], { size: 18 }));
  pdBody.push(h1("6. Roles y responsabilidades de los participantes externos"));
  pdBody.push(table(["Participante externo", "Paquete", "Responsabilidades"], [
    ["Proveedor de hardware IoT (E1)", "PT-03", "Suministrar 14 nodos y sensores según la especificación, con factura y garantía de 12 meses."],
    ["Contratista eléctrico industrial (E2)", "PT-04", "Instalar los sensores sin intervenir el PLC, con procedimiento LOTO y certificado de instalación."],
    ["Modelador 3D (E3)", "PT-06", "Modelar la nave y las máquinas en Blender y entregar un glTF optimizado de menos de 15 MB."],
  ], [30, 12, 58], { size: 18 }));
  pdBody.push(h1("7. Riesgos del proyecto y plan alterno"));
  pdBody.push(table(["#", "Riesgo", "Plan alterno", "Responsable"], riesgos.map((r, i) => [`R${i + 1}`, r.r, r.plan, N(r.resp)]), [6, 30, 44, 20], { size: 18 }));
  pdBody.push(spacer(300));
  pdBody.push(firmas([{ nombre: N("dueno"), rol: "Dueño del proyecto", leyenda: "Autorizo el plan detallado y el paso a la fase de implementación", sig: "dueno", fecha: "19/08/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: "18/08/2026" }]));
  await save(`${D2}/2.1 Plan Detallado.docx`, { titulo: "Plan detallado del proyecto", ...meta("TL3D-2.1", E2), body: pdBody });

  // =============== 2.2 MINUTA PRESENTACIÓN ===============
  await save(`${D2}/2.2 Minuta de presentación del plan detallado.docx`, { titulo: "Reporte de la junta de presentación del plan del proyecto", ...meta("TL3D-2.2", E2), body: minuta({
    lugar: "Sala de juntas B, planta EIP", fecha: "19/08/2026", horario: "09:00 – 10:45 h (105 minutos)", proxima: "02/09/2026",
    objetivo: "Presentar el plan detallado (paquetes de trabajo, costos, fechas, roles y riesgos) y obtener la autorización del dueño para pasar a la implementación.",
    asistentes: clave,
    temas: ["Revisión de los 12 paquetes de trabajo y sus criterios de aceptación.", `Costo estimado por paquete: ${money(base)} más una reserva de ${money(P.reserva)} (total ${money(autorizadoTotal)}).`,
      "Programa de 16 semanas y fechas importantes.", "Roles y responsabilidades internos y externos.", "Riesgos y plan alterno.", "Proceso de solicitud y autorización de cambios."],
    acuerdos: [
      ["Se autoriza el plan detallado y el paso a la fase de implementación.", "dueno", "19/08/2026"],
      ["Todo cambio de alcance, costo o tiempo se hará con una solicitud de cambio firmada por el dueño.", "dueno", "19/08/2026"],
      ["La reserva de riesgos solo se usará con un cambio autorizado.", "fin", "19/08/2026"],
      ["Mantenimiento validará la lista de señales antes de comprar el hardware.", "mant", "19/08/2026"],
    ],
    pendientes: [
      ["Solicitar 3 cotizaciones de hardware IoT.", "fin", "21/08/2026"],
      ["Solicitar 3 cotizaciones de instalación eléctrica.", "fin", "26/08/2026"],
      ["Solicitar 3 cotizaciones de modelado 3D.", "lider", "21/08/2026"],
      ["Confirmar las ventanas de paro del 31/08 al 10/09.", "prod", "24/08/2026"],
      ["Reservar el espacio en el rack y la IP para el servidor.", "ti", "28/08/2026"],
    ],
    proximaTxt: "02/09/2026, 09:00 h, sala de juntas B: seguimiento quincenal (compras e instalación).",
  }) });

  // =============== 3.1 LISTA DE PAQUETES POR EXTERNOS ===============
  await save(`${D3}/3.1 Lista de paquetes de trabajo por externos.docx`, { titulo: "Lista de paquetes de trabajo a realizar por externos", ...meta("TL3D-3.1", E3), body: [
    p("Control de versiones: Revisión 1 del 20/08/2026 (paquetes PT-03, PT-04 y PT-06). Revisión 2 del 16/09/2026 (se agrega PT-13 por el cambio autorizado CC-01).", { run: { size: 18, italics: true } }),
    p("Paquetes del plan detallado que realizará un externo, con los proveedores considerados y la experiencia que se les pide."),
    ...Object.entries(proveedores).flatMap(([k, v]) => [
      h2(`${k} · ${v.paquete}`),
      table(null, [["Tipo", v.tipo], ["Proveedores considerados", v.lista.map((x) => x.razon)], ["Experiencia requerida", v.exp]], [25, 75], { firstColFill: true, firstColBold: true, size: 18 }),
    ]),
    p("Nota: con el cambio autorizado CC-01 se agregó el paquete PT-13 (2 máquinas AOI), que se asignó a los mismos proveedores ya seleccionados (E1, E2 y E3), bajo las mismas condiciones."),
    spacer(200), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró (Revisión 2)", sig: "lider", fecha: "16/09/2026" }]),
  ] });

  // =============== 3.2 PROVEEDORES CALIFICADOS ===============
  await save(`${D3}/3.2 Lista de proveedores calificados.docx`, { titulo: "Lista de proveedores calificados para el servicio", ...meta("TL3D-3.2", E3), body: [
    p("Hay al menos 3 proveedores calificados por cada paquete de trabajo a subcontratar. Todos cumplen la experiencia requerida en el documento TL3D-3.1."),
    ...Object.entries(proveedores).flatMap(([k, v]) => [
      h2(`${k} · ${v.paquete}`),
      table(["#", "Nombre completo del proveedor (razón social)", "Contacto", "Cotización", "Entrega", "Resultado"],
        v.lista.map((x, i) => [String(i + 1), x.razon, x.contacto, money(x.cot), x.entrega, x.sel ? "Seleccionado" : "Calificado (alterno)"]), [5, 33, 22, 13, 12, 15], { size: 17, right: [3] }),
    ]),
    h2("Criterio de selección"),
    p("Se eligió la cotización más baja que cumple la experiencia requerida y la fecha del plan detallado. El segundo lugar queda como alterno (plan alterno del riesgo R1)."),
    spacer(200), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: "21/08/2026" }, { nombre: N("fin"), rol: "Contralora de Planta", leyenda: "Validó las cotizaciones", sig: "fin", fecha: "21/08/2026" }]),
  ] });

  // =============== 3.3 DESCRIPCIÓN DEL TRABAJO POR PROVEEDOR ===============
  await save(`${D3}/3.3 Descripción del trabajo por proveedor.docx`, { titulo: "Descripción del trabajo a realizar por proveedor", ...meta("TL3D-3.3", E3), body: [
    p("Control de versiones: Revisión 1 del 24/08/2026 (E1, E2 y E3). Revisión 2 del 16/09/2026 (se agrega PT-13 por el cambio autorizado CC-01).", { run: { size: 18, italics: true } }),
    ...Object.entries(trabajoProv).flatMap(([k, t]) => {
      const sel = proveedores[k].lista.find((x) => x.sel);
      return [h1(`${k} · ${proveedores[k].paquete}`),
        table(null, [["Proveedor", `${sel.razon} — contacto: ${sel.contacto}`], ["Descripción del paquete de trabajo", t.alcance], ["Entregables", t.entregables],
          ["Limitante de costo", `Monto máximo de ${money(t.costoMax)} MXN más IVA; no se pagará ningún trabajo adicional sin una solicitud de cambio autorizada. Forma de pago: ${t.pago}.`],
          ["Limitante de tiempo", `Inicio el ${t.ini} y entrega a más tardar el ${t.fin}. Penalización: ${t.pena}.`]],
        [25, 75], { firstColFill: true, firstColBold: true, size: 18 })];
    }),
    h1("PT-13 · Monitoreo de 2 máquinas AOI (agregado por el cambio autorizado CC-01)"),
    table(null, [["Proveedores", "Los mismos proveedores seleccionados: E1 (nodos y sensores), E2 (instalación) y E3 (modelado 3D)"],
      ["Descripción del paquete de trabajo", "E1: suministrar 2 nodos ESP32 con sensores iguales a los de PT-03. E2: instalarlos en las 2 AOI durante el paro programado, con LOTO y sin intervenir el PLC. E3: modelar las 2 AOI y entregarlas integradas al archivo glTF."],
      ["Limitante de costo", "Monto máximo de $12,600.00 MXN más IVA (E1 $5,600.00, E2 $4,200.00, E3 $2,800.00), igual al impacto económico autorizado en CC-01. Se paga en una sola exhibición contra entrega."],
      ["Limitante de tiempo", "Del 19/10/2026 al 23/10/2026; la instalación solo en el paro programado del 19/10/2026 (alterno: 24/10/2026)."]],
    [25, 75], { firstColFill: true, firstColBold: true, size: 18 }),
    spacer(200), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró (Revisión 2)", sig: "lider", fecha: "16/09/2026" }]),
  ] });

  // =============== 3.4 LISTA DE VERIFICACIÓN DE AVANCE ===============
  const grupos = ["Sin iniciar", "En proceso", "Terminado", "Cancelado", "En espera"];
  const tituloGrupo = { "Sin iniciar": "Paquetes de trabajo sin iniciar", "En proceso": "Paquetes de trabajo en proceso", "Terminado": "Paquetes de trabajo terminados", "Cancelado": "Paquetes de trabajo cancelados", "En espera": "Paquetes de trabajo en espera" };
  const avBody = [p(`Fecha de corte: **${corte}**. Elaboró: ${N("lider")}, líder del proyecto.`),
    table(["Estado", "Cantidad"], grupos.map((g) => [g, String(allPT.filter((pt) => estado16[pt.id] === g).length)]), [70, 30], { size: 18 })];
  grupos.forEach((g) => {
    avBody.push(h2(tituloGrupo[g]));
    const rows = allPT.filter((pt) => estado16[pt.id] === g).map((pt) => [pt.id, pt.nombre, `${pt.inicio} – ${pt.fin}`, notas16[pt.id] || "Criterio de aceptación cumplido."]);
    avBody.push(table(["ID", "Paquete de trabajo", "Fechas", "Observación"], rows, [9, 36, 22, 33], { size: 18 }));
  });
  avBody.push(spacer(200), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: corte }]));
  await save(`${D3}/3.4 Lista de verificación de avance.docx`, { titulo: "Lista de verificación de avance del proyecto", ...meta("TL3D-3.4", E3), body: avBody });

  // =============== 3.5 EVIDENCIAS ===============
  const ev = [
    ["PT-01", "Plan básico (TL3D-1.1), plan detallado (TL3D-2.1) y reportes de junta (TL3D-1.2 y TL3D-2.2), firmados.", null],
    ["PT-02", "Anexo A-02: documento de requerimientos e inventario de 12 máquinas, firmado por el dueño.", null],
    ["PT-03", "Anexo A-03: acta de recepción e inspección de material (14 nodos y sensores).", null],
    ["PT-04", "Anexo A-04: acta de entrega-recepción de la instalación en 12 máquinas, con el esquema por máquina.", ["instalacion.png", 6.2, 2.2, "Esquema de instalación por máquina (anexo A-04)."]],
    ["PT-05", "Anexo A-05: reporte de la prueba de transmisión de 48 h, con pérdida promedio de 0.34%.", ["prueba48h.png", 6.2, 2.35, "Prueba de 48 h: todas las máquinas por debajo del 1%."]],
    ["PT-06", "Anexo A-06: acta de aceptación del modelo 3D (11.8 MB, 12 máquinas identificadas, carga en 3.6 s).", null],
    ["PT-07", "Anexo A-07: captura del visor 3D en operación, con colores por estado.", ["visor3d.png", 6.4, 3.47, "Captura del visor 3D TwinLine (Three.js) en la pantalla de la línea."]],
    ["PT-08", "Anexo A-07: captura del tablero de MTTR; tiempo promedio de alerta en Teams de 9 s (anexo A-10).", ["tablero_mttr.png", 6.2, 2.48, "Tablero de indicadores durante el piloto."]],
    ["PT-09", "Cancelado por el cambio autorizado CC-03 (ver TL3D-4.1). No genera evidencia.", null],
    ["PT-10", "Anexo A-10: reporte del piloto con 31 paros, MTTR ponderado de 16.5 min (−17.5%) y 0 incidentes de seguridad.", null],
    ["PT-11", "Anexo A-11: lista de asistencia de 11 personas y evaluación práctica (promedio de 9.1/10).", ["capacitacion.png", 6.2, 2.2, "Calificaciones de la evaluación práctica (mínimo 8/10)."]],
    ["PT-12", "Anexo A-12: acta de cierre de contratos y entrega de manuales, con la guía rápida de usuario; reporte final (TL3D-5.1).", null],
    ["PT-13", "Anexo A-04 (sección AOI) y anexo A-07: las AOI-1 y AOI-2 visibles en el visor 3D.", null],
  ];
  const evBody = [p("Evidencias de todos los paquetes de trabajo contemplados en el plan detallado y de los paquetes agregados por cambios autorizados. Los anexos (documentos, capturas y registros) están en la carpeta **anexos/** del expediente, en .docx y .pdf."),
    table(["Paquete", "Evidencia"], ev.map((e) => [e[0], e[1]]), [12, 88], { size: 18 }), h1("Evidencias gráficas")];
  ev.filter((e) => e[2]).forEach((e) => { evBody.push(h2(`${e[0]} ${allPT.find((x) => x.id === e[0]).nombre}`)); evBody.push(img(`img/${e[2][0]}`, e[2][1], e[2][2])); evBody.push(caption(e[2][3])); });
  evBody.push(h2("Arquitectura del sistema entregado")); evBody.push(img("img/arquitectura.png", 6.3, 2.65)); evBody.push(caption("Arquitectura de TwinLine 3D."));
  evBody.push(spacer(200), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Integró las evidencias", sig: "lider", fecha: "18/11/2026" }]));
  await save(`${D3}/3.5 Evidencias de paquetes terminados.docx`, { titulo: "Evidencias de paquetes de trabajo terminados", ...meta("TL3D-3.5", E3), body: evBody });

  // =============== 4.1 LISTADO DE CAMBIOS AUTORIZADOS ===============
  const cbBody = [p("Tabla de todos los cambios solicitados y autorizados durante el proyecto."),
    table(["No.", "Nombre del cambio", "Impacto económico", "Impacto en tiempo", "Fecha programada", "Solicita"],
      cambios.map((c) => [c.num, c.nombre, money(c.costo), c.tiempo, c.prog, N(c.solicita)]), [8, 20, 13, 27, 13, 19], { size: 17 }),
    p(`Impacto económico neto de los cambios: ${money(netCambios)}. Costo vigente del proyecto: ${money(base)} + ${money(netCambios)} = **${money(vigente)}**, cubierto dentro del costo autorizado de ${money(autorizadoTotal)} (se usaron ${money(netCambios)} de la reserva de riesgos).`, { run: { size: 19 } }),
  ];
  cambios.forEach((c) => {
    cbBody.push(h2(`${c.num} · ${c.nombre}`));
    cbBody.push(table(null, [["No. consecutivo de la solicitud", c.num], ["Fecha de la solicitud", c.fechaSol], ["Descripción del cambio", c.desc], ["Impacto económico", money(c.costo) + " MXN"], ["Impacto en tiempo", c.tiempo],
      ["Fecha de programación", c.prog], ["Solicita", NR(c.solicita)], ["Autoriza", NR(c.autoriza)]], [28, 72], { firstColFill: true, firstColBold: true, size: 18 }));
    cbBody.push(spacer(80), firmas([{ nombre: N(c.autoriza), rol: "Dueño del proyecto", leyenda: `Autorizo el cambio ${c.num}`, sig: c.autoriza, fecha: c.fechaAut }]));
  });
  await save(`${D4}/4.1 Listado de cambios autorizados.docx`, { titulo: "Listado de cambios autorizados", ...meta("TL3D-4.1", E4), body: cbBody });

  // =============== 4.2 REPORTE DE ESTADO ACTUAL ===============
  const comprometido = allPT.filter((pt) => ["Terminado", "En proceso", "En espera"].includes(estado16[pt.id])).reduce((a, pt) => a + costFinal(pt), 0);
  const pagado = Object.values(pagos16).reduce((a, b) => a + b, 0);
  await save(`${D4}/4.2 Reporte de estado actual del proyecto.docx`, { titulo: "Reporte de estado actual del proyecto", ...meta("TL3D-4.2", E4), body: [
    kv([["Fecha de corte", corte], ["Elaboró", `${N("lider")} — Líder del proyecto`], ["Semana del proyecto", "11 de 16"],
      ["Estado actual del proyecto", "EN TIEMPO. Avance real de 68% contra 66% planeado (avance medido por valor ganado: costo de los paquetes terminados y la parte avanzada de los paquetes en proceso, entre el costo vigente). La fecha de término (20/11/2026) se mantiene."]]),
    h1("Estado de los paquetes de trabajo"),
    table(["Paquete", "Estado", "Observación"], allPT.map((pt) => [`${pt.id} ${pt.nombre}`, estado16[pt.id], notas16[pt.id] || "En tiempo; criterio cumplido."]), [45, 15, 40], { size: 17 }),
    h1("Estado de cuenta del costo del proyecto"),
    table(["Concepto", "Monto (MXN)"], [
      ["Costo autorizado (12 paquetes)", money(base)], ["Reserva de riesgos autorizada", money(P.reserva)],
      ["Cambios autorizados (CC-01 +$12,600.00; CC-02 +$2,800.00; CC-03 −$14,000.00)", money(netCambios)],
      ["Costo vigente (autorizado + cambios)", money(vigente)],
      ["Costo actual comprometido (paquetes terminados, en proceso y en espera, con órdenes de compra)", money(comprometido)],
      ["Costo pagado al corte", money(pagado)],
      ["Comprometido pendiente de pago (finiquito E3 $12,000 programado para el 23/10; PT-08 y PT-13 al terminar)", money(comprometido - pagado)],
      ["Por comprometer (PT-10, PT-11 y PT-12)", money(vigente - comprometido)],
    ], [75, 25], { size: 18, right: [1], totalRows: [3] }),
    h1("Prioridades del periodo (19/10 – 30/10/2026)"),
    table(["#", "Prioridad", "Plan de acción", "Responsable", "Fecha compromiso"], [
      ["1", "Terminar las alertas por Teams (CC-02)", "Integrar el webhook de Teams, hacer pruebas con 3 técnicos y medir el tiempo de alerta", N("lider"), "27/10/2026"],
      ["2", "Instalar y modelar las 2 AOI (CC-01)", "Instalar en el paro del 19/10, recibir el modelo de E3 e integrarlo al visor", N("mant"), "23/10/2026"],
      ["3", "Preparar las pruebas integrales", "Escribir el plan de pruebas y revisarlo con TI", N("lider"), "27/10/2026"],
      ["4", "Pagar el finiquito del proveedor E3", "Liberar el pago contra la aceptación del modelo", N("fin"), "23/10/2026"],
    ], [5, 23, 37, 20, 15], { size: 17 }),
    h1("Riesgos del proyecto"),
    table(["Riesgo", "Plan de acción", "Responsable", "Fecha compromiso"], [
      ["R4 Falsas alertas durante el piloto", "Calibrar los umbrales con datos reales de las 2 primeras semanas de octubre", N("mant"), "30/10/2026"],
      ["R5 Los técnicos no adoptan la herramienta", "Demostración previa con 3 técnicos clave e inscripción a la capacitación", N("mant"), "30/10/2026"],
      ["R6 Vulnerabilidad de ciberseguridad", "Hacer un escaneo de puertos y una revisión de la VLAN con TI antes del piloto", N("ti"), "30/10/2026"],
      ["R2 Que no haya paro para instalar las AOI", "Confirmar el paro del 19/10; si se cancela, usar el paro del 24/10", N("prod"), "17/10/2026"],
    ], [27, 39, 20, 14], { size: 17 }),
    spacer(200), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: corte }, { nombre: N("dueno"), rol: "Dueño del proyecto", leyenda: "Recibió", sig: "dueno", fecha: corte }]),
  ] });

  // =============== 4.3 VERIFICACIÓN DE PAQUETES TERMINADOS ===============
  await save(`${D4}/4.3 Verificación de paquetes terminados.docx`, { titulo: "Documento de verificación de paquetes terminados", ...meta("TL3D-4.3", E4), body: [
    p("Fecha de verificación: **18/11/2026**. Se comparó cada paquete de trabajo con su criterio de aceptación del plan detallado (TL3D-2.1) y con su evidencia (TL3D-3.5)."),
    table(["Paquete", "Criterio de aceptación", "Resultado de la verificación", "Cumple"], allPT.map((pt) => [`${pt.id} ${pt.nombre}`, pt.criterio,
      pt.id === "PT-09" ? "Cancelado por el cambio autorizado CC-03; no aplica." : ({ "PT-05": "Pérdida promedio de 0.34%.", "PT-06": "11.8 MB; carga en 3.6 s.", "PT-07": "Actualización cada 2 s.", "PT-08": "Alerta en 9 s promedio (máximo 21 s).", "PT-10": "MTTR de 16.5 min; 0 incidentes.", "PT-11": "11 personas; promedio de 9.1/10; mínima de 8.0." }[pt.id] || "Evidencia revisada y conforme."),
      pt.id === "PT-09" ? "N/A" : "Sí"]), [22, 36, 30, 12], { size: 17 }),
    spacer(300), firmas([{ nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Acepto y valido la verificación del trabajo", sig: "lider", fecha: "18/11/2026" }]),
  ] });

  // =============== 5.1 REPORTE FINAL ===============
  const archivos = [
    ["1. Inicio/1.1 Plan Básico (.docx / .pdf)", "TL3D-1.1"], ["1. Inicio/1.2 Minuta Junta de Inicio", "TL3D-1.2"],
    ["2. Organizacion/2.1 Plan Detallado", "TL3D-2.1"], ["2. Organizacion/2.2 Minuta de presentación del plan detallado", "TL3D-2.2"],
    ["3. Implementacion/3.1 Lista de paquetes de trabajo por externos", "TL3D-3.1"], ["3. Implementacion/3.2 Lista de proveedores calificados", "TL3D-3.2"],
    ["3. Implementacion/3.3 Descripción del trabajo por proveedor", "TL3D-3.3"], ["3. Implementacion/3.4 Lista de verificación de avance", "TL3D-3.4"],
    ["3. Implementacion/3.5 Evidencias de paquetes terminados", "TL3D-3.5"], ["4. Verificacion/4.1 Listado de cambios autorizados", "TL3D-4.1"],
    ["4. Verificacion/4.2 Reporte de estado actual del proyecto", "TL3D-4.2"], ["4. Verificacion/4.3 Verificación de paquetes terminados", "TL3D-4.3"],
    ["5. Finalizacion/5.1 Reporte final del proyecto", "TL3D-5.1"], ["5. Finalizacion/5.2 Minuta junta de cierre", "TL3D-5.2"],
    ["anexos/A-02 Requerimientos e inventario de máquinas", "A-02"], ["anexos/A-03 Acta de recepción de material", "A-03"], ["anexos/A-04 Acta de entrega de la instalación", "A-04"], ["anexos/A-05 Reporte de prueba de 48 h", "A-05"], ["anexos/A-06 Acta de aceptación del modelo 3D", "A-06"], ["anexos/A-07 Capturas del visor y del tablero", "A-07"], ["anexos/A-10 Reporte del piloto", "A-10"], ["anexos/A-11 Registro de capacitación", "A-11"], ["anexos/A-12 Cierre de contratos y entrega de manuales", "A-12"], ["evidencias/img/ (capturas y gráficas)", "Imágenes"],
    ["viewer/ (código fuente del visor 3D de referencia)", "Código"],
  ];
  await save(`${D5}/5.1 Reporte final del proyecto.docx`, { titulo: "Reporte final del proyecto", ...meta("TL3D-5.1", E5), body: [
    kv([["Proyecto", P.nombre], ["Fecha", "20/11/2026"], ["Elaboró", `${N("lider")} — Líder del proyecto`],
      ["Estado final", "TERMINADO en la fecha planeada (20/11/2026). Todos los paquetes y actividades terminados; PT-09 cancelado por un cambio autorizado (CC-03)."],
      ["Resultado del objetivo", "MTTR de 20.0 → 16.5 min (−17.5%). Meta de −15% cumplida."]]),
    h1("1. Estado de los paquetes de trabajo y actividades"),
    table(["Paquete", "Planeado", "Real", "Estado"], allPT.map((pt) => [`${pt.id} ${pt.nombre}`, pt.id === "PT-13" ? "No planeado (CC-01)" : `${pt.inicio} – ${pt.fin}`,
      pt.id === "PT-09" ? "—" : pt.id === "PT-08" ? "12/10/2026 – 27/10/2026" : `${pt.inicio} – ${pt.fin}`,
      pt.id === "PT-09" ? "Cancelado (CC-03)" : `Terminado (${pt.acts.length}/${pt.acts.length} actividades)`]), [43, 20, 20, 17], { size: 17 }),
    img("img/gantt.png", 6.3, 2.9), caption("Programa final: planeado contra real."),
    h1("2. Estado de cuenta del costo del proyecto (sin pagos pendientes)"),
    table(["Paquete / proveedor", "Costo final", "Pagado", "Pendiente"], [
      ...allPT.filter((pt) => pt.id !== "PT-09").map((pt) => [`${pt.id} ${pt.nombre}`, money(costFinal(pt)), money(costFinal(pt)), money(0)]),
      ["PT-09 (cancelado, sin costo)", money(0), money(0), money(0)],
      ["TOTAL", money(totalFinal), money(totalFinal), money(0)],
    ], [46, 18, 18, 18], { size: 17, right: [1, 2, 3], totalRows: [allPT.length] }),
    p(`Costo autorizado: ${money(autorizadoTotal)} · Costo final: ${money(totalFinal)} · Ahorro contra lo autorizado: ${money(autorizadoTotal - totalFinal)}. Contratos cerrados: E1 (garantía vigente al 28/08/2027), E2 y E3, según el acta de cierre del 19/11/2026 (anexo A-12).`, { run: { size: 19 } }),
    h1("3. Reporte de aprendizajes"),
    h2("Qué volvería a hacer igual"),
    ...["Usar sensores no invasivos: evitó tocar el PLC y la garantía del fabricante, y la instalación se hizo en 2 semanas.",
      "Pedir 3 cotizaciones con fecha de entrega: el proveedor alterno estaba listo para el riesgo R1.",
      "Usar una reserva de riesgos del 5%: absorbió el cambio CC-01 sin mover la fecha final.",
      "Hacer la prueba de 48 h antes del visor: se detectó a tiempo la interferencia Wi-Fi en dos máquinas."].map(bullet),
    h2("Qué haría diferente"),
    ...["Hacer el inventario de máquinas recorriendo la línea con Producción: las 2 AOI quedaron fuera y generaron el cambio CC-01.",
      "Confirmar las políticas de TI (canal de alertas) antes de desarrollar: se evitaría el cambio CC-02.",
      "Validar desde el inicio la disponibilidad del ERP con el corporativo: PT-09 se planeó y después se canceló."].map(bullet),
    h1("4. Archivos generados durante el proyecto"),
    table(["Archivo", "Código"], archivos, [80, 20], { size: 17 }),
    spacer(300),
    firmas([{ nombre: N("dueno"), rol: "Dueño del proyecto", leyenda: "Acepto el reporte final y el cierre del proyecto", sig: "dueno", fecha: "20/11/2026" }, { nombre: N("lider"), rol: "Líder del proyecto", leyenda: "Elaboró", sig: "lider", fecha: "20/11/2026" }]),
  ] });

  // =============== 5.2 MINUTA CIERRE ===============
  await save(`${D5}/5.2 Minuta junta de cierre.docx`, { titulo: "Reporte de la junta de cierre del proyecto", ...meta("TL3D-5.2", E5), body: minuta({
    lugar: "Sala de juntas B, planta EIP", fecha: "20/11/2026", horario: "09:00 – 10:30 h (90 minutos)", proxima: "No aplica (proyecto cerrado)",
    objetivo: "Presentar los resultados finales, entregar el sistema y la documentación, y cerrar formalmente el proyecto TwinLine 3D.",
    asistentes: clave,
    temas: ["Resultado del objetivo: MTTR de 20.0 a 16.5 min (−17.5%).", `Estado de cuenta final: ${money(totalFinal)} pagados, sin pagos pendientes.`,
      "Entrega de los manuales técnico y de usuario.", "Cierre de los contratos con los proveedores E1, E2 y E3.", "Aprendizajes del equipo.", "Propuestas de proyectos futuros (líneas SMT-1 y SMT-3, integración con ERP en 2027)."],
    acuerdos: [
      ["Se acepta el producto y se da por cerrado el proyecto.", "dueno", "20/11/2026"],
      ["Mantenimiento será el dueño operativo del sistema a partir del 23/11/2026.", "mant", "20/11/2026"],
      ["TI incluirá el servidor en su respaldo semanal.", "ti", "20/11/2026"],
      ["Se evaluará extender el sistema a las líneas SMT-1 y SMT-3 en el presupuesto de 2027.", "dueno", "20/11/2026"],
    ],
    aprendizajes: [
      `${N("mant")}: ver la máquina en rojo en el 3D ahorra el tiempo de buscarla por radio.`,
      `${N("prod")}: el inventario de máquinas se debe hacer en piso y no con el layout en papel (caso de las AOI).`,
      `${N("ti")}: involucrar a TI desde la selección del canal de alertas evita retrabajo (CC-02).`,
      `${N("fin")}: las 3 cotizaciones con fecha de entrega facilitaron las compras y los pagos.`,
      `${N("lider")}: validar los totales del presupuesto y fijar la fecha de término desde el plan básico evitó errores en la documentación.`,
    ],
    pendientes: [["Enviar la propuesta para las líneas SMT-1 y SMT-3.", "lider", "15/01/2027"]],
    proximaTxt: "No hay próxima reunión del proyecto: queda cerrado. La propuesta de extensión se revisará en una junta nueva cuando se apruebe el presupuesto de 2027.",
  }) });

  console.log({ base, autorizadoTotal, netCambios, vigente, totalFinal, comprometido, pagado });
}
main().catch((e) => { console.error(e); process.exit(1); });
