// Fuente única de datos del proyecto TwinLine 3D (todo ficticio, con fines de certificación EC0935)
const P = {
  nombre: "TwinLine 3D — Gemelo digital de la Línea SMT-2",
  corto: "TwinLine 3D",
  empresa: "Electrónica Integrada del Pacífico, S.A. de C.V. (EIP)",
  empresaCorta: "EIP",
  ubicacion: "Parque Industrial El Florido, Tijuana, B.C.",
  inicio: "03/08/2026",
  fin: "20/11/2026",
  duracion: "16 semanas (03/08/2026 – 20/11/2026), 78 días hábiles sin contar los días feriados 16/09/2026 y 16/11/2026",
  tarifaLider: 350,
  reserva: 11100,
};

const people = {
  dueno:   { nombre: "Ricardo Alberto Méndez Salazar", puesto: "Gerente de Planta", rol: "Dueño del proyecto", tipo: "Interno" },
  lider:   { nombre: "Jesús Roberto Aragón López", puesto: "Ingeniero de proyecto (Entornos Virtuales y Negocios Digitales)", rol: "Líder del proyecto", tipo: "Interno" },
  mant:    { nombre: "Mario Alejandro Castillo Ruiz", puesto: "Jefe de Mantenimiento", rol: "Participante clave — usuario principal de alertas", tipo: "Interno" },
  prod:    { nombre: "Laura Patricia Ibarra Gómez", puesto: "Supervisora de Producción, Línea SMT-2", rol: "Participante clave — usuaria del tablero", tipo: "Interno" },
  ti:      { nombre: "Fernando Daniel Ochoa Valenzuela", puesto: "Coordinador de Tecnologías de la Información", rol: "Participante clave — red y seguridad", tipo: "Interno" },
  fin:     { nombre: "Ana Sofía Villaseñor Tapia", puesto: "Contralora de Planta", rol: "Participante clave — compras y pagos", tipo: "Interno" },
};
const clave = ["dueno", "lider", "mant", "prod", "ti", "fin"];

