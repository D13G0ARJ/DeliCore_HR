import {
  AlertTriangle,
  BarChart3,
  CheckSquare,
  DatabaseZap,
  Gauge,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useMemo } from 'react'

function TarjetaResumen({ titulo, valor, descripcion, icono: Icono }) {
  return (
    <article className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {titulo}
          </p>
          <strong className="mt-3 block text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {valor}
          </strong>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{descripcion}</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
          <Icono size={20} />
        </span>
      </div>
    </article>
  )
}

function BarraCumplimiento({ valor }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
        style={{ width: `${Math.min(valor, 100)}%` }}
      />
    </div>
  )
}

function formatearFecha(valor, idioma) {
  if (!valor) return '-'
  const fecha = new Date(`${valor}T00:00:00`)
  return new Intl.DateTimeFormat(idioma === 'es' ? 'es-VE' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(fecha)
}

export function CentroKpis({ centro, textos, idioma, onAbrirSeguimiento, onAbrirSugeridos }) {
  const seguimientosPendientesActuales = useMemo(() => {
    return centro?.resumen?.seguimientos_pendientes ?? 0
  }, [centro])

  const resumenes = [
    {
      titulo: textos.totalKpis,
      valor: centro.resumen.total_kpis,
      descripcion: textos.catalogoKpis,
      icono: DatabaseZap,
    },
    {
      titulo: textos.registrosActivos,
      valor: centro.resumen.registros_activos,
      descripcion: textos.seguimientoReciente,
      icono: BarChart3,
    },
    {
      titulo: textos.promedioGlobal,
      valor: `${centro.resumen.promedio_global}%`,
      descripcion: textos.rendimientoEquipo,
      icono: Gauge,
    },
    {
      titulo: textos.puestosSinKpi,
      valor: centro.resumen.puestos_sin_kpi,
      descripcion: textos.brechasOperativas,
      icono: AlertTriangle,
    },
    {
      titulo: textos.empleadosConKpi,
      valor: centro.resumen.empleados_con_kpi,
      descripcion: textos.actividadKpi,
      icono: Users,
    },
    {
      titulo: textos.seguimientosPendientes,
      valor: seguimientosPendientesActuales,
      descripcion: textos.seguimientoOperativo,
      icono: CheckSquare,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            {textos.centroKpisSubtitulo}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.navKpis}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAbrirSeguimiento}
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            {textos.abrirSeguimientoKpis}
            <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em]">
              {seguimientosPendientesActuales}
            </span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onAbrirSugeridos}
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Sparkles size={16} />
            {textos.abrirKpisSugeridos}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {centro.kpis_sugeridos?.length ?? 0}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <section className="grid gap-5 xl:grid-cols-6 md:grid-cols-2">
        {resumenes.map((item) => (
          <TarjetaResumen key={item.titulo} {...item} />
        ))}
      </section>

      <section className="grid gap-5">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.catalogoKpis}
            </h3>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {centro.catalogo.length}
            </span>
          </div>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
            {centro.catalogo.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                      {item.nombre}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.puesto} · {item.departamento}
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                    {item.frecuencia}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_auto_auto]">
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.formula}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {item.formula}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.meta}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {item.meta_valor ?? 0}
                      {item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.promedioGlobal}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {item.promedio}%
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span>{textos.cumplimiento}</span>
                    <span>{item.promedio}%</span>
                  </div>
                  <BarraCumplimiento valor={item.promedio} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.rendimientoEquipo}
          </h3>
          <div className="mt-5 max-h-[55vh] space-y-4 overflow-y-auto pr-2">
            {centro.rendimiento_empleados.map((item) => (
              <div
                key={item.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.nombre}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {item.puesto} · {item.departamento}
                    </p>
                  </div>
                  <span className="text-lg font-black text-cyan-700 dark:text-cyan-300">
                    {item.promedio}%
                  </span>
                </div>
                <div className="mt-3">
                  <BarraCumplimiento valor={item.promedio} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.distribucionPorArea}
          </h3>
          <div className="mt-5 max-h-[55vh] space-y-4 overflow-y-auto pr-2">
            {centro.distribucion_departamentos.map((item) => (
              <div key={item.departamento}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.departamento}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {item.total_kpis} {textos.totalKpis.toLowerCase()}
                    </p>
                  </div>
                  <span className="text-sm font-black text-cyan-700 dark:text-cyan-300">
                    {item.promedio}%
                  </span>
                </div>
                <BarraCumplimiento valor={item.promedio} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <AlertTriangle size={18} />
              </span>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {textos.brechasOperativas}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{textos.puestosSinKpi}</p>
              </div>
            </div>

            {centro.brechas.puestos_sin_kpi.length === 0 ? (
              <p className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                {textos.sinPuestosSinKpi}
              </p>
            ) : (
              <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
                {centro.brechas.puestos_sin_kpi.map((item) => (
                  <div
                    key={`${item.departamento}-${item.puesto}`}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <p className="font-bold text-slate-950 dark:text-white">{item.puesto}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.departamento}</p>
                  </div>
                ))}
              </div>
            )}
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                <TrendingUp size={18} />
              </span>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {textos.kpisBajoObjetivo}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{textos.cumplimiento}</p>
              </div>
            </div>

            {centro.brechas.kpis_bajo_objetivo.length === 0 ? (
              <p className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                {textos.sinBrechas}
              </p>
            ) : (
              <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
                {centro.brechas.kpis_bajo_objetivo.map((item) => (
                  <div
                    key={`${item.departamento}-${item.nombre}`}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-950 dark:text-white">{item.nombre}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {item.puesto} · {item.departamento}
                        </p>
                      </div>
                      <span className="text-sm font-black text-amber-600 dark:text-amber-300">
                        {item.promedio}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </article>
      </section>

      {/* KPIs sugeridos se abren en pantalla separada */}
    </div>
  )
}
