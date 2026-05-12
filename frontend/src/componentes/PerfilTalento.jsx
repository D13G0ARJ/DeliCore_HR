import { useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  Mail,
  Network,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react'

function obtenerIniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase()
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

function BloqueLista({ titulo, items, vacio }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {titulo}
      </p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{vacio}</p>
      ) : (
        <div className="mt-3 space-y-3">
          {items.map((item, indice) => (
            <div
              key={`${titulo}-${indice}`}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
            >
              {typeof item === 'string' ? (
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{item}</p>
              ) : (
                <>
                  <p className="font-bold text-slate-900 dark:text-white">{item.titulo}</p>
                  {item.subtitulo ? (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.subtitulo}
                    </p>
                  ) : null}
                  {item.apoyo ? (
                    <p className="mt-2 text-sm leading-6 text-cyan-700 dark:text-cyan-300">
                      {item.apoyo}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function PerfilTalento({
  perfil,
  textos,
  idioma,
  empleadoSeleccionadoId,
  onSeleccionarEmpleado,
}) {
  const [modo, setModo] = useState('empleados')
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos')
  const [filtroNivel, setFiltroNivel] = useState('todos')
  const [empleadoActivoIdLocal, setEmpleadoActivoIdLocal] = useState(empleadoSeleccionadoId ?? null)
  const [puestoActivoId, setPuestoActivoId] = useState(null)

  useEffect(() => {
    if (empleadoSeleccionadoId) {
      setEmpleadoActivoIdLocal(empleadoSeleccionadoId)
      setModo('empleados')
    }
  }, [empleadoSeleccionadoId])

  const empleadosFiltrados = useMemo(() => {
    return (perfil.empleados ?? []).filter((empleado) => {
      const coincideDepartamento =
        filtroDepartamento === 'todos' ||
        empleado.puesto_principal?.departamento === filtroDepartamento
      const coincideNivel =
        filtroNivel === 'todos' || empleado.puesto_principal?.nivel === filtroNivel
      return coincideDepartamento && coincideNivel
    })
  }, [perfil.empleados, filtroDepartamento, filtroNivel])

  const puestosFiltrados = useMemo(() => {
    return (perfil.puestos ?? []).filter((puesto) => {
      const coincideDepartamento =
        filtroDepartamento === 'todos' || puesto.departamento === filtroDepartamento
      const coincideNivel = filtroNivel === 'todos' || puesto.nivel === filtroNivel
      return coincideDepartamento && coincideNivel
    })
  }, [perfil.puestos, filtroDepartamento, filtroNivel])

  useEffect(() => {
    if (empleadosFiltrados.length && !empleadosFiltrados.some((item) => item.id === empleadoActivoIdLocal)) {
      setEmpleadoActivoIdLocal(empleadosFiltrados[0].id)
    }
  }, [empleadosFiltrados, empleadoActivoIdLocal])

  useEffect(() => {
    if (puestosFiltrados.length && !puestosFiltrados.some((item) => item.id === puestoActivoId)) {
      setPuestoActivoId(puestosFiltrados[0].id)
    }
  }, [puestosFiltrados, puestoActivoId])

  const empleadoActivo =
    empleadosFiltrados.find((item) => item.id === empleadoActivoIdLocal) ?? empleadosFiltrados[0]
  const puestoActivo =
    puestosFiltrados.find((item) => item.id === puestoActivoId) ?? puestosFiltrados[0]

  const resumenes = [
    {
      titulo: textos.empleadosActivos,
      valor: perfil.estadisticas.empleados,
      descripcion: textos.vistaEmpleados,
      icono: Users,
    },
    {
      titulo: textos.puestos,
      valor: perfil.estadisticas.puestos,
      descripcion: textos.vistaPuestos,
      icono: BriefcaseBusiness,
    },
    {
      titulo: textos.coberturaAreasResumen,
      valor: perfil.estadisticas.departamentos,
      descripcion: textos.departamentosRelacionados,
      icono: Building2,
    },
    {
      titulo: textos.promedioGlobal,
      valor: `${perfil.estadisticas.promedio_kpi}%`,
      descripcion: textos.actividadKpi,
      icono: Sparkles,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
          {textos.perfilTalentoSubtitulo}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          {textos.navPerfil}
        </h2>
      </div>

      <section className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        {resumenes.map((item) => (
          <TarjetaResumen key={item.titulo} {...item} />
        ))}
      </section>

      <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: 'empleados', label: textos.vistaEmpleados },
            { id: 'puestos', label: textos.vistaPuestos },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setModo(item.id)}
              className={[
                'rounded-full px-4 py-2 text-sm font-bold transition',
                modo === item.id
                  ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}

          <select
            value={filtroDepartamento}
            onChange={(evento) => setFiltroDepartamento(evento.target.value)}
            className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
          >
            <option value="todos">{textos.todosDepartamentos}</option>
            {perfil.filtros.departamentos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={filtroNivel}
            onChange={(evento) => setFiltroNivel(evento.target.value)}
            className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
          >
            <option value="todos">{textos.todosNiveles}</option>
            {perfil.filtros.niveles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {modo === 'empleados' ? (
        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.selectorEmpleado}
              </h3>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {empleadosFiltrados.length}
              </span>
            </div>
            <div className="space-y-3">
              {empleadosFiltrados.map((empleado) => (
                <button
                  key={empleado.id}
                  type="button"
                  onClick={() => {
                    setEmpleadoActivoIdLocal(empleado.id)
                    onSeleccionarEmpleado?.(empleado.id)
                  }}
                  className={[
                    'flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition',
                    empleado.id === empleadoActivo?.id
                      ? 'border-cyan-300 bg-cyan-50 ring-2 ring-cyan-100 dark:border-cyan-700 dark:bg-cyan-950/30'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
                      {obtenerIniciales(empleado.nombre_completo)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{empleado.nombre_completo}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {empleado.puesto_principal.nombre}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            {empleadoActivo ? (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-black text-white shadow-lg">
                    {obtenerIniciales(empleadoActivo.nombre_completo)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                      {empleadoActivo.nombre_completo}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {empleadoActivo.puesto_principal.nombre} · {empleadoActivo.puesto_principal.departamento}
                    </p>
                    <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {empleadoActivo.estado}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Mail size={15} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {textos.correoLabel}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{empleadoActivo.correo}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <CalendarDays size={15} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {textos.fechaIngreso}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatearFecha(empleadoActivo.fecha_ingreso, idioma)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <ShieldCheck size={15} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {textos.supervisorDirecto}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {empleadoActivo.supervisor?.nombre ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <BadgeCheck size={15} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {textos.cumplimientoPromedio}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {empleadoActivo.promedio_cumplimiento}%
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {textos.manualResumen}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                    {empleadoActivo.manual_resumen}
                  </p>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <BloqueLista
                    titulo={textos.responsabilidadesClave}
                    items={empleadoActivo.responsabilidades}
                    vacio={textos.sinResponsabilidades}
                  />
                  <BloqueLista
                    titulo={textos.subordinados}
                    items={empleadoActivo.subordinados.map((item) => ({
                      titulo: item.nombre,
                      subtitulo: item.puesto,
                    }))}
                    vacio={textos.sinSubordinados}
                  />
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <BloqueLista
                    titulo={textos.rolesAdicionalesLabel}
                    items={empleadoActivo.roles_adicionales.map((item) => ({
                      titulo: item.puesto,
                      subtitulo: `${item.departamento} · ${item.porcentaje_tiempo ?? 0}%`,
                      apoyo: item.observaciones,
                    }))}
                    vacio={textos.sinRolesAdicionales}
                  />
                  <BloqueLista
                    titulo={textos.kpisRecientes}
                    items={empleadoActivo.kpis.map((item) => ({
                      titulo: item.nombre,
                      subtitulo: `${item.frecuencia} · ${formatearFecha(item.periodo_fin, idioma)}`,
                      apoyo: `${item.valor_real}${item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}`,
                    }))}
                    vacio={textos.sinKpisRecientes}
                  />
                </div>
              </div>
            ) : null}
          </article>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.selectorPuesto}
              </h3>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {puestosFiltrados.length}
              </span>
            </div>
            <div className="space-y-3">
              {puestosFiltrados.map((puesto) => (
                <button
                  key={puesto.id}
                  type="button"
                  onClick={() => setPuestoActivoId(puesto.id)}
                  className={[
                    'flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition',
                    puesto.id === puestoActivo?.id
                      ? 'border-cyan-300 bg-cyan-50 ring-2 ring-cyan-100 dark:border-cyan-700 dark:bg-cyan-950/30'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50',
                  ].join(' ')}
                >
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{puesto.nombre}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {puesto.departamento} · {puesto.nivel}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            {puestoActivo ? (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg">
                    <Network size={24} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                      {puestoActivo.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {puestoActivo.departamento} · {puestoActivo.nivel}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <ShieldCheck size={15} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {textos.supervisorPuesto}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {puestoActivo.supervisor ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Sparkles size={15} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                        {textos.promedioPuesto}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {puestoActivo.promedio_cumplimiento}%
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {textos.proposito}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                    {puestoActivo.proposito}
                  </p>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <BloqueLista
                    titulo={textos.responsabilidadesClave}
                    items={puestoActivo.responsabilidades}
                    vacio={textos.sinResponsabilidades}
                  />
                  <BloqueLista
                    titulo={textos.empleadosAsignados}
                    items={puestoActivo.empleados_asignados.map((item) => ({
                      titulo: item.nombre,
                      subtitulo: item.correo,
                    }))}
                    vacio={textos.sinEmpleadosAsignados}
                  />
                </div>

                <BloqueLista
                  titulo={textos.kpisDefinidos}
                  items={puestoActivo.kpis_definidos.map((item) => ({
                    titulo: item.nombre,
                    subtitulo: `${item.frecuencia} · ${item.meta_valor ?? 0}${item.unidad === '%' ? '%' : ` ${item.unidad ?? ''}`.trim()}`,
                    apoyo: `${textos.promedioPuesto}: ${item.promedio}%`,
                  }))}
                  vacio={textos.sinKpisDefinidos}
                />
              </div>
            ) : null}
          </article>
        </section>
      )}
    </div>
  )
}
