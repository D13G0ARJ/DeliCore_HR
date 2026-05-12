import { useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Mail,
  Search,
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
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

function formatearFecha(valor, idioma) {
  if (!valor) {
    return '-'
  }

  const fecha = new Date(`${valor}T00:00:00`)
  return new Intl.DateTimeFormat(idioma === 'es' ? 'es-VE' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(fecha)
}

function TarjetaIndicador({ titulo, valor, apoyo, icono: Icono }) {
  return (
    <article className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-soft transition dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {titulo}
          </span>
          <strong className="mt-3 block text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {valor}
          </strong>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{apoyo}</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
          <Icono size={20} />
        </span>
      </div>
    </article>
  )
}

function TarjetaEmpleado({ empleado, seleccionado, textos, onClick, onOpenProfile }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group w-full rounded-[26px] border p-5 text-left transition-all duration-300',
        seleccionado
          ? 'border-cyan-300 bg-cyan-50 shadow-lg ring-2 ring-cyan-100 dark:border-cyan-700 dark:bg-cyan-950/30 dark:ring-cyan-900/50'
          : 'border-slate-200 bg-white shadow-soft hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white shadow-lg">
            {obtenerIniciales(empleado.nombre_completo)}
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
              {empleado.nombre_completo}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{empleado.correo}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {empleado.puesto_principal.nombre}
              </span>
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                {empleado.puesto_principal.departamento}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {empleado.estado}
          </span>
          <ChevronRight
            size={18}
            className="mt-1 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {textos.supervisorDirecto}
          </span>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
            {empleado.supervisor?.nombre ?? '-'}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {textos.rolesAdicionalesLabel}
          </span>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
            {empleado.roles_adicionales.length}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {textos.cumplimientoPromedio}
          </span>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
            {empleado.promedio_cumplimiento}%
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <span
          role="button"
          tabIndex={0}
          onClick={(evento) => {
            evento.stopPropagation()
            onOpenProfile?.()
          }}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
              evento.preventDefault()
              evento.stopPropagation()
              onOpenProfile?.()
            }
          }}
          className="text-sm font-bold text-cyan-700 transition hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          {textos.verDetalle}
        </span>
      </div>
    </button>
  )
}

function BloqueDato({ etiqueta, valor, icono: Icono }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icono size={15} />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{etiqueta}</span>
      </div>
      <p className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">{valor || '-'}</p>
    </div>
  )
}

