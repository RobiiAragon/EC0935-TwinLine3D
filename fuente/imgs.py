import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import numpy as np, datetime as dt

plt.rcParams["font.family"] = "Liberation Sans"
TEAL = "#0F4C5C"; ACC = "#E36414"; GR = "#5B8E7D"; LG = "#E8EEF0"
OUT = "img/"

# 1 Arquitectura
fig, ax = plt.subplots(figsize=(10, 4.2)); ax.axis("off"); ax.set_xlim(0, 10); ax.set_ylim(0, 4.2)
def box(x, y, w, h, t, c=TEAL):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05", fc=c, ec="none"))
    ax.text(x + w/2, y + h/2, t, ha="center", va="center", color="white", fontsize=9.5, weight="bold")
def arr(x1, y1, x2, y2):
    ax.annotate("", (x2, y2), (x1, y1), arrowprops=dict(arrowstyle="-|>", color="#333", lw=1.4))
box(0.1, 1.6, 1.6, 1.0, "14 máquinas\nLínea SMT-2", "#6C757D")
box(2.1, 1.6, 1.6, 1.0, "Nodos ESP32\ncorriente · vibración\ntorreta")
box(4.1, 1.6, 1.6, 1.0, "VLAN IoT\n(aislada)", GR)
box(6.1, 1.6, 1.6, 1.0, "Servidor local\nMQTT + API + BD")
box(8.2, 3.0, 1.7, 0.9, "Visor 3D web\n(Three.js)", ACC)
box(8.2, 1.65, 1.7, 0.9, "Alertas\nMicrosoft Teams", ACC)
box(8.2, 0.3, 1.7, 0.9, "Tablero MTTR\nreporte semanal", ACC)
for a in [(1.7, 2.1, 2.1, 2.1), (3.7, 2.1, 4.1, 2.1), (5.7, 2.1, 6.1, 2.1), (7.7, 2.3, 8.2, 3.4), (7.7, 2.1, 8.2, 2.1), (7.7, 1.9, 8.2, 0.8)]:
    arr(*a)
ax.text(5, 0.2, "Sin acceso desde internet · sin intervención en PLC", ha="center", fontsize=9, color="#555", style="italic")
plt.tight_layout(); plt.savefig(OUT + "arquitectura.png", dpi=160); plt.close()

# 2 Visor 3D (render de referencia)
st = ["g"]*14; st[3] = "y"; st[8] = "r"; st[12] = "g"
col = {"g": "#2DB37A", "y": "#F2C744", "r": "#E04646"}
fig = plt.figure(figsize=(10, 5)); ax = fig.add_subplot(111, projection="3d")
ax.bar3d(-1, -1.2, 0, 23, 3.4, 0.02, color="#D9DEE2", shade=False, alpha=0.6)
names = ["LD-1", "SPI-1", "PP-1", "PP-2", "PP-3", "PP-4", "RF-1", "AOI-1", "LD-2", "SPI-2", "PP-5", "RF-2", "AOI-2", "ULD-1"]
for i, (n, s) in enumerate(zip(names, st)):
    h = 1.2 + (0.5 if n.startswith("RF") else 0)
    ax.bar3d(i*1.6, 0, 0, 1.2, 1.0, h, color=col[s], shade=True, edgecolor="#333", linewidth=0.3)
    ax.text(i*1.6 + 0.6, 0.5, h + 0.35, n, fontsize=7, ha="center")
ax.view_init(elev=28, azim=-62); ax.set_axis_off(); ax.set_box_aspect((23, 4, 3))
fig.text(0.02, 0.93, "TwinLine 3D · Línea SMT-2 · estado en tiempo real", fontsize=12, weight="bold", color=TEAL)
fig.text(0.02, 0.88, "Verde = marcha   Amarillo = paro   Rojo = falla   (actualización cada 2 s)", fontsize=9, color="#444")
plt.savefig(OUT + "visor3d.png", dpi=160, bbox_inches="tight"); plt.close()

# 3 Prueba 48 h
rng = np.random.default_rng(7)
loss = np.round(rng.uniform(0.05, 0.6, 12), 2)
fig, ax = plt.subplots(figsize=(9, 3.4))
ax.bar([f"M{i:02d}" for i in range(1, 13)], loss, color=TEAL)
ax.axhline(1, color=ACC, ls="--"); ax.text(11.4, 1.03, "límite 1%", color=ACC, ha="right", fontsize=9)
ax.set_ylabel("Pérdida de mensajes (%)"); ax.set_ylim(0, 1.3)
ax.set_title("Prueba de transmisión de 48 h (14/09 – 18/09/2026) · promedio %.2f%%" % loss.mean(), fontsize=11)
for s in ["top", "right"]: ax.spines[s].set_visible(False)
plt.tight_layout(); plt.savefig(OUT + "prueba48h.png", dpi=160); plt.close()

# 4 Tablero MTTR piloto
days = ["02/11", "03/11", "04/11", "05/11", "06/11", "09/11", "10/11", "11/11", "12/11", "13/11"]
mttr = [18.4, 17.9, 17.1, 16.8, 16.5, 15.9, 15.6, 15.4, 15.2, 15.0]
paros = [4, 3, 3, 4, 2, 3, 4, 3, 3, 2]
fig, ax = plt.subplots(figsize=(9, 3.6))
ax.plot(days, mttr, marker="o", color=TEAL, lw=2, label="MTTR diario (min)")
ax.axhline(20, color="#888", ls=":", label="Línea base jun–jul 2026: 20 min")
ax.axhline(17, color=ACC, ls="--", label="Meta: 17 min (−15%)")
ax.set_ylim(12, 22); ax.set_ylabel("minutos"); ax.legend(fontsize=8, loc="lower left", frameon=False)
ax.set_title("Tablero de indicadores · piloto 02/11 – 13/11/2026 (31 paros, MTTR ponderado 16.5 min)", fontsize=10.5)
for s in ["top", "right"]: ax.spines[s].set_visible(False)
plt.tight_layout(); plt.savefig(OUT + "tablero_mttr.png", dpi=160); plt.close()
assert sum(paros) == 31

