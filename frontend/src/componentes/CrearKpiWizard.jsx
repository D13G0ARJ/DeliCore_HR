import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Save,
  Sparkles,
  Target,
  User,
} from 'lucide-react'

const PASOS = [
  { id: 1, titulo: 'Asignación', icono: Briefcase, subtitulo: 'Define el alcance del KPI.' },
  { id: 2, titulo: 'Definición', icono: FileText, subtitulo: 'Nombra y describe qué se medirá.' },
  { id: 3, titulo: 'Meta y frecuencia', icono: Target, subtitulo: 'Configura el seguimiento operativo.' },
]

const MENSAJES_PASO = {
  1: {
    etiqueta: 'Alcance',
    titulo: 'Selecciona el destino del KPI',
    descripcion: 'Decide si el KPI aplicará a un puesto completo o a una colaboradora específica.',
  },
  2: {
    etiqueta: 'Definición',
    titulo: 'Redacta un KPI claro y accionable',
    descripcion: 'Usa un nombre concreto y una descripción breve para que el equipo entienda cómo se evaluará.',
  },
  3: {
    etiqueta: 'Seguimiento',
    titulo: 'Cierra la configuración operativa',
    descripcion: 'Define meta, unidad y frecuencia para que el seguimiento aparezca listo en el sistema.',
  },
}

const FRECUENCIA_DESCRIPCIONES = {
  Diario: 'Aparecerá como control cotidiano dentro de Seguimiento KPI.',
  Semanal: 'Se agrupará dentro del cierre operativo semanal.',
  Mensual: 'Quedará disponible para revisión periódica de gestión.',
}

