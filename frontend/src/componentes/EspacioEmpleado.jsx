import { ArrowRight, BriefcaseBusiness, CheckSquare, Sparkles, Target } from 'lucide-react'

function TarjetaMini({ titulo, valor, detalle, icono: Icono }) {
  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {titulo}
          </p>
          <strong className="mt-3 block text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {valor}
          </strong>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{detalle}</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
          <Icono size={20} />
        </span>
      </div>
    </article>
  )
}

function EtiquetaOrigen({ item }) {
  const esIndividual = item.tipo_asignacion === 'empleado'

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
        esIndividual
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
          : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300'
      }`}
    >
      {esIndividual ? 'Meta individual' : 'Meta del puesto'}
    </span>
  )
}

export function EspacioEmpleado({
  perfil,
  centro,
  sesion,
  textos,
  onAbrirKpis,
  onAbrirSeguimiento,
  onAbrirAsistente,
}) {
  const empleado = perfil?.empleados?.find((item) => item.id === sesion?.empleado_id)
  const panel = centro?.mi_panel

  if (!empleado || !panel) {
    return null
  }

  const resumenes = [
    {
      titulo: textos.kpisAsignados ?? 'KPIs asignados',
      valor: panel.resumen.kpis_asignados,
      detalle: textos.actividadKpi,
      icono: Target,
    },
    {
      titulo: textos.seguimientosPendientes,
      valor: panel.resumen.seguimientos_pendientes,
      detalle: textos.seguimientoOperativo,
      icono: CheckSquare,
    },
    {
      titulo: textos.cumplimientoPromedio,
      valor: `${panel.resumen.cumplimiento_promedio}%`,
      detalle: textos.promedioGlobal,
      icono: BriefcaseBusiness,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-slate-200/80 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
              {textos.navDashboard}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Bienvenido, {empleado.nombre_completo}
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Aquí tienes un resumen rápido de tu avance, tus pendientes KPI y tu contexto operativo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onAbrirAsistente}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 text-sm font-bold text-cyan-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-cyan-800/50 dark:bg-cyan-950/30 dark:text-cyan-300 dark:hover:border-cyan-700"
            >
              <Sparkles size={18} />
              Asistente IA de Área
            </button>
            <button
              type="button"
              onClick={onAbrirSeguimiento}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 dark:bg-cyan-500 dark:text-slate-950"
            >
              <CheckSquare size={18} />
              Ir a seguimiento KPI
            </button>
            <button
              type="button"
              onClick={onAbrirKpis}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Target size={18} />
              Ver KPIs
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Cargo actual
            </p>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">
              {empleado.puesto_principal.nombre}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {empleado.puesto_principal.departamento}
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Supervisor
            </p>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">
              {empleado.supervisor?.nombre ?? '-'}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {empleado.supervisor?.puesto ?? 'Sin supervisor asignado'}
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {textos.rolesAdicionalesLabel}
            </p>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">
              {empleado.roles_adicionales.length || 0}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Roles complementarios activos.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {resumenes.map((item) => (
          <TarjetaMini key={item.titulo} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Prioridades de hoy
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
            Enfócate primero en tus seguimientos pendientes y luego revisa los KPIs donde el promedio vaya más justo.
          </p>

          <div className="mt-5 space-y-3">
            {[
              `${panel.resumen.seguimientos_pendientes} seguimientos pendientes por registrar o cerrar.`,
              `${panel.resumen.kpis_asignados} KPIs visibles entre metas personales y metas de tus áreas.`,
              `${empleado.roles_adicionales.length || 0} roles adicionales que pueden afectar tu carga operativa.`,
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            KPIs clave a la vista
          </h3>
          <div className="mt-5 space-y-4">
            {panel.kpis.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.nombre}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.descripcion}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
                      {item.frecuencia}
                    </span>
                    <EtiquetaOrigen item={item} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Meta: {item.meta_valor}{item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{item.promedio}%</div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onAbrirKpis}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition hover:gap-3 dark:text-cyan-300"
          >
            Ir al centro de KPIs
            <ArrowRight size={16} />
          </button>
        </article>
      </section>

      <section className="rounded-[30px] border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-6 shadow-soft dark:border-cyan-900/50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-blue-950/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Seguimiento KPI
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {panel.resumen.seguimientos_pendientes} pendientes por registrar
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Entra directo a tu seguimiento para registrar avances, justificaciones y cierres del día.
            </p>
          </div>
          <button
            type="button"
            onClick={onAbrirSeguimiento}
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-cyan-600 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
          >
            <CheckSquare size={18} />
            Abrir seguimiento
          </button>
        </div>
      </section>
    </div>
  )
}
