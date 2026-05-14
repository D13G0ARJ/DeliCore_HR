import { useEffect, useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  CheckCircle2,
  FilePenLine,
  Mail,
  Plus,
  Save,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'

function TarjetaIndicador({ titulo, valor, descripcion, icono: Icono }) {
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

function construirFormulario(empleado) {
  if (!empleado) {
    return {
      nombre_completo: '',
      correo: '',
      puesto_principal_id: '',
      supervisor_inmediato_id: '',
      fecha_ingreso: '',
      estado: 'activo',
      antiguedad_texto: '',
      roles_adicionales: [],
    }
  }

  return {
    nombre_completo: empleado.nombre_completo ?? '',
    correo: empleado.correo ?? '',
    puesto_principal_id: String(empleado.puesto_principal?.id ?? ''),
    supervisor_inmediato_id: String(empleado.supervisor?.id ?? ''),
    fecha_ingreso: empleado.fecha_ingreso ?? '',
    estado: empleado.estado ?? 'activo',
    antiguedad_texto: empleado.antiguedad_texto ?? '',
    roles_adicionales: (empleado.roles_adicionales ?? []).map((rol) => ({
      puesto_id: String(rol.puesto_id ?? ''),
      condicion: rol.condicion ?? 'permanente',
      porcentaje_tiempo:
        rol.porcentaje_tiempo === null || rol.porcentaje_tiempo === undefined
          ? ''
          : String(rol.porcentaje_tiempo),
      observaciones: rol.observaciones ?? '',
    })),
  }
}

function etiquetaAcceso(tipo) {
  return tipo === 'admin' ? 'Administrador' : 'Empleado'
}

function esPuestoAdmin(catalogos, puestoId) {
  const puesto = (catalogos?.puestos ?? []).find((item) => String(item.id) === String(puestoId))
  const nombre = String(puesto?.nombre ?? '').toUpperCase()
  return ['DUEÑOS', 'DIRECTOR GENERAL'].includes(nombre)
}

function TarjetaUsuario({ empleado, activo, onSeleccionar, onEditar }) {
  return (
    <article
      className={[
        'rounded-[24px] border p-4 transition',
        activo
          ? 'border-cyan-300 bg-cyan-50 shadow-soft dark:border-cyan-700 dark:bg-cyan-950/30'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
      ].join(' ')}
    >
      <button type="button" onClick={onSeleccionar} className="w-full text-left">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-black tracking-tight text-slate-950 dark:text-white">
              {empleado.nombre_completo}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {empleado.correo || 'Sin correo corporativo'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {empleado.puesto_principal?.nombre ?? 'Sin puesto'}
              </span>
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                {etiquetaAcceso(empleado.tipo_acceso)}
              </span>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            {empleado.estado}
          </span>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Supervisor: <span className="font-semibold text-slate-700 dark:text-slate-200">{empleado.supervisor?.nombre ?? 'Sin asignar'}</span>
        </p>
        <button
          type="button"
          onClick={onEditar}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200"
        >
          <FilePenLine size={15} />
          Editar
        </button>
      </div>
    </article>
  )
}

function PlaceholderPanel({ usuarioActivo, onEditarSeleccionado, onNuevoUsuario }) {
  return (
    <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Edición protegida
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Panel listo para acción
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            La columna derecha permanece cerrada para evitar cambios accidentales. Usa `Editar` en un usuario o `Nuevo usuario` para abrir el formulario.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onNuevoUsuario}
          className="rounded-[24px] border border-cyan-200 bg-cyan-50 p-5 text-left transition hover:border-cyan-300 dark:border-cyan-900/40 dark:bg-cyan-950/20"
        >
          <p className="text-sm font-black text-slate-950 dark:text-white">Crear nuevo usuario</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Abre una ficha limpia para registrar un colaborador desde cero.
          </p>
        </button>

        <button
          type="button"
          onClick={onEditarSeleccionado}
          disabled={!usuarioActivo}
          className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/50"
        >
          <p className="text-sm font-black text-slate-950 dark:text-white">Editar usuario seleccionado</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {usuarioActivo
              ? `Abrirá la ficha de ${usuarioActivo.nombre_completo} para hacer cambios controlados.`
              : 'Selecciona primero un usuario en la columna izquierda.'}
          </p>
        </button>
      </div>

      {usuarioActivo ? (
        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Usuario seleccionado
          </p>
          <h4 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">
            {usuarioActivo.nombre_completo}
          </h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {usuarioActivo.puesto_principal?.nombre ?? 'Sin puesto'} · {usuarioActivo.correo || 'Sin correo corporativo'}
          </p>
        </div>
      ) : null}
    </article>
  )
}

export function GestionUsuarios({
  gestion,
  onCrearUsuario,
  onActualizarUsuario,
  guardando = false,
}) {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('todos')
  const [accesoFiltro, setAccesoFiltro] = useState('todos')
  const [modoFormulario, setModoFormulario] = useState(null)
  const [usuarioActivoId, setUsuarioActivoId] = useState(gestion?.empleados?.[0]?.id ?? null)
  const [formulario, setFormulario] = useState(() => construirFormulario(null))

  const empleados = gestion?.empleados ?? []
  const catalogos = gestion?.catalogos ?? { puestos: [], supervisores: [], estados: [], condiciones_rol: [] }

  useEffect(() => {
    if (!gestion?.empleados?.length) {
      setUsuarioActivoId(null)
      return
    }

    const existe = gestion.empleados.some((empleado) => empleado.id === usuarioActivoId)
    if (!existe) {
      setUsuarioActivoId(gestion.empleados[0].id)
    }
  }, [gestion, usuarioActivoId])

  const empleadosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return empleados.filter((empleado) => {
      const coincideBusqueda =
        !termino ||
        empleado.nombre_completo.toLowerCase().includes(termino) ||
        (empleado.correo ?? '').toLowerCase().includes(termino) ||
        (empleado.puesto_principal?.nombre ?? '').toLowerCase().includes(termino)

      const coincideEstado = estadoFiltro === 'todos' || empleado.estado === estadoFiltro
      const coincideAcceso = accesoFiltro === 'todos' || empleado.tipo_acceso === accesoFiltro

      return coincideBusqueda && coincideEstado && coincideAcceso
    })
  }, [accesoFiltro, busqueda, empleados, estadoFiltro])

  const usuarioActivo = empleados.find((empleado) => empleado.id === usuarioActivoId) ?? null
  const accesoEstimado = esPuestoAdmin(catalogos, formulario.puesto_principal_id) ? 'admin' : 'empleado'

  const indicadores = [
    {
      titulo: 'Usuarios totales',
      valor: gestion?.resumen?.total_usuarios ?? 0,
      descripcion: 'Base completa de usuarios internos disponibles en el sistema.',
      icono: Users,
    },
    {
      titulo: 'Usuarios activos',
      valor: gestion?.resumen?.usuarios_activos ?? 0,
      descripcion: 'Colaboradores actualmente habilitados para la operación.',
      icono: CheckCircle2,
    },
    {
      titulo: 'Administradores',
      valor: gestion?.resumen?.administradores ?? 0,
      descripcion: 'Perfiles con acceso administrativo según su estructura actual.',
      icono: ShieldCheck,
    },
    {
      titulo: 'Roles adicionales',
      valor: gestion?.resumen?.roles_adicionales ?? 0,
      descripcion: 'Coberturas extra registradas para soporte entre áreas y puestos.',
      icono: BriefcaseBusiness,
    },
  ]

  function seleccionarEmpleado(id) {
    setUsuarioActivoId(id)
  }

  function abrirNuevoUsuario() {
    setModoFormulario('create')
    setFormulario(construirFormulario(null))
  }

  function abrirEdicion(empleado = usuarioActivo) {
    if (!empleado) return
    setUsuarioActivoId(empleado.id)
    setModoFormulario('edit')
    setFormulario(construirFormulario(empleado))
  }

  function cerrarFormulario() {
    setModoFormulario(null)
    setFormulario(construirFormulario(null))
  }

  function actualizarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarRol(indice, campo, valor) {
    setFormulario((actual) => ({
      ...actual,
      roles_adicionales: actual.roles_adicionales.map((rol, posicion) =>
        posicion === indice ? { ...rol, [campo]: valor } : rol,
      ),
    }))
  }

  function agregarRol() {
    setFormulario((actual) => ({
      ...actual,
      roles_adicionales: [
        ...actual.roles_adicionales,
        {
          puesto_id: '',
          condicion: 'permanente',
          porcentaje_tiempo: '',
          observaciones: '',
        },
      ],
    }))
  }

  function eliminarRol(indice) {
    setFormulario((actual) => ({
      ...actual,
      roles_adicionales: actual.roles_adicionales.filter((_, posicion) => posicion !== indice),
    }))
  }

  async function manejarGuardar() {
    const payload = {
      ...formulario,
      puesto_principal_id: Number(formulario.puesto_principal_id),
      supervisor_inmediato_id: formulario.supervisor_inmediato_id ? Number(formulario.supervisor_inmediato_id) : null,
      roles_adicionales: formulario.roles_adicionales
        .filter((rol) => rol.puesto_id)
        .map((rol) => ({
          puesto_id: Number(rol.puesto_id),
          condicion: rol.condicion,
          porcentaje_tiempo: rol.porcentaje_tiempo === '' ? null : Number(rol.porcentaje_tiempo),
          observaciones: rol.observaciones?.trim() || null,
        })),
    }

    const respuesta =
      modoFormulario === 'create'
        ? await onCrearUsuario(payload)
        : await onActualizarUsuario(usuarioActivoId, payload)

    if (respuesta?.empleado) {
      setUsuarioActivoId(respuesta.empleado.id)
      setModoFormulario(null)
      setFormulario(construirFormulario(null))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            Centro administrativo de estructura humana
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Gestión de usuarios
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Crea usuarios, asígnales su puesto principal, supervisor y roles adicionales desde una sola vista clara y ordenada.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoUsuario}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          <UserPlus size={18} />
          Nuevo usuario
        </button>
      </div>

      <section className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        {indicadores.map((indicador) => (
          <TarjetaIndicador key={indicador.titulo} {...indicador} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative block min-w-[220px] flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Buscar por nombre, correo o puesto"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
              />
            </label>

            <select
              value={estadoFiltro}
              onChange={(evento) => setEstadoFiltro(evento.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
            >
              <option value="todos">Todos los estados</option>
              {(catalogos.estados ?? []).map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

            <select
              value={accesoFiltro}
              onChange={(evento) => setAccesoFiltro(evento.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
            >
              <option value="todos">Todos los accesos</option>
              <option value="admin">Administradores</option>
              <option value="empleado">Empleados</option>
            </select>
          </div>

          <div className="mt-5 space-y-4">
            {empleadosFiltrados.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                No hay usuarios que coincidan con los filtros actuales.
              </div>
            ) : (
              empleadosFiltrados.map((empleado) => (
                <TarjetaUsuario
                  key={empleado.id}
                  empleado={empleado}
                  activo={usuarioActivoId === empleado.id}
                  onSeleccionar={() => seleccionarEmpleado(empleado.id)}
                  onEditar={() => abrirEdicion(empleado)}
                />
              ))
            )}
          </div>
        </article>

        {modoFormulario ? (
          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {modoFormulario === 'create' ? 'Alta de usuario' : 'Edición activa'}
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {modoFormulario === 'create' ? 'Crear nuevo usuario' : usuarioActivo?.nombre_completo ?? 'Editar usuario'}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Este formulario solo se abre cuando decides editar o crear, para proteger los datos contra cambios accidentales.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-[22px] border border-cyan-100 bg-cyan-50 px-4 py-3 dark:border-cyan-900/40 dark:bg-cyan-950/20">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                    Acceso estimado
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">
                    {etiquetaAcceso(accesoEstimado)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200"
                >
                  <X size={15} />
                  Cerrar
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Nombre completo
                </span>
                <input
                  value={formulario.nombre_completo}
                  onChange={(evento) => actualizarCampo('nombre_completo', evento.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Correo corporativo
                </span>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={formulario.correo}
                    onChange={(evento) => actualizarCampo('correo', evento.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Puesto principal
                </span>
                <select
                  value={formulario.puesto_principal_id}
                  onChange={(evento) => actualizarCampo('puesto_principal_id', evento.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
                >
                  <option value="">Seleccionar puesto...</option>
                  {(catalogos.puestos ?? []).map((puesto) => (
                    <option key={puesto.id} value={puesto.id}>
                      {puesto.nombre} · {puesto.departamento}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Supervisor directo
                </span>
                <select
                  value={formulario.supervisor_inmediato_id}
                  onChange={(evento) => actualizarCampo('supervisor_inmediato_id', evento.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
                >
                  <option value="">Sin supervisor asignado</option>
                  {(catalogos.supervisores ?? [])
                    .filter((supervisor) => String(supervisor.id) !== String(usuarioActivoId))
                    .map((supervisor) => (
                      <option key={supervisor.id} value={supervisor.id}>
                        {supervisor.nombre} · {supervisor.puesto}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Fecha de ingreso
                </span>
                <input
                  type="date"
                  value={formulario.fecha_ingreso}
                  onChange={(evento) => actualizarCampo('fecha_ingreso', evento.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Estado
                </span>
                <select
                  value={formulario.estado}
                  onChange={(evento) => actualizarCampo('estado', evento.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
                >
                  {(catalogos.estados ?? []).map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 rounded-[24px] border border-cyan-100 bg-cyan-50/70 p-5 dark:border-cyan-900/40 dark:bg-cyan-950/20">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                Vista previa de acceso
              </p>
              <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                {etiquetaAcceso(accesoEstimado)}
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-900 dark:text-cyan-200">
                El sistema demo reconocerá este perfil según el puesto principal asignado.
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Roles adicionales
                  </p>
                  <h4 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                    Cobertura complementaria
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={agregarRol}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Plus size={16} />
                  Agregar rol
                </button>
              </div>

              <div className="space-y-4">
                {formulario.roles_adicionales.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                    No hay roles adicionales cargados para este usuario.
                  </div>
                ) : (
                  formulario.roles_adicionales.map((rol, indice) => (
                    <div
                      key={`rol-${indice}`}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            Puesto adicional
                          </span>
                          <select
                            value={rol.puesto_id}
                            onChange={(evento) => actualizarRol(indice, 'puesto_id', evento.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          >
                            <option value="">Seleccionar puesto...</option>
                            {(catalogos.puestos ?? []).map((puesto) => (
                              <option key={puesto.id} value={puesto.id}>
                                {puesto.nombre} · {puesto.departamento}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            Condición
                          </span>
                          <select
                            value={rol.condicion}
                            onChange={(evento) => actualizarRol(indice, 'condicion', evento.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          >
                            {(catalogos.condiciones_rol ?? []).map((condicion) => (
                              <option key={condicion} value={condicion}>
                                {condicion}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            Porcentaje de tiempo
                          </span>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={rol.porcentaje_tiempo}
                            onChange={(evento) => actualizarRol(indice, 'porcentaje_tiempo', evento.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            Observaciones
                          </span>
                          <input
                            value={rol.observaciones}
                            onChange={(evento) => actualizarRol(indice, 'observaciones', evento.target.value)}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => eliminarRol(indice)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-300"
                        >
                          <X size={15} />
                          Quitar rol
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
              <div className="rounded-[22px] bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Resultado esperado
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  Directorio, perfil y estructura quedarán alineados con esta configuración.
                </p>
              </div>

              <button
                type="button"
                onClick={manejarGuardar}
                disabled={guardando || !formulario.nombre_completo || !formulario.puesto_principal_id}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Save size={16} />
                {guardando
                  ? 'Guardando...'
                  : modoFormulario === 'create'
                    ? 'Crear usuario'
                    : 'Guardar cambios'}
              </button>
            </div>
          </article>
        ) : (
          <PlaceholderPanel
            usuarioActivo={usuarioActivo}
            onEditarSeleccionado={() => abrirEdicion(usuarioActivo)}
            onNuevoUsuario={abrirNuevoUsuario}
          />
        )}
      </section>
    </div>
  )
}
