# Matriz de cumplimiento EC0935 — TwinLine 3D

Cada criterio de evaluación del Estándar de Competencia **EC0935 Gestión de trabajo por proyectos** (CONOCER, DOF 04/10/2017) relacionado con el documento y la sección donde se cumple.

## Elemento 1 · E2922 Iniciar el proyecto

### Producto 1 — Plan básico (`1. Inicio/1.1 Plan Básico`)
| Criterio | Dónde se cumple |
|---|---|
| Nombre del proyecto | Tabla inicial |
| Nombre completo del dueño | Tabla inicial · Participantes clave |
| Nombre completo del líder | Tabla inicial · Participantes clave |
| Nombre completo de los participantes clave | Participantes clave (6 personas) |
| Expectativas realistas, medibles y con tiempos | Expectativas de los participantes clave (cada una con métrica y fecha) |
| Objetivo SMART | Objetivo del proyecto + tabla S-M-A-R-T |
| Descripción del proyecto (todo el trabajo) | Descripción del proyecto (9 bloques de trabajo) |
| Descripción del producto | Descripción del producto que se obtendrá |
| Supuestos | Supuestos del proyecto |
| Limitantes | Limitantes del proyecto (costo, tiempo, alcance, calidad, seguridad) |
| Fechas importantes | Fechas importantes (inicio 03/08/2026 y término 20/11/2026) |
| Información histórica y lecciones aprendidas | Información histórica + Lecciones aprendidas de proyectos similares |
| Firma del dueño | Bloque de firmas |

### Producto 2 — Reporte de la junta de inicio (`1. Inicio/1.2 Minuta Junta de Inicio`)
| Criterio | Dónde se cumple |
|---|---|
| Nombre completo de los asistentes | Asistentes |
| Fecha de la junta | Tabla inicial |
| Nombre completo de quien preparó el reporte | "Elaboró el reporte" + firma |
| Temas tratados | Temas tratados |
| Acuerdos | Acuerdos |
| Pendientes con responsable y fecha compromiso | Tareas pendientes |
| Fecha de la próxima reunión | Tabla inicial · Próxima reunión |
| Firma / confirmación de los asistentes | Columna "Firma de confirmación" |

## Elemento 2 · E2923 Organizar el proyecto

### Producto 1 — Plan detallado (`2. Organizacion/2.1 Plan Detallado`)
| Criterio | Dónde se cumple |
|---|---|
| Paquetes de trabajo con criterio de aceptación | Sección 1 (PT-01 a PT-12) |
| Actividades de cada paquete | Sección 1, fila "Actividades" (numeradas) |
| Costo estimado desglosado por paquete | Sección 2 (los totales se validan con código) |
| Tiempo en que se llevará a cabo | Sección 3 (16 semanas, 78 días hábiles) |
| Fechas importantes | Sección 4 |
| Roles y responsabilidades internos | Sección 5 |
| Roles y responsabilidades externos | Sección 6 |
| Riesgos | Sección 7 |
| Plan alterno para los riesgos | Sección 7 |
| Firma del dueño autorizando la implementación | Bloque de firmas con la leyenda "Autorizo … el paso a la fase de implementación" |

### Producto 2 — Reporte de la junta de presentación del plan (`2. Organizacion/2.2`)
Mismos 8 criterios que el reporte de la junta de inicio.

## Elemento 3 · E2924 Implementar el proyecto
| Producto / criterio | Documento |
|---|---|
| Lista de paquetes por externos: paquetes, proveedores, experiencia requerida | `3.1 Lista de paquetes de trabajo por externos` |
| Proveedores calificados: nombre completo, mínimo 3 por paquete | `3.2 Lista de proveedores calificados` (3 × 3) |
| Trabajo por proveedor: descripción, limitante de costo, limitante de tiempo | `3.3 Descripción del trabajo por proveedor` |
| Avance: sin iniciar, en proceso, terminados, cancelados, en espera | `3.4 Lista de verificación de avance` (corte 16/10/2026) |
| Evidencias de todos los paquetes (fotos, documentos) | `3.5 Evidencias de paquetes terminados` + `evidencias/` + `anexos/` |

## Elemento 4 · E2925 Verificar el proyecto
| Producto / criterio | Documento |
|---|---|
| Cambios: nombre, número consecutivo, descripción, impacto económico, impacto en tiempo, fecha de programación, quién solicita, nombre y firma de quién autoriza | `4.1 Listado de cambios autorizados` (CC-01 a CC-03) |
| Estado actual (en tiempo / retrasado …); estado de cuenta: autorizado, cambios, comprometido, pagado; prioridades con plan, responsable y fecha; riesgos con plan, responsable y fecha | `4.2 Reporte de estado actual del proyecto` |
| Listado de paquetes + firma de aceptación del líder | `4.3 Verificación de paquetes terminados` |

## Elemento 5 · E2926 Finalizar el proyecto
| Producto / criterio | Documento |
|---|---|
| Estado con todos los paquetes y actividades terminados; estado de cuenta sin pagos pendientes; reporte de aprendizajes; todos los archivos generados; firma de aceptación del dueño | `5.1 Reporte final del proyecto` |
| Reporte de la junta de cierre: asistentes, fecha, quién preparó, temas, acuerdos, aprendizajes del equipo, firmas | `5.2 Minuta junta de cierre` |

## Actitudes evaluadas
- **Limpieza:** documentos generados digitalmente, sin manchas ni tachaduras.
- **Orden:** misma plantilla, códigos TL3D-x.x y secuencia lógica en todos los documentos.
- **Cooperación:** roles y responsabilidades de cada participante interno y externo.
- **Iniciativa:** plan alterno creativo para cada riesgo.
- **Responsabilidad:** fechas cumplidas y control de cambios y costos documentado.

## Errores del proyecto de referencia (Deko3D) que se corrigieron
| Error en Deko3D | Corrección en TwinLine 3D |
|---|---|
| Fecha de término "Pendiente" | Término fijo: 20/11/2026 |
| Participantes clave sin nombre completo | 6 participantes con nombre completo y puesto |
| Expectativas sin métrica ni fecha | Cada expectativa tiene métrica y fecha |
| Sin lecciones aprendidas | Tabla con 3 lecciones de proyectos anteriores |
| Supuestos y limitantes confusos | Supuestos = condiciones dadas por ciertas; limitantes por costo, tiempo, alcance y calidad |
| Total del presupuesto mal sumado | Los totales se calculan y validan con código (`fuente/build.js`) |
| No se indicaba la duración del proyecto | Sección "Duración del proyecto" |
| Firma sin leyenda de autorización para implementar | Leyenda explícita sobre la firma del dueño |
| Reporte sin el nombre completo de quien lo preparó | Campo "Elaboró el reporte" con nombre completo |
| Solo se documentaron 2 de los 5 elementos | Los 5 elementos completos |
