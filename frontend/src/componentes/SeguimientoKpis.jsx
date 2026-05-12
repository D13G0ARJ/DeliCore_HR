import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CalendarCheck2, CheckSquare, ShieldCheck } from 'lucide-react'
import { actualizarSeguimientoKpi } from '../servicios/api'

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

function normalizarFrecuencia(valor) {
  const texto = String(valor ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

  if (texto.includes('diario') || texto.includes('daily')) return 'diario'
  if (texto.includes('semanal') || texto.includes('weekly')) return 'semanal'
  return 'otros'
}

function contarPendientes(items = []) {
  return items.filter((item) => !item.completado).length
}

export function SeguimientoKpis({ centro, textos, idioma, onVolver }) {
  const [tracker, setTracker] = useState(centro.tracker_por_rol ?? [])
  const [actualizandoId, setActualizandoId] = useState(null)

  useEffect(() => {
    setTracker(centro.tracker_por_rol ?? [])
  }, [centro])

  const catalogoPorId = useMemo(() => {
    return new Set((centro.catalogo ?? []).map((item) => item.id))
  }, [centro.catalogo])

  const itemsPlano = useMemo(() => tracker.flatMap((grupo) => grupo.items ?? []), [tracker])

  const secciones = useMemo(() => {
    const base = {
      diario: [],
      semanal: [],
      otros: [],
    }

    itemsPlano.forEach((item) => {
      const key = normalizarFrecuencia(item.frecuencia)
      base[key].push(item)
    })

    return base
  }, [itemsPlano])

  const pendientesDiario = useMemo(() => contarPendientes(secciones.diario), [secciones.diario])
  const pendientesSemanal = useMemo(() => contarPendientes(secciones.semanal), [secciones.semanal])
  const pendientesOtros = useMemo(() => contarPendientes(secciones.otros), [secciones.otros])

  const resumenes = [
    {
      titulo: textos.seguimientoDiario,
      valor: pendientesDiario,
      descripcion: textos.seguimientoDiarioDescripcion,
      icono: CalendarCheck2,
    },
    {
      titulo: textos.seguimientoSemanal,
      valor: pendientesSemanal,
      descripcion: textos.seguimientoSemanalDescripcion,
      icono: CheckSquare,
    },
    {
      titulo: textos.modoControlado,
      valor: textos.demoOperativa,
      descripcion: textos.seguimientoKpisRegla,
      icono: ShieldCheck,
    },
  ]

  async function alternarSeguimiento(itemId, completado) {
    setActualizandoId(itemId)

    try {
      await actualizarSeguimientoKpi(itemId, completado)
      setTracker((actual) =>
        actual.map((grupo) => {
          const items = (grupo.items ?? []).map((item) =>
            item.id === itemId ? { ...item, completado } : item,
          )

          return {
            ...grupo,
            items,
            progreso: Math.round(
              (items.filter((item) => item.completado).length / Math.max(items.length, 1)) * 100,
            ),
          }
        }),
      )
    } finally {
      setActualizandoId(null)
    }
  }

  function renderItems(items, etiquetaVacia) {
    if (!items.length) {
      return (
        <p className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
          {etiquetaVacia}
        </p>
      )
    }

    return (
      <div className="space-y-3">
        {items.map((item) => {
          const kpiExiste = item.definicion_kpi_id ? catalogoPorId.has(item.definicion_kpi_id) : false

          return (
            <label
              key={item.id}
              className="flex items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50"
            >
              <input
                type="checkbox"
                checked={item.completado}
                disabled={actualizandoId === item.id}
                onChange={(evento) => alternarSeguimiento(item.id, evento.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.titulo}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.descripcion}
                    </p>
                  </div>
                  <span
                    className={[
                      'rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
                      item.completado
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                    ].join(' ')}
                  >
                    {item.completado ? textos.completado : textos.pendiente}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  <span>{item.frecuencia}</span>
                  <span>{formatearFecha(item.fecha_seguimiento, idioma)}</span>
                  <span>
                    {textos.kpiAsociado}:{' '}
                    {item.kpi ? item.kpi : textos.sinKpiAsociado}
                  </span>
                  {item.kpi ? (
                    <span
                      className={
                        kpiExiste
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-amber-700 dark:text-amber-300'
                      }
                    >
                      {kpiExiste ? textos.kpiVinculadoOk : textos.kpiVinculadoPendiente}
                    </span>
                  ) : null}
                  {item.valor_actual !== null ? (
                    <span>
                      {item.valor_actual}
                      {item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}
                      {item.meta_valor !== null
                        ? ` / ${item.meta_valor}${item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}`
                        : ''}
                    </span>
                  ) : null}
                </div>
              </div>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            {textos.seguimientoKpisSubtitulo}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.seguimientoKpisTitulo}
          </h2>
        </div>

        <button
          type="button"
          onClick={onVolver}
          className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowLeft size={16} />
          {textos.volverCentroKpis}
        </button>
      </div>

      <section className="grid gap-5 xl:grid-cols-3 md:grid-cols-1">
        {resumenes.map((item) => (
          <TarjetaResumen key={item.titulo} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.seguimientoDiario}
            </h3>
            <span className="text-sm font-black text-cyan-700 dark:text-cyan-300">
              {pendientesDiario} {textos.pendiente.toLowerCase()}
            </span>
          </div>

          {renderItems(secciones.diario, textos.sinSeguimientosDiario)}
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.seguimientoSemanal}
            </h3>
            <span className="text-sm font-black text-cyan-700 dark:text-cyan-300">
              {pendientesSemanal} {textos.pendiente.toLowerCase()}
            </span>
          </div>

          {renderItems(secciones.semanal, textos.sinSeguimientosSemanal)}
        </article>
      </section>

      {secciones.otros.length ? (
        <section className="grid gap-5">
          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.seguimientoOtros}
              </h3>
              <span className="text-sm font-black text-cyan-700 dark:text-cyan-300">
                {pendientesOtros} {textos.pendiente.toLowerCase()}
              </span>
            </div>

            {renderItems(secciones.otros, textos.sinSeguimientosOtros)}
          </article>
        </section>
      ) : null}

      <section className="grid gap-5">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.seguimientoReciente}
          </h3>

          <div className="mt-5 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
            {(centro.seguimiento_reciente ?? []).map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.kpi}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.empleado} · {item.puesto}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {item.frecuencia} · {formatearFecha(item.periodo_fin, idioma)}
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                    {item.departamento}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.progreso}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {item.valor_real}
                      {item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.meta}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {item.meta_valor}
                      {item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.cumplimiento}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {item.cumplimiento}%
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <BarraCumplimiento valor={item.cumplimiento} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
