import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react'

function formatearMeta(valor, unidad) {
  if (valor === null || valor === undefined) return '-'
  return unidad === '%' ? `${valor}%` : `${valor} ${unidad ?? ''}`.trim()
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

function TarjetaDato({ titulo, valor, icono: Icono }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icono size={15} />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{titulo}</span>
      </div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{valor || '-'}</p>
    </div>
  )
}

function BloqueLista({ titulo, items, vacio }) {
  return (
    <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{titulo}</h3>
      {items.length === 0 ? (
        <p className="mt-5 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
          {vacio}
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item, indice) => (
            <div
              key={`${titulo}-${indice}`}
              className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50"
            >
              {typeof item === 'string' ? (
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{item}</p>
              ) : (
                <>
                  <p className="font-bold text-slate-900 dark:text-white">{item.titulo}</p>
                  {item.subtitulo ? (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.subtitulo}</p>
                  ) : null}
                  {item.apoyo ? (
                    <p className="mt-2 text-sm leading-6 text-cyan-700 dark:text-cyan-300">{item.apoyo}</p>
                  ) : null}
                </>
              )}
            </div>
          ))}
        </div>
      )}
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

export function PerfilEmpleado({ perfil, centro, sesion, textos, idioma }) {
  const empleado = perfil?.empleados?.find((item) => item.id === sesion?.empleado_id)
  const panel = centro?.mi_panel

  if (!empleado || !panel) {
    return null
  }

  const resumenes = [
    {
      titulo: textos.kpisAsignados ?? 'KPIs asignados',
      valor: panel.resumen.kpis_asignados,
      icono: Target,
    },
    {
      titulo: textos.seguimientosPendientes,
      valor: panel.resumen.seguimientos_pendientes,
      icono: CheckSquare,
    },
    {
      titulo: textos.cumplimientoPromedio,
      valor: `${panel.resumen.cumplimiento_promedio}%`,
      icono: BadgeCheck,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-slate-200/80 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
              {textos.navPerfil}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {empleado.nombre_completo}
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              {empleado.puesto_principal.nombre} · {empleado.puesto_principal.departamento}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {resumenes.map((item) => (
              <div
                key={item.titulo}
                className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <item.icono size={15} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{item.titulo}</span>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{item.valor}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TarjetaDato titulo={textos.correoLabel} valor={empleado.correo} icono={Mail} />
          <TarjetaDato titulo={textos.fechaIngreso} valor={formatearFecha(empleado.fecha_ingreso, idioma)} icono={CalendarDays} />
          <TarjetaDato titulo={textos.supervisorDirecto} valor={empleado.supervisor?.nombre ?? '-'} icono={ShieldCheck} />
          <TarjetaDato titulo={textos.rolesAdicionalesLabel} valor={empleado.roles_adicionales.length || 0} icono={BriefcaseBusiness} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.manualResumen}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
            {empleado.manual_resumen}
          </p>

          <div className="mt-5 space-y-3">
            {empleado.responsabilidades.map((item) => (
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
            {textos.kpisDefinidos}
          </h3>
          <div className="mt-5 space-y-4">
            {panel.kpis.map((item) => (
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
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.meta}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {formatearMeta(item.meta_valor, item.unidad)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.promedioGlobal}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{item.promedio}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <BloqueLista
          titulo={textos.rolesAdicionalesLabel}
          items={empleado.roles_adicionales.map((item) => ({
            titulo: item.puesto,
            subtitulo: `${item.departamento} · ${item.porcentaje_tiempo ?? 0}%`,
            apoyo: item.observaciones,
          }))}
          vacio={textos.sinRolesAdicionales}
        />

        <BloqueLista
          titulo={textos.kpisRecientes}
          items={empleado.kpis.map((item) => ({
            titulo: item.nombre,
            subtitulo: `${item.frecuencia} · ${formatearFecha(item.periodo_fin, idioma)}`,
            apoyo: `${item.valor_real}${item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}`,
          }))}
          vacio={textos.sinKpisRecientes}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <BloqueLista
          titulo={textos.departamentosRelacionados}
          items={empleado.departamentos_relacionados.map((item) => ({
            titulo: item,
          }))}
          vacio="-"
        />

        <BloqueLista
          titulo={textos.subordinados}
          items={empleado.subordinados.map((item) => ({
            titulo: item.nombre,
            subtitulo: item.puesto,
          }))}
          vacio={textos.sinSubordinados}
        />
      </section>
    </div>
  )
}