// Paquetes de trabajo (plan original). ext = clave del paquete externo
const paquetes = [
  { id: "PT-01", nombre: "Gestión del inicio y la planeación", inicio: "03/08/2026", fin: "19/08/2026", resp: "lider",
    acts: ["Elaborar el plan básico y obtener la firma del dueño (03/08 – 04/08)", "Realizar la junta de inicio y su reporte (05/08)", "Elaborar el plan detallado (10/08 – 18/08)", "Realizar la junta de presentación del plan y su reporte (19/08)"],
    criterio: "Plan básico y plan detallado firmados por el dueño; reportes de junta firmados por todos los asistentes.",
    costo: [["Horas del líder: 28 h × $350", 9800]] },
  { id: "PT-02", nombre: "Levantamiento de requerimientos e inventario de máquinas", inicio: "06/08/2026", fin: "14/08/2026", resp: "lider",
    acts: ["Entrevistar a Mantenimiento, Producción y TI (06/08 – 07/08)", "Inventariar las 12 máquinas y las señales a monitorear (10/08 – 12/08)", "Redactar el documento de requerimientos y obtener la firma del dueño (13/08 – 14/08)"],
    criterio: "Documento de requerimientos con inventario de 12 máquinas y señales (marcha, paro, falla), firmado por el dueño.",
    costo: [["Horas del líder: 24 h × $350", 8400]] },
  { id: "PT-03", nombre: "Suministro de hardware IoT", inicio: "20/08/2026", fin: "28/08/2026", resp: "fin", ext: "E1",
    acts: ["Solicitar 3 cotizaciones y elegir proveedor (20/08 – 21/08)", "Emitir orden de compra de 14 nodos (12 + 2 de repuesto) (24/08)", "Recibir e inspeccionar el material (27/08 – 28/08)"],
    criterio: "14 nodos ESP32 industriales con sensor de corriente, sensor de vibración y lector de torreta recibidos sin defectos, con factura.",
    costo: [["14 nodos ESP32 industriales con gabinete IP54", 21000], ["14 sensores de corriente no invasivos", 7000], ["14 sensores de vibración", 6300], ["Cableado y accesorios", 4300]] },
  { id: "PT-04", nombre: "Instalación eléctrica de sensores", inicio: "31/08/2026", fin: "11/09/2026", resp: "mant", ext: "E2",
    acts: ["Instalar nodos y sensores en paros programados (31/08 – 10/09)", "Etiquetar cada nodo con el ID de su máquina (10/09)", "Entregar el certificado de instalación (11/09)"],
    criterio: "12 máquinas con sensores instalados sin abrir el PLC; certificado de instalación firmado por el contratista y por el Jefe de Mantenimiento.",
    costo: [["Servicio de contratista eléctrico (mano de obra y materiales menores)", 27500]] },
  { id: "PT-05", nombre: "Red IoT y servidor local", inicio: "07/09/2026", fin: "18/09/2026", resp: "ti",
    acts: ["Configurar la VLAN IoT aislada (07/09 – 08/09)", "Instalar el servidor local y el broker MQTT (09/09 – 11/09)", "Realizar una prueba de transmisión de 48 h (14/09 – 18/09)"],
    criterio: "12 máquinas transmitiendo al broker MQTT con pérdida de mensajes menor a 1% en 48 h de prueba.",
    costo: [["Mini servidor industrial", 14900], ["Switch administrable y punto de acceso", 3500], ["Horas del líder: 10 h × $350", 3500]] },
  { id: "PT-06", nombre: "Modelo 3D de la línea", inicio: "20/08/2026", fin: "25/09/2026", resp: "lider", ext: "E3",
    acts: ["Tomar medidas y fotografías de la línea (20/08 – 26/08)", "Modelar en 3D las 12 máquinas y la nave (proveedor externo) (27/08 – 18/09)", "Optimizar y exportar a glTF (21/09 – 25/09)"],
    criterio: "Modelo glTF de menos de 15 MB con 12 máquinas identificadas por ID, que carga en menos de 5 s en la tablet de planta.",
    costo: [["Servicio de modelado 3D externo", 24000], ["Horas del líder: 20 h × $350", 7000]] },
  { id: "PT-07", nombre: "Plataforma web y visor 3D", inicio: "21/09/2026", fin: "09/10/2026", resp: "lider",
    acts: ["Desarrollar la API y la base de datos de eventos (21/09 – 02/10)", "Desarrollar el visor 3D web (Three.js) con colores por estado (28/09 – 07/10)", "Hacer pruebas en la tablet y en la pantalla de la línea (08/10 – 09/10)"],
    criterio: "Sitio en el servidor local que muestra el estado de las 12 máquinas en 3D (verde: marcha, amarillo: paro, rojo: falla) con una actualización de 5 s o menos.",
    costo: [["Horas del líder: 80 h × $350", 28000]] },
  { id: "PT-08", nombre: "Alertas y tablero de indicadores", inicio: "12/10/2026", fin: "23/10/2026", resp: "lider",
    acts: ["Enviar alertas de paro al celular del técnico (12/10 – 16/10)", "Desarrollar el tablero de MTTR y el reporte semanal (19/10 – 23/10)"],
    criterio: "Alerta recibida en 30 s o menos desde el paro; tablero con MTTR diario y un reporte semanal automático.",
    costo: [["Horas del líder: 44 h × $350", 15400]] },
  { id: "PT-09", nombre: "Integración con ERP (órdenes de trabajo automáticas)", inicio: "19/10/2026", fin: "23/10/2026", resp: "ti",
    acts: ["Mapear la API del ERP (19/10)", "Crear automáticamente una orden de trabajo por cada falla (20/10 – 23/10)"],
    criterio: "Cada falla genera una orden de trabajo en el ERP sin captura manual.",
    costo: [["Horas del líder: 40 h × $350", 14000]] },
  { id: "PT-10", nombre: "Pruebas integrales y piloto", inicio: "28/10/2026", fin: "13/11/2026", resp: "lider",
    acts: ["Hacer pruebas de integración y de seguridad con TI (28/10 – 30/10)", "Operar el piloto real durante 2 semanas midiendo el MTTR (02/11 – 13/11)"],
    criterio: "Reporte del piloto con MTTR medido contra la línea base (20 min) y 0 incidentes de seguridad.",
    costo: [["Horas del líder: 36 h × $350", 12600]] },
  { id: "PT-11", nombre: "Capacitación", inicio: "09/11/2026", fin: "11/11/2026", resp: "mant",
    acts: ["Preparar el material y la práctica (09/11)", "Capacitar a 8 técnicos y 3 supervisores (10/11 – 11/11)"],
    criterio: "Lista de asistencia de 11 personas y evaluación práctica con calificación de 8/10 o más.",
    costo: [["Horas del líder: 12 h × $350", 4200], ["Material impreso y tarjetas de consulta rápida", 2100]] },
  { id: "PT-12", nombre: "Documentación y cierre", inicio: "17/11/2026", fin: "20/11/2026", resp: "lider",
    acts: ["Redactar el manual técnico y el de usuario (17/11 – 18/11)", "Cerrar los contratos con los proveedores (17/11 – 19/11)", "Elaborar el reporte final y realizar la junta de cierre (19/11 – 20/11)"],
    criterio: "Manuales entregados, contratos finiquitados y reporte final firmado por el dueño.",
    costo: [["Horas del líder: 24 h × $350", 8400]] },
];

