import { useEffect, useMemo, useState } from 'react'
import { Avatar, ConfigProvider, theme as antdTheme } from 'antd'
import './App.css'
import { AsistenteIaRol } from './componentes/AsistenteIaRol'
import { CentroKpis } from './componentes/CentroKpis'
import { DirectorioEmpleados } from './componentes/DirectorioEmpleados'
import { Layout } from './componentes/Layout'
import { KpisSugeridos } from './componentes/KpisSugeridos'
import { Organigrama } from './componentes/Organigrama'
import { PanelPerfil } from './componentes/PanelPerfil'
import { PerfilTalento } from './componentes/PerfilTalento'
import { SeguimientoKpis } from './componentes/SeguimientoKpis'
import {
  obtenerAsistenteIaRol,
  obtenerCentroKpis,
  obtenerDirectorioEmpleados,
  obtenerOrganigrama,
  obtenerPanelGeneral,
  obtenerPerfilTalento,
} from './servicios/api'
import {
  localizarAsistenteIaRol,
  localizarCentroKpis,
  localizarDirectorioEmpleados,
  localizarPanelGeneral,
  localizarPerfilTalento,
  traducciones,
} from './traducciones'

function TarjetaResumen({ item }) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-soft transition dark:border-slate-800 dark:bg-slate-900">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {item.titulo}
      </span>
      <strong className="mt-4 block text-4xl font-black tracking-tight text-slate-950 dark:text-white">
        {item.valor}
      </strong>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detalle}</p>
      <small className="mt-4 block font-semibold text-cyan-700 dark:text-cyan-300">
        {item.tendencia}
      </small>
    </article>
  )
}