const InputCustom = ({ label, valor, onChange, placeholder, tipo = 'text', error }) => (
  <div className="w-full">
    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <input
      type={tipo}
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-12 w-full rounded-2xl border bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:bg-white dark:bg-slate-950/50 dark:text-white ${
        error
          ? 'border-rose-400 focus:border-rose-500 dark:border-rose-800'
          : 'border-slate-200 text-slate-900 focus:border-cyan-400 dark:border-slate-700 dark:focus:border-cyan-500'
      }`}
    />
    {error ? <p className="mt-2 text-xs font-bold text-rose-500">{error}</p> : null}
  </div>
)

const SelectCustom = ({ label, valor, opciones, onChange, error }) => (
  <div className="w-full">
    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <select
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      className={`h-12 w-full rounded-2xl border bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:bg-white dark:bg-slate-950/50 dark:text-white ${
        error
          ? 'border-rose-400 focus:border-rose-500 dark:border-rose-800'
          : 'border-slate-200 text-slate-900 focus:border-cyan-400 dark:border-slate-700 dark:focus:border-cyan-500'
      }`}
    >
      <option value="">Seleccionar...</option>
      {opciones.map((opcion) => (
        <option key={opcion.valor} value={opcion.valor}>
          {opcion.etiqueta}
        </option>
      ))}
    </select>
    {error ? <p className="mt-2 text-xs font-bold text-rose-500">{error}</p> : null}
  </div>
)

const TextareaCustom = ({ label, valor, onChange, placeholder, rows = 3 }) => (
  <div className="w-full">
    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <textarea
      rows={rows}
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:focus:border-cyan-500"
    />
  </div>
)

function TarjetaResumen({ titulo, valor, ayuda }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {titulo}
      </p>
      <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{valor}</p>
      {ayuda ? <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{ayuda}</p> : null}
    </div>
  )
}

function TarjetaResumenFlujo({ textos, pasoActual, formulario, tipoAsignacion, puestoSeleccionado, empleadoSeleccionado }) {
  const paso = MENSAJES_PASO[pasoActual]
  const asignacionTexto =
    tipoAsignacion === 'empleado'
      ? empleadoSeleccionado?.nombre_completo ?? 'Empleado pendiente por seleccionar'
      : puestoSeleccionado
        ? `${puestoSeleccionado.nombre} · ${puestoSeleccionado.departamento}`
        : 'Puesto pendiente por seleccionar'

  const metaTexto = formulario.meta_valor ? `${formulario.meta_valor} ${formulario.unidad}` : 'Meta pendiente'
  const frecuenciaAyuda = FRECUENCIA_DESCRIPCIONES[formulario.frecuencia] ?? 'El sistema lo mostrará según la configuración elegida.'
  const proximaAccion =
    pasoActual < 3
      ? 'Completa este paso para desbloquear la siguiente parte del flujo.'
      : 'Al guardar, el KPI se registrará y sus seguimientos quedarán listos para validación.'

  return (
    <aside className="space-y-4 rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
          {textos.crearKpiRapido}
        </p>
        <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">
          Resumen del flujo
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{paso.descripcion}</p>
      </div>

      <div className="rounded-[24px] border border-cyan-100 bg-cyan-50/80 p-4 dark:border-cyan-900/40 dark:bg-cyan-950/20">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm dark:bg-slate-900 dark:text-cyan-300">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              {paso.etiqueta}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{paso.titulo}</p>
            <p className="mt-2 text-xs leading-5 text-cyan-800 dark:text-cyan-200">{proximaAccion}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <TarjetaResumen
          titulo="Asignación"
          valor={tipoAsignacion === 'empleado' ? 'KPI individual' : 'KPI por puesto'}
          ayuda={asignacionTexto}
        />
        <TarjetaResumen
          titulo="Nombre visible"
          valor={formulario.nombre?.trim() || 'Nombre pendiente'}
          ayuda="Así se verá en catálogo, perfil y seguimiento."
        />
        <TarjetaResumen titulo="Meta esperada" valor={metaTexto} ayuda={frecuenciaAyuda} />
      </div>

      <div className="rounded-[22px] border border-dashed border-slate-300 px-4 py-4 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="mt-0.5 text-slate-500 dark:text-slate-400" size={18} />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Qué pasará al guardar</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              El KPI se sembrará en el sistema y luego podrás revisarlo directamente desde Seguimiento KPI.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function CrearKpiWizard({
  centro,
  directorio,
  onVolver,
  onGuardar,
  guardando = false,
  textos,
}) {
  const [pasoActual, setPasoActual] = useState(1)
  const [errores, setErrores] = useState({})
  const [tipoAsignacion, setTipoAsignacion] = useState('puesto')
  const [formulario, setFormulario] = useState({
    puesto_id: '',
    empleado_id: '',
    nombre: '',
    descripcion: '',
    formula: '',
    frecuencia: 'Semanal',
    meta_valor: '',
    unidad: '%',
  })

  const puestosDisponibles = centro?.gestion?.puestos_disponibles ?? []
  const empleadosDisponibles = directorio?.empleados ?? []
  const frecuenciasDisponibles = centro?.gestion?.frecuencias ?? ['Diario', 'Semanal', 'Mensual']
  const unidadesDisponibles = centro?.gestion?.unidades ?? ['%', 'USD', 'pedidos', 'tickets']

  const puestoSeleccionado = useMemo(
    () => puestosDisponibles.find((puesto) => Number(puesto.id) === Number(formulario.puesto_id)),
    [formulario.puesto_id, puestosDisponibles],
  )

  const empleadoSeleccionado = useMemo(
    () => empleadosDisponibles.find((empleado) => Number(empleado.id) === Number(formulario.empleado_id)),
    [empleadosDisponibles, formulario.empleado_id],
  )

  function actualizar(campo, valor) {
    setFormulario((previo) => ({ ...previo, [campo]: valor }))
    if (errores[campo]) {
      setErrores((previo) => ({ ...previo, [campo]: null }))
    }
  }

  function validarPasoActual() {
    const nuevosErrores = {}
    let esValido = true

    if (pasoActual === 1) {
      if (tipoAsignacion === 'puesto' && !formulario.puesto_id) {
        nuevosErrores.puesto_id = 'Debes seleccionar un puesto.'
        esValido = false
      }

      if (tipoAsignacion === 'empleado' && !formulario.empleado_id) {
        nuevosErrores.empleado_id = 'Debes seleccionar un empleado.'
        esValido = false
      }
    }

    if (pasoActual === 2 && !formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del KPI es obligatorio.'
      esValido = false
    }

    if (pasoActual === 3 && !formulario.meta_valor) {
      nuevosErrores.meta_valor = 'Debes establecer una meta numérica.'
      esValido = false
    }

    setErrores(nuevosErrores)
    return esValido
  }

  function manejarSiguiente() {
    if (validarPasoActual() && pasoActual < PASOS.length) {
      setPasoActual((actual) => actual + 1)
    }
  }

  function manejarAnterior() {
    if (pasoActual > 1) {
      setPasoActual((actual) => actual - 1)
    }
  }

  async function manejarGuardar() {
    if (!validarPasoActual()) return

    await onGuardar({
      ...formulario,
      puesto_id: tipoAsignacion === 'puesto' ? Number(formulario.puesto_id) : null,
      empleado_id: tipoAsignacion === 'empleado' ? Number(formulario.empleado_id) : null,
      meta_valor: formulario.meta_valor === '' ? null : Number(formulario.meta_valor),
    })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            {textos.crearKpiRapido}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Construir KPI operativo
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Crea el KPI con una secuencia guiada y deja listo su seguimiento para revisión inmediata.
          </p>
        </div>

        <button
          onClick={onVolver}
          className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_340px]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 md:flex-nowrap md:gap-4">
            {PASOS.map((paso) => {
              const Icono = paso.icono
              const activo = pasoActual === paso.id
              const completado = pasoActual > paso.id

              return (
                <div
                  key={paso.id}
                  className={`flex flex-1 items-center gap-4 rounded-3xl border p-4 transition-all duration-300 ${
                    activo
                      ? 'border-cyan-300 bg-white shadow-soft dark:border-cyan-700 dark:bg-slate-900'
                      : completado
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                        : 'border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-950/50'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                      activo
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                        : completado
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400 dark:bg-slate-800'
                    }`}
                  >
                    {completado ? <CheckCircle2 size={24} /> : <Icono size={20} />}
                  </div>

                  <div className="hidden min-w-0 sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Paso {paso.id}
                    </p>
                    <p className={`text-sm font-bold ${activo || completado ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                      {paso.titulo}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{paso.subtitulo}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-[34px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:p-10">
            {pasoActual === 1 ? (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    Define a quién aplica este KPI
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Usa una asignación general por puesto o crea un indicador individual para seguimiento puntual.
                  </p>
                </div>

                <div className="mx-auto max-w-2xl space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setTipoAsignacion('puesto')}
                      className={`rounded-[24px] border p-5 text-left transition ${
                        tipoAsignacion === 'puesto'
                          ? 'border-cyan-300 bg-cyan-50 shadow-soft dark:border-cyan-700 dark:bg-cyan-950/20'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm dark:bg-slate-900 dark:text-cyan-300">
                          <Briefcase size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-black text-slate-950 dark:text-white">Asignar por puesto</p>
                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Ideal para estándares comunes del área o rol.
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipoAsignacion('empleado')}
                      className={`rounded-[24px] border p-5 text-left transition ${
                        tipoAsignacion === 'empleado'
                          ? 'border-cyan-300 bg-cyan-50 shadow-soft dark:border-cyan-700 dark:bg-cyan-950/20'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm dark:bg-slate-900 dark:text-cyan-300">
                          <User size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-black text-slate-950 dark:text-white">Asignar a una empleada</p>
                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Úsalo cuando necesites medir un objetivo particular.
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {tipoAsignacion === 'puesto' ? (
                    <SelectCustom
                      label="Puesto general asignado"
                      valor={formulario.puesto_id}
                      onChange={(valor) => actualizar('puesto_id', valor)}
                      error={errores.puesto_id}
                      opciones={puestosDisponibles.map((puesto) => ({
                        valor: puesto.id,
                        etiqueta: `${puesto.nombre} · ${puesto.departamento}`,
                      }))}
                    />
                  ) : (
                    <SelectCustom
                      label="Empleado específico asignado"
                      valor={formulario.empleado_id}
                      onChange={(valor) => actualizar('empleado_id', valor)}
                      error={errores.empleado_id}
                      opciones={empleadosDisponibles.map((empleado) => ({
                        valor: empleado.id,
                        etiqueta: `${empleado.nombre_completo} · ${empleado.puesto_principal?.nombre ?? 'Sin puesto'}`,
                      }))}
                    />
                  )}

                  <div className="rounded-[18px] border border-cyan-100 bg-cyan-50/50 p-4 dark:border-cyan-900/30 dark:bg-cyan-950/20">
                    <p className="text-xs font-semibold leading-5 text-cyan-800 dark:text-cyan-300">
                      {tipoAsignacion === 'puesto'
                        ? 'Cuando asignas por puesto, el KPI se replica a quienes ocupan ese rol y mantiene coherencia operativa entre colaboradores.'
                        : 'Cuando asignas a una empleada, el KPI queda individualizado y aparecerá solo en su flujo de seguimiento.'}
                    </p>
                  </div>

                  {tipoAsignacion === 'empleado' && empleadoSeleccionado ? (
                    <div className="rounded-[18px] border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                      <p className="text-xs font-semibold leading-5 text-amber-800 dark:text-amber-300">
                        Se creará un KPI específico para {empleadoSeleccionado.nombre_completo} y luego podrás validarlo desde Seguimiento KPI.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {pasoActual === 2 ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    Define el KPI con claridad
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Un nombre breve y una descripción precisa ayudan a que el seguimiento sea más consistente.
                  </p>
                </div>

                <div className="space-y-6">
                  <InputCustom
                    label="Nombre del KPI"
                    valor={formulario.nombre}
                    onChange={(valor) => actualizar('nombre', valor)}
                    error={errores.nombre}
                    placeholder="Ej. Cumplimiento de pedidos despachados"
                  />

                  <TextareaCustom
                    label="Descripción y propósito"
                    valor={formulario.descripcion}
                    onChange={(valor) => actualizar('descripcion', valor)}
                    placeholder="Describe qué se mide, cómo debe interpretarse y por qué es importante para la operación..."
                    rows={4}
                  />

                  <div className="rounded-[22px] border border-dashed border-slate-300 p-4 dark:border-slate-700">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Recomendación
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Procura que el nombre responda a “qué medimos” y la descripción a “cómo se interpreta”. Eso evita ambigüedad en perfil, catálogo y seguimiento.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {pasoActual === 3 ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    Activa la lógica de seguimiento
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Esta configuración definirá cómo aparecerá el KPI dentro de la rutina operativa.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <SelectCustom
                    label="Frecuencia de evaluación"
                    valor={formulario.frecuencia}
                    onChange={(valor) => actualizar('frecuencia', valor)}
                    opciones={frecuenciasDisponibles.map((frecuencia) => ({
                      valor: frecuencia,
                      etiqueta: frecuencia,
                    }))}
                  />

                  <SelectCustom
                    label="Unidad de medida"
                    valor={formulario.unidad}
                    onChange={(valor) => actualizar('unidad', valor)}
                    opciones={unidadesDisponibles.map((unidad) => ({
                      valor: unidad,
                      etiqueta: unidad,
                    }))}
                  />

                  <div className="sm:col-span-2">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <InputCustom
                        label="Fórmula de cálculo (opcional)"
                        valor={formulario.formula}
                        onChange={(valor) => actualizar('formula', valor)}
                        placeholder="Ej. (Despachos correctos / Total despachos) * 100"
                      />

                      <InputCustom
                        label="Meta esperada"
                        tipo="number"
                        valor={formulario.meta_valor}
                        onChange={(valor) => actualizar('meta_valor', valor)}
                        error={errores.meta_valor}
                        placeholder={`Ej. 95${formulario.unidad === '%' ? '' : ` ${formulario.unidad}`}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/70 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                    Cierre del flujo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-900 dark:text-emerald-200">
                    Al guardar, el KPI quedará disponible en el catálogo y sus seguimientos operativos podrán revisarse de inmediato desde el módulo de Seguimiento KPI.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
              <button
                type="button"
                onClick={manejarAnterior}
                disabled={pasoActual === 1 || guardando}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Atrás
              </button>

              {pasoActual < PASOS.length ? (
                <button
                  type="button"
                  onClick={manejarSiguiente}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-6 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 dark:bg-cyan-500 dark:text-slate-950 hover:dark:bg-cyan-400"
                >
                  Siguiente
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={manejarGuardar}
                  disabled={guardando}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/40 disabled:opacity-50"
                >
                  {guardando ? (
                    'Guardando...'
                  ) : (
                    <>
                      <Save size={18} />
                      Crear y revisar seguimiento
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <TarjetaResumenFlujo
          textos={textos}
          pasoActual={pasoActual}
          formulario={formulario}
          tipoAsignacion={tipoAsignacion}
          puestoSeleccionado={puestoSeleccionado}
          empleadoSeleccionado={empleadoSeleccionado}
        />
      </div>
    </div>
  )
}