// Paquete agregado por cambio autorizado
const ptAOI = { id: "PT-13", nombre: "Monitoreo de 2 máquinas AOI (agregado por CC-01)", inicio: "19/10/2026", fin: "23/10/2026", resp: "mant", ext: "E1,E2,E3",
  acts: ["Instalar 2 nodos en las máquinas AOI durante un paro programado (19/10 – 20/10)", "Modelar en 3D las 2 AOI e integrarlas al visor (21/10 – 23/10)"],
  criterio: "Las 2 AOI aparecen en el visor 3D con su estado en tiempo real y envían alertas.",
  costo: [["2 nodos y sensores (proveedor E1)", 5600], ["Instalación (proveedor E2)", 4200], ["Modelado 3D de 2 máquinas (proveedor E3)", 2800]] };

const cambios = [
  { num: "CC-01", nombre: "Agregar 2 máquinas AOI al monitoreo", fechaSol: "15/09/2026", fechaAut: "16/09/2026", solicita: "prod", autoriza: "dueno",
    desc: "Incluir las 2 máquinas de inspección óptica automática (AOI) de la Línea SMT-2, que no estaban en el inventario original. Con esto el sistema pasa de 12 a 14 máquinas. Se crea el paquete PT-13.",
    costo: 12600, tiempo: "+5 días hábiles en paralelo dentro de la holgura (19/10 – 23/10); no cambia la fecha de término.", prog: "19/10/2026" },
  { num: "CC-02", nombre: "Cambiar el canal de alertas a Microsoft Teams", fechaSol: "05/10/2026", fechaAut: "06/10/2026", solicita: "ti", autoriza: "dueno",
    desc: "Por política de TI, las alertas se envían por Microsoft Teams corporativo en lugar de Telegram. Esto requiere 8 h más de desarrollo en PT-08.",
    costo: 2800, tiempo: "+2 días hábiles en PT-08 (término 27/10/2026); no cambia la fecha de término del proyecto.", prog: "12/10/2026" },
  { num: "CC-03", nombre: "Cancelar la integración con ERP", fechaSol: "08/10/2026", fechaAut: "08/10/2026", solicita: "dueno", autoriza: "dueno",
    desc: "El corporativo migrará su ERP en 2027 y congeló sus integraciones. Se cancela el paquete PT-09 y se reprograma como un proyecto futuro.",
    costo: -14000, tiempo: "−5 días hábiles de trabajo del líder; no cambia la fecha de término.", prog: "08/10/2026" },
];