export function DirectorioEmpleados({
  directorio,
  textos,
  idioma,
  empleadoSeleccionadoId,
  onSeleccionarEmpleado,
  onAbrirPerfil,
}) {
  const [busqueda, setBusqueda] = useState('')
  const [departamento, setDepartamento] = useState('todos')
  const [estado, setEstado] = useState('todos')
  const [nivel, setNivel] = useState('todos')
  const [empleadoActivoId, setEmpleadoActivoId] = useState(empleadoSeleccionadoId ?? null)

  useEffect(() => {
    if (empleadoSeleccionadoId) {
      setEmpleadoActivoId(empleadoSeleccionadoId)
    }
  }, [empleadoSeleccionadoId])

  useEffect(() => {
    setBusqueda('')
    setDepartamento('todos')
    setEstado('todos')
    setNivel('todos')
  }, [idioma])

  const empleadosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return (directorio.empleados ?? []).filter((empleado) => {
      const coincideBusqueda =
        !termino ||
        empleado.nombre_completo.toLowerCase().includes(termino) ||
        (empleado.correo ?? '').toLowerCase().includes(termino) ||
        (empleado.puesto_principal?.nombre ?? '').toLowerCase().includes(termino) ||
        (empleado.puesto_principal?.departamento ?? '').toLowerCase().includes(termino)

      const coincideDepartamento =
        departamento === 'todos' ||
        empleado.puesto_principal?.departamento === departamento ||
        (empleado.departamentos_relacionados ?? []).includes(departamento)

      const coincideEstado = estado === 'todos' || empleado.estado === estado
      const coincideNivel = nivel === 'todos' || empleado.puesto_principal?.nivel === nivel

      return coincideBusqueda && coincideDepartamento && coincideEstado && coincideNivel
    })
  }, [busqueda, departamento, estado, nivel, directorio.empleados])

  useEffect(() => {
    if (!empleadosFiltrados.length) {
      setEmpleadoActivoId(null)
      return
    }

    const existeActivo = empleadosFiltrados.some((empleado) => empleado.id === empleadoActivoId)
    if (!existeActivo) {
      setEmpleadoActivoId(empleadosFiltrados[0].id)
    }
  }, [empleadosFiltrados, empleadoActivoId])

  const empleadoActivo =
    empleadosFiltrados.find((empleado) => empleado.id === empleadoActivoId) ?? empleadosFiltrados[0]

  const indicadores = [
    {
      titulo: textos.empleadosActivos,
      valor: directorio.estadisticas.empleados_activos,
      apoyo: `${directorio.estadisticas.departamentos_cobertura} ${textos.coberturaAreasResumen.toLowerCase()}`,
      icono: Users,
    },
    {
      titulo: textos.rolesAdicionalesResumen,
      valor: directorio.estadisticas.roles_adicionales,
      apoyo: textos.directorioFuncionesExtraAyuda,
      icono: BriefcaseBusiness,
    },
    {
      titulo: textos.promedioKpiResumen,
      valor: `${directorio.estadisticas.promedio_kpi}%`,
      apoyo: textos.actividadKpi,
      icono: Sparkles,
    },
    {
      titulo: textos.supervisoresResumen,
      valor: directorio.estadisticas.supervisores,
      apoyo: textos.tablaEmpleados,
      icono: ShieldCheck,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
          {textos.directorioSubtitulo}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          {textos.navDirectorio}
        </h2>
      </div>

      <section className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        {indicadores.map((indicador) => (
          <TarjetaIndicador key={indicador.titulo} {...indicador} />
        ))}
      </section>

      <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 xl:grid-cols-[2fr_repeat(3,minmax(0,1fr))_auto]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
              placeholder={textos.buscarEmpleado}
            />
          </label>

          <select
            value={departamento}
            onChange={(evento) => setDepartamento(evento.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
          >
            <option value="todos">{textos.todosDepartamentos}</option>
            {directorio.filtros.departamentos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={estado}
            onChange={(evento) => setEstado(evento.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
          >
            <option value="todos">{textos.todosEstados}</option>
            {directorio.filtros.estados.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={nivel}
            onChange={(evento) => setNivel(evento.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
          >
            <option value="todos">{textos.todosNiveles}</option>
            {directorio.filtros.niveles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setBusqueda('')
              setDepartamento('todos')
              setEstado('todos')
              setNivel('todos')
            }}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
          >
            {textos.limpiarFiltros}
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.tablaEmpleados}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {empleadosFiltrados.length} / {directorio.empleados.length}
              </p>
            </div>
          </div>

          {empleadosFiltrados.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
              {textos.sinResultados}
            </div>
          ) : (
            <div className="space-y-4">
              {empleadosFiltrados.map((empleado) => (
                <TarjetaEmpleado
                  key={empleado.id}
                  empleado={empleado}
                  textos={textos}
                  seleccionado={empleado.id === empleadoActivo?.id}
                  onClick={() => {
                    setEmpleadoActivoId(empleado.id)
                    onSeleccionarEmpleado?.(empleado.id)
                  }}
                  onOpenProfile={() => {
                    onSeleccionarEmpleado?.(empleado.id)
                    onAbrirPerfil?.()
                  }}
                />
              ))}
            </div>
          )}
        </article>

        <aside className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-28 xl:self-start">
          {empleadoActivo ? (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-black text-white shadow-lg">
                  {obtenerIniciales(empleadoActivo.nombre_completo)}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                    {textos.detalleEmpleado}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    {empleadoActivo.nombre_completo}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {empleadoActivo.puesto_principal.departamento}
                  </p>
                  <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {empleadoActivo.estado}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <BloqueDato
                  etiqueta={textos.correoLabel}
                  valor={empleadoActivo.correo}
                  icono={Mail}
                />
                <BloqueDato
                  etiqueta={textos.antiguedad}
                  valor={empleadoActivo.antiguedad_texto}
                  icono={CalendarDays}
                />
                <BloqueDato
                  etiqueta={textos.cargoPrincipal}
                  valor={`${empleadoActivo.puesto_principal.nombre} · ${empleadoActivo.puesto_principal.nivel}`}
                  icono={BriefcaseBusiness}
                />
                <BloqueDato
                  etiqueta={textos.supervisorDirecto}
                  valor={empleadoActivo.supervisor?.nombre ?? '-'}
                  icono={UserRound}
                />
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {textos.cumplimientoPromedio}
                    </p>
                    <strong className="mt-2 block text-3xl font-black text-slate-950 dark:text-white">
                      {empleadoActivo.promedio_cumplimiento}%
                    </strong>
                  </div>
                  <BadgeCheck size={20} className="text-cyan-600 dark:text-cyan-300" />
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    style={{ width: `${empleadoActivo.promedio_cumplimiento}%` }}
                  />
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

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {textos.rolesAdicionalesLabel}
                </p>
                {empleadoActivo.roles_adicionales.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {textos.sinRolesAdicionales}
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {empleadoActivo.roles_adicionales.map((rol) => (
                      <div
                        key={`${empleadoActivo.id}-${rol.puesto}`}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <p className="font-bold text-slate-900 dark:text-white">{rol.puesto}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {rol.departamento} · {rol.porcentaje_tiempo ?? 0}%
                        </p>
                        {rol.observaciones ? (
                          <p className="mt-2 text-sm leading-6 text-cyan-700 dark:text-cyan-300">
                            {rol.observaciones}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {textos.actividadKpi}
                </p>
                {empleadoActivo.kpis.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {textos.sinKpisEmpleado}
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {empleadoActivo.kpis.map((kpi) => (
                      <div key={`${empleadoActivo.id}-${kpi.nombre}`}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {kpi.nombre}
                            </p>
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                              {kpi.frecuencia} · {formatearFecha(kpi.periodo_fin, idioma)}
                            </p>
                          </div>
                          <span className="text-sm font-black text-cyan-700 dark:text-cyan-300">
                            {kpi.valor_real}
                            {kpi.unidad === '%' ? '%' : ` ${kpi.unidad ?? ''}`.trim()}
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            style={{ width: `${Math.min(Number(kpi.valor_real) || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {textos.departamentosRelacionados}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {empleadoActivo.departamentos_relacionados.map((item) => (
                    <span
                      key={`${empleadoActivo.id}-${item}`}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <BloqueDato
                etiqueta={textos.fechaIngreso}
                valor={formatearFecha(empleadoActivo.fecha_ingreso, idioma)}
                icono={CalendarDays}
              />
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
              {textos.sinResultados}
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}