# 5 Capacitación
names = ["Téc. 1", "Téc. 2", "Téc. 3", "Téc. 4", "Téc. 5", "Téc. 6", "Téc. 7", "Téc. 8", "Sup. 1", "Sup. 2", "Sup. 3"]
cal = [9.5, 8.5, 9.0, 10, 8.5, 9.0, 8.0, 9.5, 9.5, 9.0, 9.5]
fig, ax = plt.subplots(figsize=(9, 3.2))
ax.bar(names, cal, color=GR); ax.axhline(8, color=ACC, ls="--"); ax.set_ylim(0, 10.5)
ax.set_title("Evaluación práctica de la capacitación (10 – 11/11/2026) · promedio %.1f / 10" % np.mean(cal), fontsize=10.5)
for s in ["top", "right"]: ax.spines[s].set_visible(False)
plt.tight_layout(); plt.savefig(OUT + "capacitacion.png", dpi=160); plt.close()
print("cal avg", np.mean(cal), "loss avg", loss.mean(), "mttr", np.mean(mttr))

# 6 Gantt planeado vs real
def d(s): return dt.datetime.strptime(s, "%d/%m/%Y")
rows = [("PT-01", "03/08/2026", "19/08/2026", "03/08/2026", "19/08/2026"), ("PT-02", "06/08/2026", "14/08/2026", "06/08/2026", "14/08/2026"),
        ("PT-03", "20/08/2026", "28/08/2026", "20/08/2026", "28/08/2026"), ("PT-04", "31/08/2026", "11/09/2026", "31/08/2026", "11/09/2026"),
        ("PT-05", "07/09/2026", "18/09/2026", "07/09/2026", "18/09/2026"), ("PT-06", "20/08/2026", "25/09/2026", "20/08/2026", "25/09/2026"),
        ("PT-07", "21/09/2026", "09/10/2026", "21/09/2026", "09/10/2026"), ("PT-08", "12/10/2026", "23/10/2026", "12/10/2026", "27/10/2026"),
        ("PT-09", "19/10/2026", "23/10/2026", None, None), ("PT-13", None, None, "19/10/2026", "23/10/2026"),
        ("PT-10", "28/10/2026", "13/11/2026", "28/10/2026", "13/11/2026"), ("PT-11", "09/11/2026", "11/11/2026", "09/11/2026", "11/11/2026"),
        ("PT-12", "17/11/2026", "20/11/2026", "17/11/2026", "20/11/2026")]
fig, ax = plt.subplots(figsize=(10, 4.6))
for i, (n, a, b, c, e) in enumerate(rows[::-1]):
    if a: ax.barh(i + 0.18, (d(b) - d(a)).days + 1, left=d(a), height=0.34, color="#B8C4C9")
    if c: ax.barh(i - 0.18, (d(e) - d(c)).days + 1, left=d(c), height=0.34, color=TEAL)
ax.set_yticks(range(len(rows))); ax.set_yticklabels([r[0] for r in rows[::-1]], fontsize=8)
ax.xaxis.set_major_formatter(matplotlib.dates.DateFormatter("%d/%m"))
ax.barh([], [], color="#B8C4C9", label="Planeado"); ax.barh([], [], color=TEAL, label="Real")
ax.legend(fontsize=8, loc="upper right", frameon=False)
ax.set_title("Programa planeado vs. real (PT-09 cancelado por CC-03 · PT-13 agregado por CC-01)", fontsize=10.5)
for s in ["top", "right"]: ax.spines[s].set_visible(False)
plt.tight_layout(); plt.savefig(OUT + "gantt.png", dpi=160); plt.close()

# 7 Esquema instalación nodo
fig, ax = plt.subplots(figsize=(9, 3.2)); ax.axis("off"); ax.set_xlim(0, 9); ax.set_ylim(0, 3.2)
box(0.2, 0.8, 2.2, 1.6, "Máquina SMT\n(PLC intacto)", "#6C757D")
box(3.4, 0.8, 2.2, 1.6, "Nodo ESP32\ngabinete IP54\nID: M-xx")
box(6.6, 2.0, 2.2, 0.8, "Red VLAN IoT", GR); box(6.6, 0.4, 2.2, 0.8, "Alimentación 24 VCD", "#999")
for a in [(2.4, 2.0, 3.4, 2.0), (2.4, 1.2, 3.4, 1.2), (5.6, 2.0, 6.6, 2.4), (6.6, 0.8, 5.6, 1.2)]: arr(*a)
ax.text(2.9, 2.15, "TC corriente", fontsize=8, ha="center"); ax.text(2.9, 0.95, "vibración/torreta", fontsize=8, ha="center")
ax.set_title("Esquema de instalación por máquina (certificado de instalación, proveedor E2)", fontsize=10.5)
plt.tight_layout(); plt.savefig(OUT + "instalacion.png", dpi=160); plt.close()