const riesgos = [
  { r: "Retraso en la entrega del hardware IoT por importación.", plan: "Pedir con 5 días de holgura y, si el proveedor elegido no surte, comprar al segundo lugar de la lista de proveedores, que tiene inventario local.", resp: "fin" },
  { r: "Producción no da paros para instalar los sensores.", plan: "Instalar en los paros programados de fin de semana acordados con la Supervisora de Producción desde la junta de inicio.", resp: "prod" },
  { r: "Interferencia Wi-Fi en la nave que provoca pérdida de datos.", plan: "Usar nodos con antena externa y conexión Ethernet en las máquinas críticas; validar con la prueba de 48 h.", resp: "ti" },
  { r: "Falsas alertas que hacen que los técnicos ignoren el sistema.", plan: "Calibrar los umbrales durante la primera semana del piloto con el Jefe de Mantenimiento.", resp: "mant" },
  { r: "Los técnicos no adoptan la herramienta.", plan: "Involucrarlos en el levantamiento de requerimientos y dar una capacitación práctica con evaluación.", resp: "mant" },
  { r: "Vulnerabilidad de ciberseguridad en la red de planta.", plan: "Usar una VLAN aislada, sin acceso desde internet, y hacer una revisión de seguridad con TI antes del piloto.", resp: "ti" },
];

const proveedores = {
  E1: { paquete: "PT-03 Suministro de hardware IoT", tipo: "Compra de producto",
    exp: "Distribuidor de electrónica industrial con al menos 3 años de experiencia, inventario en Baja California o entrega en 5 días hábiles, facturación en México y garantía de 12 meses.",
    lista: [
      { razon: "Automatización y Control del Noroeste, S.A. de C.V.", contacto: "Ing. Héctor Manuel Ruiz Ortega", cot: 38600, entrega: "5 días hábiles", sel: true },
      { razon: "Componentes Electrónicos Frontera, S. de R.L. de C.V.", contacto: "Lic. Brenda Yolanda Salcido Pérez", cot: 41200, entrega: "3 días hábiles" },
      { razon: "Industrial IoT Supply Baja, S.A. de C.V.", contacto: "Ing. Óscar Iván Montaño Félix", cot: 44900, entrega: "8 días hábiles" },
    ] },
  E2: { paquete: "PT-04 Instalación eléctrica de sensores", tipo: "Contratación de servicio",
    exp: "Contratista eléctrico industrial con al menos 5 años de experiencia en maquiladoras, personal con DC-3 en NOM-029-STPS (mantenimiento eléctrico), seguro de responsabilidad civil y experiencia en bloqueo y etiquetado (LOTO).",
    lista: [
      { razon: "Instalaciones Eléctricas Industriales Otay, S.A. de C.V.", contacto: "Ing. Rogelio Andrés Navarro Lugo", cot: 27500, entrega: "10 días hábiles", sel: true },
      { razon: "Servicios Electromecánicos del Pacífico, S.A. de C.V.", contacto: "Ing. Karla Verónica Quintero Soto", cot: 29800, entrega: "9 días hábiles" },
      { razon: "Grupo Técnico de Mantenimiento Industrial Tijuana, S.A. de C.V.", contacto: "Ing. Javier Eduardo Lizárraga Beltrán", cot: 31000, entrega: "12 días hábiles" },
    ] },
  E3: { paquete: "PT-06 Modelo 3D de la línea (modelado)", tipo: "Contratación de servicio",
    exp: "Modelador 3D con un portafolio de al menos 3 proyectos industriales o de arquitectura, dominio de Blender y del formato glTF, y experiencia en optimizar modelos para la web (menos de 15 MB).",
    lista: [
      { razon: "Daniela Fernanda Ortiz Medina (Estudio Polígono 3D, persona física con actividad empresarial)", contacto: "Daniela Fernanda Ortiz Medina", cot: 24000, entrega: "15 días hábiles", sel: true },
      { razon: "Render Norte Visualización, S.C.", contacto: "Arq. Luis Gerardo Valdez Corona", cot: 27000, entrega: "12 días hábiles" },
      { razon: "Modelado Industrial Digital MX, S.A.S.", contacto: "Ing. Paola Alejandra Cervantes Ríos", cot: 29500, entrega: "18 días hábiles" },
    ] },
};

