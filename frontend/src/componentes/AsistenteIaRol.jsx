import { useEffect, useMemo, useState } from 'react'
import {
  Bot,
  FileText,
  MessageSquareText,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { consultarAsistenteIaRol } from '../servicios/api'

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

function crearMensajeBienvenida(textos) {
  return {
    id: 'bienvenida',
    tipo: 'assistant',
    contenido: textos.bienvenidaIa,
    fuentes: [],
  }
}

export function AsistenteIaRol({ asistente, textos, idioma }) {
  const [rolActivoId, setRolActivoId] = useState(asistente.roles?.[0]?.id ?? null)
  const [pregunta, setPregunta] = useState('')
  const [mensajes, setMensajes] = useState([crearMensajeBienvenida(textos)])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setMensajes([crearMensajeBienvenida(textos)])
  }, [textos.bienvenidaIa])

  useEffect(() => {
    setMensajes([crearMensajeBienvenida(textos)])
    setPregunta('')
  }, [rolActivoId])

  const rolActivo =
    (asistente.roles ?? []).find((rol) => rol.id === rolActivoId) ?? asistente.roles?.[0] ?? null

  useEffect(() => {
    if (!rolActivo && asistente.roles?.length) {
      setRolActivoId(asistente.roles[0].id)
    }
  }, [rolActivo, asistente.roles])

  const ultimaRespuesta = useMemo(() => {
    return [...mensajes].reverse().find((mensaje) => mensaje.tipo === 'assistant' && mensaje.fuentes)
  }, [mensajes])

  const resumenes = [
    {
      titulo: textos.rolesDisponibles,
      valor: asistente.resumen.roles_disponibles,
      descripcion: textos.seleccionarRolIa,
      icono: Bot,
    },
    {
      titulo: textos.consultasSugeridasResumen,
      valor: asistente.resumen.consultas_sugeridas,
      descripcion: textos.preguntasSugeridas,
      icono: MessageSquareText,
    },
    {
      titulo: textos.modoControlado,
      valor: textos.demoOperativa,
      descripcion: textos.responderSoloManual,
      icono: ShieldCheck,
    },
    {
      titulo: textos.coberturaIa,
      valor: textos.asistenteIa,
      descripcion: asistente.resumen.cobertura,
      icono: Sparkles,
    },
  ]

  async function enviarConsulta(textoPregunta) {
    const texto = textoPregunta.trim()
    if (!texto || !rolActivo || cargando) {
      return
    }

    const mensajeUsuario = {
      id: `user-${Date.now()}`,
      tipo: 'user',
      contenido: texto,
    }

    setMensajes((actual) => [...actual, mensajeUsuario])
    setPregunta('')
    setCargando(true)

    try {
      const respuesta = await consultarAsistenteIaRol({
        puestoId: rolActivo.id,
        pregunta: texto,
        idioma,
      })

      setMensajes((actual) => [
        ...actual,
        {
          id: `assistant-${Date.now()}`,
          tipo: 'assistant',
          contenido: respuesta.respuesta,
          fuentes: respuesta.fuentes ?? [],
          siguientesPreguntas: respuesta.siguientes_preguntas ?? [],
        },
      ])
    } catch (error) {
      setMensajes((actual) => [
        ...actual,
        {
          id: `assistant-error-${Date.now()}`,
          tipo: 'assistant',
          contenido: error.message,
          fuentes: [],
        },
      ])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
          {textos.iaRolSubtitulo}
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          {textos.navIa}
        </h2>
      </div>

      <section className="grid gap-5 xl:grid-cols-4 md:grid-cols-2">
        {resumenes.map((item) => (
          <TarjetaResumen key={item.titulo} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.rolesDisponibles}
              </h3>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {asistente.roles.length}
              </span>
            </div>

            <div className="space-y-3">
              {asistente.roles.map((rol) => (
                <button
                  key={rol.id}
                  type="button"
                  onClick={() => setRolActivoId(rol.id)}
                  className={[
                    'w-full rounded-[24px] border p-4 text-left transition',
                    rol.id === rolActivo?.id
                      ? 'border-cyan-300 bg-cyan-50 ring-2 ring-cyan-100 dark:border-cyan-700 dark:bg-cyan-950/30'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{rol.nombre}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {rol.departamento} · {rol.nivel}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {textos.perfil}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {rol.resumen}
                  </p>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.alcanceAsistente}
            </h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="font-bold text-slate-950 dark:text-white">{asistente.alcance.titulo}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {asistente.alcance.descripcion}
                </p>
              </div>
              <div className="rounded-[22px] border border-dashed border-cyan-300 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950/20">
                <p className="text-sm leading-6 text-cyan-900 dark:text-cyan-200">
                  {asistente.alcance.regla}
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-5">
          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {textos.chatRol}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {rolActivo
                    ? `${rolActivo.nombre} · ${rolActivo.departamento}`
                    : textos.sinRolSeleccionado}
                </p>
              </div>
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                {textos.responderSoloManual}
              </span>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {(rolActivo?.preguntas_sugeridas ?? []).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => enviarConsulta(item)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="min-h-[340px] space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={[
                    'flex gap-3',
                    mensaje.tipo === 'user' ? 'justify-end' : 'justify-start',
                  ].join(' ')}
                >
                  {mensaje.tipo === 'assistant' ? (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
                      <Bot size={18} />
                    </span>
                  ) : null}

                  <div
                    className={[
                      'max-w-[78%] whitespace-pre-line rounded-[22px] px-4 py-3 text-sm leading-7 shadow-sm',
                      mensaje.tipo === 'assistant'
                        ? 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                        : 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950',
                    ].join(' ')}
                  >
                    {mensaje.contenido}
                  </div>

                  {mensaje.tipo === 'user' ? (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-slate-700">
                      <UserRound size={18} />
                    </span>
                  ) : null}
                </div>
              ))}

              {cargando ? (
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <Sparkles size={16} className="animate-pulse" />
                  <span>{textos.pensandoIa}</span>
                </div>
              ) : null}
            </div>

            <form
              className="mt-5 flex gap-3"
              onSubmit={(evento) => {
                evento.preventDefault()
                enviarConsulta(pregunta)
              }}
            >
              <input
                value={pregunta}
                onChange={(evento) => setPregunta(evento.target.value)}
                disabled={!rolActivo || cargando}
                placeholder={textos.placeholderPregunta}
                className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
              />
              <button
                type="submit"
                disabled={!rolActivo || cargando || !pregunta.trim()}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SendHorizontal size={16} />
                {textos.enviarPregunta}
              </button>
            </form>
          </article>

          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <FileText size={18} />
              </span>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {textos.fuentesConsultadas}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{textos.manualResumen}</p>
              </div>
            </div>

            {!ultimaRespuesta?.fuentes?.length ? (
              <p className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                {textos.sinFuentes}
              </p>
            ) : (
              <div className="space-y-3">
                {ultimaRespuesta.fuentes.map((fuente, indice) => (
                  <div
                    key={`${fuente.origen}-${indice}`}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {fuente.origen}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {fuente.texto}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  )
}
