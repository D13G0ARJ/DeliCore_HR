import { useMemo, useState } from 'react'
import { ArrowLeft, CalendarCheck2, CheckSquare, MessageSquareMore, ShieldCheck } from 'lucide-react'
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

function TarjetaPendienteDia({ centro, textos, modo, onVolver }) {
  const resumen = modo === 'empleado' ? centro.mi_panel?.resumen : centro.resumen
  const pendientes = resumen?.seguimientos_pendientes ?? 0

  return (
    <section className="rounded-[30px] border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-6 shadow-soft dark:border-cyan-900/50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-blue-950/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            {modo === 'empleado' ? 'Registro diario' : 'Control operativo'}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {pendientes} {pendientes === 1 ? 'pendiente clave' : 'pendientes clave'}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {modo === 'empleado'
              ? 'Marca lo completado y registra el valor actual de cada KPI sin salirte del flujo.'
              : 'Revisa lo pendiente por frecuencia y valida rápido qué necesita cierre esta semana.'}
          </p>
        </div>

        {onVolver ? (
          <button
            type="button"
            onClick={onVolver}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <ArrowLeft size={16} />
            {textos.volverCentroKpis}
          </button>
        ) : null}
      </div>
    </section>
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

export function SeguimientoKpis({ centro, textos, idioma, onVolver, modo = 'admin' }) {
  const [actualizandoId, setActualizandoId] = useState(null)
  const [formularios, setFormularios] = useState({})
  const [estadoGuardado, setEstadoGuardado] = useState({})

  const itemsPlano = useMemo(() => {
    const sobrescribir = (item) => {
      const cambios = formularios[item.id]
      return cambios ? { ...item, ...cambios } : item
    }

    if (modo === 'empleado') {
      return (centro.mi_panel?.seguimientos ?? []).map(sobrescribir)
    }

    return (centro.tracker_por_rol ?? []).flatMap((grupo) => (grupo.items ?? []).map(sobrescribir))
  }, [centro.mi_panel?.seguimientos, centro.tracker_por_rol, formularios, modo])

  const secciones = useMemo(() => {
    const base = { diario: [], semanal: [], otros: [] }
    itemsPlano.forEach((item) => {
      base[normalizarFrecuencia(item.frecuencia)].push(item)
    })
    return base
  }, [itemsPlano])

  const pendientesDiario = useMemo(() => contarPendientes(secciones.diario), [secciones.diario])
  const pendientesSemanal = useMemo(() => contarPendientes(secciones.semanal), [secciones.semanal])
  const pendientesOtros = useMemo(() => contarPendientes(secciones.otros), [secciones.otros])

  const resumenes = [
    { titulo: textos.seguimientoDiario, valor: pendientesDiario, descripcion: textos.seguimientoDiarioDescripcion, icono: CalendarCheck2 },
    { titulo: textos.seguimientoSemanal, valor: pendientesSemanal, descripcion: textos.seguimientoSemanalDescripcion, icono: CheckSquare },
    { titulo: 'Justificaciones', valor: itemsPlano.filter((item) => item.justificacion_respuesta).length, descripcion: 'Seguimientos con contexto registrado.', icono: MessageSquareMore },
    { titulo: textos.modoControlado, valor: textos.demoOperativa, descripcion: textos.seguimientoKpisRegla, icono: ShieldCheck },
  ]

  function actualizarFormulario(id, campo, valor) {
    setFormularios((actual) => ({
      ...actual,
      [id]: {
        valor_actual: actual[id]?.valor_actual ?? '',
        justificacion_respuesta: actual[id]?.justificacion_respuesta ?? '',
        completado: actual[id]?.completado ?? false,
        [campo]: valor,
      },
    }))

    setEstadoGuardado((actual) => ({
      ...actual,
      [id]: 'editando',
    }))
  }

  async function guardarSeguimiento(item, cambios = {}) {
    const base = formularios[item.id] ?? {
      valor_actual: item.valor_actual ?? '',
      justificacion_respuesta: item.justificacion_respuesta ?? '',
      completado: item.completado,
    }

    const payload = {
      completado: cambios.completado ?? base.completado,
      valor_actual:
        cambios.valor_actual ??
        (base.valor_actual === '' || base.valor_actual === null ? null : Number(base.valor_actual)),
      justificacion_respuesta: cambios.justificacion_respuesta ?? base.justificacion_respuesta ?? '',
    }

    setActualizandoId(item.id)
    setEstadoGuardado((actual) => ({
      ...actual,
      [item.id]: 'guardando',
    }))

    try {
      await actualizarSeguimientoKpi(item.id, payload)
      setEstadoGuardado((actual) => ({
        ...actual,
        [item.id]: 'guardado',
      }))
    } finally {
      setActualizandoId(null)
    }
  }

  function necesitaJustificacion(item, datosForm) {
    const valorActual = Number(
      datosForm.valor_actual === '' || datosForm.valor_actual === null ? item.valor_actual ?? 0 : datosForm.valor_actual,
    )
    const meta = Number(item.meta_valor ?? 0)

    if (!datosForm.completado) {
      return true
    }

    if (meta > 0 && !Number.isNaN(valorActual) && valorActual < meta) {
      return true
    }

    return false
  }

  function textoEstadoGuardado(id) {
    const estado = estadoGuardado[id]

    if (estado === 'guardando') return textos.guardandoJustificacion
    if (estado === 'guardado') return textos.guardadoJustificacion
    if (estado === 'editando') return textos.editandoJustificacion
    return textos.sincronizadoJustificacion
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
      <div className="space-y-4">
        {items.map((item) => {
          const datosForm = formularios[item.id] ?? {
            valor_actual: item.valor_actual ?? '',
            justificacion_respuesta: item.justificacion_respuesta ?? '',
            completado: item.completado,
          }
          const justificacionRecomendada = necesitaJustificacion(item, datosForm)
          const longitudJustificacion = datosForm.justificacion_respuesta?.length ?? 0

          return (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-[24px] border transition-all ${
                datosForm.completado
                  ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-800/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <label className="relative flex cursor-pointer items-center justify-center pt-1">
                    <input
                      type="checkbox"
                      checked={datosForm.completado}
                      disabled={actualizandoId === item.id}
                      onChange={(evento) => {
                        const completado = evento.target.checked
                        actualizarFormulario(item.id, 'completado', completado)
                        guardarSeguimiento(item, { completado })
                      }}
                      className={`peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 transition-all ${
                        datosForm.completado
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-300 hover:border-cyan-400 dark:border-slate-600 dark:hover:border-cyan-500'
                      }`}
                    />
                    <svg
                      className={`pointer-events-none absolute h-4 w-4 text-white transition-opacity ${
                        datosForm.completado ? 'opacity-100' : 'opacity-0'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </label>
                  <div>
                    <h4 className={`text-lg font-black tracking-tight transition-colors ${
                      datosForm.completado ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-950 dark:text-white'
                    }`}>
                      {item.titulo}
                    </h4>
                    <p className={`mt-1 text-sm ${datosForm.completado ? 'text-emerald-700/70 dark:text-emerald-500/70' : 'text-slate-600 dark:text-slate-400'}`}>
                      {item.descripcion}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {item.kpi}
                      </span>
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {item.frecuencia}
                      </span>
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {formatearFecha(item.fecha_seguimiento, idioma)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full shrink-0 flex-col gap-3 sm:w-[260px]">
                  <div className={`rounded-2xl border p-3 ${
                    datosForm.completado 
                      ? 'border-emerald-200/50 bg-white/60 dark:border-emerald-800/30 dark:bg-slate-900/40' 
                      : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50'
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      <span>Progreso</span>
                      <span>Meta: {item.meta_valor}{item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        value={datosForm.valor_actual}
                        onChange={(evento) => actualizarFormulario(item.id, 'valor_actual', evento.target.value)}
                        onBlur={() => guardarSeguimiento(item)}
                        placeholder="Valor actual..."
                        className={`h-10 w-full rounded-xl border-none px-3 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-cyan-500 dark:text-white ${
                          datosForm.completado 
                            ? 'bg-emerald-50/50 text-emerald-900 focus:bg-white dark:bg-slate-900 dark:text-emerald-400' 
                            : 'bg-white text-slate-900 dark:bg-slate-900'
                        }`}
                      />
                      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        {item.unidad ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-950/20">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.justificacionLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {justificacionRecomendada
                        ? textos.justificacionSugerida
                        : textos.justificacionOpcional}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {justificacionRecomendada ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                        {textos.justificacionRecomendada}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                      {textoEstadoGuardado(item.id)}
                    </span>
                  </div>
                </div>

                <textarea
                  value={datosForm.justificacion_respuesta}
                  onChange={(evento) => actualizarFormulario(item.id, 'justificacion_respuesta', evento.target.value)}
                  onBlur={() => guardarSeguimiento(item)}
                  placeholder={
                    justificacionRecomendada
                      ? textos.justificacionPlaceholderGuiado
                      : textos.justificacionPlaceholderLibre
                  }
                  rows={3}
                  className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-cyan-500 ${
                    datosForm.completado
                      ? 'border-emerald-100 bg-white/80 text-emerald-800 placeholder-emerald-600/50 dark:border-emerald-900/40 dark:bg-slate-900 dark:text-emerald-200 dark:placeholder-emerald-700/50'
                      : 'border-slate-200 bg-white text-slate-700 placeholder-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:placeholder-slate-600'
                  }`}
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {textos.justificacionAyuda}
                  </p>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {longitudJustificacion}/500
                  </span>
                </div>
              </div>
            </div>
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
            {modo === 'empleado' ? 'Mis KPIs y seguimientos' : textos.seguimientoKpisTitulo}
          </h2>
        </div>
      </div>

      <TarjetaPendienteDia centro={centro} textos={textos} modo={modo} onVolver={onVolver} />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
    </div>
  )
}