const trabajoProv = {
  E1: { alcance: "Suministrar 14 nodos ESP32 industriales con gabinete IP54, 14 sensores de corriente no invasivos, 14 sensores de vibración, cableado y accesorios, según la especificación del documento de requerimientos (PT-02). Incluye garantía de 12 meses y fichas técnicas.",
    entregables: ["Material completo entregado en el almacén de EIP", "Factura y fichas técnicas", "Carta de garantía"],
    costoMax: 38600, pago: "100% a 15 días después de la recepción conforme", ini: "24/08/2026", fin: "28/08/2026", pena: "1% del monto por cada día hábil de retraso" },
  E2: { alcance: "Instalar los nodos y sensores en las 12 máquinas de la Línea SMT-2 sin intervenir el PLC ni el cableado de control. Se trabaja solo en los paros programados, con procedimiento LOTO, y cada nodo se etiqueta con el ID de su máquina.",
    entregables: ["12 máquinas instaladas y probadas", "Etiquetado por máquina", "Certificado de instalación y diagrama unifilar"],
    costoMax: 27500, pago: "40% de anticipo y 60% contra el certificado de instalación", ini: "31/08/2026", fin: "11/09/2026", pena: "1% del monto por cada día hábil de retraso; ningún trabajo fuera de las ventanas de paro autorizadas" },
  E3: { alcance: "Modelar en 3D la nave de la Línea SMT-2 y sus 12 máquinas, con base en las medidas y fotografías del líder, con un objeto separado por máquina nombrado con su ID y exportado a glTF optimizado.",
    entregables: ["Archivo .blend fuente", "Archivo .glb de menos de 15 MB", "Tabla de IDs de objetos por máquina"],
    costoMax: 24000, pago: "50% de anticipo y 50% contra la aceptación del modelo", ini: "27/08/2026", fin: "18/09/2026", pena: "Hasta 2 rondas de correcciones incluidas; 1% del monto por cada día hábil de retraso" },
};

// Estado al 16/10/2026 (reporte de estado y lista de avance)
const corte = "16/10/2026";
const estado16 = { "PT-01": "Terminado", "PT-02": "Terminado", "PT-03": "Terminado", "PT-04": "Terminado", "PT-05": "Terminado", "PT-06": "Terminado", "PT-07": "Terminado",
  "PT-08": "En proceso", "PT-09": "Cancelado", "PT-10": "Sin iniciar", "PT-11": "Sin iniciar", "PT-12": "Sin iniciar", "PT-13": "En espera" };
const notas16 = { "PT-08": "Avance 40%. Alertas por Teams en desarrollo (CC-02).", "PT-09": "Cancelado por CC-03 (08/10/2026).", "PT-13": "Espera el paro programado del 19/10/2026 para instalar los nodos en las AOI (CC-01).",
  "PT-10": "Inicia el 28/10/2026.", "PT-11": "Inicia el 09/11/2026.", "PT-12": "Inicia el 17/11/2026." };

// Pagos (para estados de cuenta)
const pagos16 = { // pagado al corte
  "PT-01": 9800, "PT-02": 8400, "PT-03": 38600, "PT-04": 27500, "PT-05": 21900, "PT-06": 19000, "PT-07": 28000, "PT-08": 0, "PT-13": 0 };
// PT-06: anticipo 50% modelado (12,000) + horas líder 7,000 = 19,000; finiquito 12,000 pendiente hasta aceptar AOI

module.exports = { P, people, clave, paquetes, ptAOI, cambios, riesgos, proveedores, trabajoProv, corte, estado16, notas16, pagos16 };