function VistaDashboard({ panel, textos }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
          {textos.vistaDashboard}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          {textos.navDashboard}
        </h2>
      </div>

      <section className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        {panel.resumen.map((item) => (
          <TarjetaResumen key={item.id} item={item} />
        ))}
      </section>

      <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr_1.2fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {textos.empresa}
            </span>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {panel.empresa.nombre}
            </h3>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {textos.industria}
            </span>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {panel.empresa.industria}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {textos.objetivo}
            </span>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {panel.empresa.objetivo}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.departamentos}
            </h3>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {panel.departamentos.length} {textos.listo}
            </span>
          </div>

          <div className="space-y-4">
            {panel.departamentos.map((departamento) => (
              <div
                key={departamento.nombre}
                className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 xl:flex-row xl:justify-between"
              >
                <div>
                  <h4 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                    {departamento.nombre}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {textos.lider}: {departamento.lider || 'N/A'}
                  </p>
                </div>

                <div className="xl:max-w-xs">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {textos.estado}
                  </span>
                  <p className="mt-2 font-bold text-slate-950 dark:text-white">
                    {departamento.estado}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-cyan-700 dark:text-cyan-300">
                    {departamento.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.puestos}
            </h3>
          </div>

          {panel.puestos_destacados.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
              {textos.sinKpis}
            </div>
          ) : (
            <div className="space-y-4">
              {panel.puestos_destacados.slice(0, 6).map((puesto) => (
                <div
                  key={puesto.nombre}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <h4 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                    {puesto.nombre}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {textos.supervisor}: {puesto.supervisor}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {textos.kpiPrincipal}: {puesto.kpi_principal}
                  </p>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <span>{textos.progreso}</span>
                      <span>{puesto.progreso}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        style={{ width: `${puesto.progreso}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {textos.frecuencia}: {puesto.frecuencia}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.alertas}
          </h3>
          <ul className="mt-5 space-y-4 pl-5 text-sm leading-7 text-slate-700 dark:text-slate-300">
            {panel.alertas.map((alerta) => (
              <li key={alerta}>{alerta}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.asistenteIa}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
            {panel.asistente_ia.capacidad}
          </p>
          <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {panel.asistente_ia.estado}
            </p>
            <p className="mt-1 font-black tracking-tight text-slate-950 dark:text-white">
              {panel.asistente_ia.rol_activo}
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}

function VistaOrganigrama({ organigrama, textos, idioma, alSeleccionar }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
          {textos.vistaOrganigrama}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          {textos.navOrganigrama}
        </h2>
      </div>

      <Organigrama
        nodos={organigrama}
        textos={textos}
        idioma={idioma}
        alSeleccionar={alSeleccionar}
      />
    </div>
  )
}

function VistaPlaceholder({ titulo, descripcion, icono }) {
  return (
    <div className="rounded-[34px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
        <Avatar
          size={42}
          style={{ background: 'transparent', color: '#fff', fontWeight: 900 }}
        >
          {icono}
        </Avatar>
      </div>
      <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
        {titulo}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
        {descripcion}
      </p>
    </div>
  )
}

function App() {
  const [idioma, setIdioma] = useState('es')
  const [tema, setTema] = useState(() => localStorage.getItem('tema-delicore') ?? 'light')
  const [autenticado, setAutenticado] = useState(false)
  const [vistaActiva, setVistaActiva] = useState('dashboard')
  const [panel, setPanel] = useState(null)
  const [organigrama, setOrganigrama] = useState([])
  const [directorio, setDirectorio] = useState(null)
  const [perfilTalento, setPerfilTalento] = useState(null)
  const [centroKpis, setCentroKpis] = useState(null)
  const [asistenteIaRol, setAsistenteIaRol] = useState(null)
  const [empleadoSeleccionadoId, setEmpleadoSeleccionadoId] = useState(null)
  const [nodoActivo, setNodoActivo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const textos = traducciones[idioma]
  const esOscuro = tema === 'dark'
  const panelLocalizado = useMemo(() => localizarPanelGeneral(panel, idioma), [panel, idioma])
  const directorioLocalizado = useMemo(
    () => localizarDirectorioEmpleados(directorio, idioma),
    [directorio, idioma],
  )
  const perfilTalentoLocalizado = useMemo(
    () => localizarPerfilTalento(perfilTalento, idioma),
    [perfilTalento, idioma],
  )
  const centroKpisLocalizado = useMemo(
    () => localizarCentroKpis(centroKpis, idioma),
    [centroKpis, idioma],
  )
  const asistenteIaRolLocalizado = useMemo(
    () => localizarAsistenteIaRol(asistenteIaRol, idioma),
    [asistenteIaRol, idioma],
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', esOscuro)
    localStorage.setItem('tema-delicore', tema)
  }, [tema, esOscuro])

  useEffect(() => {
    if (!autenticado) {
      return
    }

    cargarDatos()
  }, [autenticado])

  useEffect(() => {
    if (!autenticado) {
      return
    }

    cargarAsistenteIa()
  }, [idioma])

  async function cargarDatos() {
    setCargando(true)
    setError('')

    try {
      const [
        datosPanel,
        datosOrganigrama,
        datosDirectorio,
        datosPerfilTalento,
        datosCentroKpis,
        datosAsistenteIa,
      ] =
        await Promise.all([
        obtenerPanelGeneral(),
        obtenerOrganigrama(),
        obtenerDirectorioEmpleados(),
        obtenerPerfilTalento(),
        obtenerCentroKpis(),
        obtenerAsistenteIaRol(idioma),
      ])

      setPanel(datosPanel)
      setOrganigrama(datosOrganigrama.organigrama ?? [])
      setDirectorio(datosDirectorio)
      setPerfilTalento(datosPerfilTalento)
      setCentroKpis(datosCentroKpis)
      setAsistenteIaRol(datosAsistenteIa)
      setEmpleadoSeleccionadoId(datosDirectorio?.empleados?.[0]?.id ?? null)
    } catch (nuevoError) {
      setError(nuevoError.message)
    } finally {
      setCargando(false)
    }
  }

  async function cargarAsistenteIa() {
    try {
      const datos = await obtenerAsistenteIaRol(idioma)
      setAsistenteIaRol(datos)
    } catch (nuevoError) {
      setError(nuevoError.message)
    }
  }

  function manejarIngreso(evento) {
    evento.preventDefault()
    setAutenticado(true)
  }

  function cambiarIdioma() {
    setIdioma((actual) => (actual === 'es' ? 'en' : 'es'))
  }

  function cerrarSesion() {
    setAutenticado(false)
    setVistaActiva('dashboard')
    setPanel(null)
    setOrganigrama([])
    setDirectorio(null)
    setPerfilTalento(null)
    setCentroKpis(null)
    setAsistenteIaRol(null)
    setEmpleadoSeleccionadoId(null)
    setNodoActivo(null)
    setError('')
  }

  function cambiarTema(evento) {
    const alternar = () => setTema((actual) => (actual === 'dark' ? 'light' : 'dark'))

    if (typeof document.startViewTransition !== 'function') {
      alternar()
      return
    }

    const x = `${evento.clientX}px`
    const y = `${evento.clientY}px`
    const radio = `${Math.hypot(window.innerWidth, window.innerHeight)}px`

    document.documentElement.style.setProperty('--vt-x', x)
    document.documentElement.style.setProperty('--vt-y', y)
    document.documentElement.style.setProperty('--vt-radio', radio)

    document.startViewTransition(() => {
      alternar()
    })
  }

  const temaAntd = {
    algorithm: esOscuro ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#0891b2',
      borderRadius: 18,
      fontFamily: "'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif",
      colorBgLayout: esOscuro ? '#020617' : '#f8fafc',
    },
  }

  if (!autenticado) {
    return (
      <ConfigProvider theme={temaAntd}>
        <main className="login-shell">
          <section className="login-hero">
            <div className="login-hero__contenido">
              <button
                className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg"
                type="button"
                onClick={cambiarIdioma}
              >
                {textos.cambiarIdioma}
              </button>

              <div className="mt-8">
                <span className="etiqueta-demo">{textos.etiquetaDemo}</span>
                <h1>{textos.tituloLogin}</h1>
                <p>{textos.descripcionLogin}</p>
              </div>

              <div className="login-hero__marca">
                <strong>{textos.marca}</strong>
                <span>{textos.subtituloMarca}</span>
              </div>
            </div>

            <form className="tarjeta-login" onSubmit={manejarIngreso}>
              <div className="tarjeta-login__encabezado">
                <span className="tarjeta-login__punto"></span>
                <p>{textos.accesoSimulado}</p>
              </div>

              <label className="campo-login">
                <span>{textos.correo}</span>
                <input defaultValue="superadmin@lasdelicias.demo" type="email" />
              </label>

              <label className="campo-login">
                <span>{textos.contrasena}</span>
                <input defaultValue="********" type="password" />
              </label>

              <button className="boton-login" type="submit">
                {textos.botonIngresar}
              </button>
            </form>
          </section>
        </main>
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider theme={temaAntd}>
      <Layout
        vistaActiva={vistaActiva}
        alCambiarVista={setVistaActiva}
        idioma={idioma}
        alCambiarIdioma={cambiarIdioma}
        tema={tema}
        alCambiarTema={cambiarTema}
        alCerrarSesion={cerrarSesion}
        textos={textos}
      >
        {cargando ? (
          <div className="estado-carga">{textos.cargando}</div>
        ) : null}

        {error ? (
          <div className="estado-carga flex items-center justify-between gap-4">
            <p>{textos.errorCarga}</p>
            <button className="boton-login-secundario" type="button" onClick={cargarDatos}>
              {textos.reintentar}
            </button>
          </div>
        ) : null}

        {panelLocalizado && !cargando && !error && vistaActiva === 'dashboard' ? (
          <VistaDashboard panel={panelLocalizado} textos={textos} />
        ) : null}

        {!cargando && !error && vistaActiva === 'organigrama' ? (
          <VistaOrganigrama
            organigrama={organigrama}
            textos={textos}
            idioma={idioma}
            alSeleccionar={setNodoActivo}
          />
        ) : null}

        {!cargando && !error && vistaActiva === 'directorio' && directorioLocalizado ? (
          <DirectorioEmpleados
            directorio={directorioLocalizado}
            textos={textos}
            idioma={idioma}
            empleadoSeleccionadoId={empleadoSeleccionadoId}
            onSeleccionarEmpleado={setEmpleadoSeleccionadoId}
            onAbrirPerfil={() => setVistaActiva('perfil')}
          />
        ) : null}

        {!cargando && !error && vistaActiva === 'perfil' && perfilTalentoLocalizado ? (
          <PerfilTalento
            perfil={perfilTalentoLocalizado}
            textos={textos}
            idioma={idioma}
            empleadoSeleccionadoId={empleadoSeleccionadoId}
            onSeleccionarEmpleado={setEmpleadoSeleccionadoId}
          />
        ) : null}

        {!cargando && !error && vistaActiva === 'kpis' && centroKpisLocalizado ? (
          <CentroKpis
            centro={centroKpisLocalizado}
            textos={textos}
            idioma={idioma}
            onAbrirSeguimiento={() => setVistaActiva('seguimiento-kpis')}
            onAbrirSugeridos={() => setVistaActiva('kpis-sugeridos')}
          />
        ) : null}

        {!cargando && !error && vistaActiva === 'seguimiento-kpis' && centroKpisLocalizado ? (
          <SeguimientoKpis
            centro={centroKpisLocalizado}
            textos={textos}
            idioma={idioma}
            onVolver={() => setVistaActiva('kpis')}
          />
        ) : null}

        {!cargando && !error && vistaActiva === 'kpis-sugeridos' && centroKpisLocalizado ? (
          <KpisSugeridos
            centro={centroKpisLocalizado}
            textos={textos}
            onVolver={() => setVistaActiva('kpis')}
          />
        ) : null}

        {!cargando && !error && vistaActiva === 'ia' && asistenteIaRolLocalizado ? (
          <AsistenteIaRol
            asistente={asistenteIaRolLocalizado}
            textos={textos}
            idioma={idioma}
          />
        ) : null}
      </Layout>

      <PanelPerfil
        nodo={nodoActivo}
        idioma={idioma}
        textos={textos}
        alCerrar={() => setNodoActivo(null)}
      />
    </ConfigProvider>
  )
}

export default App
