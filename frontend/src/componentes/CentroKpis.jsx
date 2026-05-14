import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckSquare,
  DatabaseZap,
  Gauge,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

function TarjetaResumen({ titulo, valor, descripcion, icono: Icono, variante = 'normal' }) {
  return (
    <article
      className={`rounded-[26px] border p-5 shadow-soft transition ${
        variante === 'principal'
          ? 'border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:border-cyan-900/50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-blue-950/10'
          : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
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

function formatearMeta(valor, unidad) {
  if (valor === null || valor === undefined) return '-'
  return unidad === '%' ? `${valor}%` : `${valor} ${unidad ?? ''}`.trim()
}

function EtiquetaAsignacion({ item }) {
  const esIndividual = item.tipo_asignacion === 'empleado'

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
        esIndividual
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
          : 'bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      {esIndividual ? 'Individual' : 'Por puesto'}
    </span>
  )
}

function Tabs({ items, activo, onCambiar }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onCambiar(item.id)}
          className={[
            'rounded-full px-4 py-2 text-sm font-bold transition',
            activo === item.id
              ? 'bg-slate-900 text-white shadow-md dark:bg-cyan-500 dark:text-slate-950'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
          ].join(' ')}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function TarjetaCatalogo({ item, textos }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">{item.nombre}</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {item.puesto} · {item.departamento}
            {item.empleado ? ` · ${item.empleado}` : ''}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
            {item.frecuencia}
          </span>
          <EtiquetaAsignacion item={item} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.descripcion}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
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
        <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Registros
          </p>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{item.registros}</p>
        </div>
      </div>

      <div className="mt-4">
        <BarraCumplimiento valor={item.promedio} />
      </div>

      <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <span className="font-bold">Formula:</span> {item.formula}
      </div>
    </article>
  )
}

function TarjetaAlerta({ titulo, cantidad, items = [], renderItem }) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {titulo}
          </p>
          <strong className="mt-2 block text-3xl font-black text-slate-950 dark:text-white">{cantidad}</strong>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
            Sin novedades en este bloque.
          </div>
        ) : (
          items.map(renderItem)
        )}
      </div>
    </article>
  )
}

function SeccionFocoAdmin({
  centro,
  textos,
  resumenes,
  catalogoOrdenado,
  onAbrirWizard,
  onAbrirSugeridos,
}) {
  const principales = resumenes.slice(0, 2)
  const secundarios = resumenes.slice(2)

  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <TarjetaResumen {...principales[0]} variante="principal" />
          <div className="grid gap-5 md:grid-cols-2">
            {secundarios.map((item) => (
              <TarjetaResumen key={item.titulo} {...item} />
            ))}
          </div>
        </div>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Plus size={18} />
            </span>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Crear Nuevo KPI
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Crea indicadores nuevos sin salir del flujo de gestión.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAbrirWizard}
            className="group mt-5 flex w-full items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/20"
          >
            <div className="text-left">
              <p className="font-bold text-slate-950 dark:text-white">Iniciar asistente rápido</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Nombre, meta, frecuencia y puesto en pocos pasos.
              </p>
            </div>
            <ArrowRight
              size={20}
              className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
            />
          </button>

          <button
            type="button"
            onClick={onAbrirSugeridos}
            className="mt-3 inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Sparkles size={16} />
            {textos.abrirKpisSugeridos}
          </button>

          <div className="mt-6 rounded-[24px] border border-amber-100 bg-amber-50/80 p-5 dark:border-amber-950/40 dark:bg-amber-950/10">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                <AlertTriangle size={18} />
              </span>
              <div>
                <p className="font-bold text-slate-950 dark:text-white">Lectura rápida</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {centro.brechas.puestos_sin_kpi.length} puestos sin KPI y {centro.brechas.kpis_bajo_objetivo.length} indicadores por debajo del umbral.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Gauge size={18} />
            </span>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.focoGeneral}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Los KPIs con mejor lectura para esta semana.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {catalogoOrdenado.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.nombre}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.puesto} · {item.departamento}
                    </p>
                  </div>
                  <span className="text-2xl font-black text-cyan-700 dark:text-cyan-300">{item.promedio}%</span>
                </div>
                <div className="mt-4">
                  <BarraCumplimiento valor={item.promedio} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <BarChart3 size={18} />
            </span>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.distribucionPorArea}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Cobertura resumida por departamento.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {centro.distribucion_departamentos.slice(0, 6).map((item) => (
              <div key={item.departamento}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.departamento}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.total_kpis} KPIs</p>
                  </div>
                  <span className="font-black text-cyan-700 dark:text-cyan-300">{item.promedio}%</span>
                </div>
                <BarraCumplimiento valor={item.promedio} />
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

function SeccionCatalogo({ catalogoOrdenado, textos }) {
  return (
    <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          <DatabaseZap size={18} />
        </span>
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.catalogoKpis}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Un KPI por tarjeta, con contexto suficiente pero sin ruido.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {catalogoOrdenado.map((item) => (
          <TarjetaCatalogo key={item.id} item={item} textos={textos} />
        ))}
      </div>
    </section>
  )
}

function SeccionEquipo({ centro, textos }) {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
            <TrendingUp size={18} />
          </span>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.rendimientoEquipo}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ranking resumido con foco en desempeño promedio.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {centro.rendimiento_empleados.slice(0, 8).map((item) => (
            <div key={item.id}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{item.nombre}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.puesto} · {item.departamento}</p>
                </div>
                <span className="font-black text-cyan-700 dark:text-cyan-300">{item.promedio}%</span>
              </div>
              <BarraCumplimiento valor={item.promedio} />
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
            <Target size={18} />
          </span>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.distribucionPorArea}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Vista compacta del reparto KPI por área.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {centro.distribucion_departamentos.map((item) => (
            <div key={item.departamento}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{item.departamento}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.total_kpis} KPIs</p>
                </div>
                <span className="font-black text-cyan-700 dark:text-cyan-300">{item.promedio}%</span>
              </div>
              <BarraCumplimiento valor={item.promedio} />
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

function SeccionAlertas({ centro, textos }) {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <TarjetaAlerta
        titulo={textos.puestosSinKpi}
        cantidad={centro.brechas.puestos_sin_kpi.length}
        items={centro.brechas.puestos_sin_kpi}
        renderItem={(item) => (
          <div key={`${item.departamento}-${item.puesto}`} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950/50">
            <p className="font-bold text-slate-900 dark:text-white">{item.puesto}</p>
            <p className="text-slate-600 dark:text-slate-300">{item.departamento}</p>
          </div>
        )}
      />

      <TarjetaAlerta
        titulo={textos.kpisBajoObjetivo}
        cantidad={centro.brechas.kpis_bajo_objetivo.length}
        items={centro.brechas.kpis_bajo_objetivo}
        renderItem={(item) => (
          <div key={`${item.departamento}-${item.nombre}`} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950/50">
            <div className="flex items-center justify-between gap-4">
              <p className="font-bold text-slate-900 dark:text-white">{item.nombre}</p>
              <span className="font-black text-amber-600 dark:text-amber-300">{item.promedio}%</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">{item.puesto} · {item.departamento}</p>
          </div>
        )}
      />
    </section>
  )
}

function SeccionEmpleado({ centro, textos, resumenes, onAbrirSeguimiento }) {
  const kpisVisibles = centro.mi_panel?.kpis ?? []

  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[30px] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6 shadow-soft dark:border-cyan-900/50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-blue-950/10">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm dark:bg-slate-900 dark:text-cyan-300">
              <Target size={18} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
                Vista operativa
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {kpisVisibles.length} {kpisVisibles.length === 1 ? 'KPI visible' : 'KPIs visibles'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Aquí ves solo los indicadores que realmente forman parte de tu trabajo diario, sin repetir el catálogo general.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-white/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Enfoque de esta vista
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              Revisa tus KPIs, identifica qué requiere atención y usa el botón de seguimiento para registrar avance sin salirte del flujo.
            </p>
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckSquare size={18} />
            </span>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.focoOperativo}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Tu registro diario debe estar a un clic, sin perderte entre reportes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAbrirSeguimiento}
            className="group mt-5 flex w-full items-center justify-between rounded-[24px] border border-cyan-200 bg-cyan-50 p-5 transition hover:border-cyan-300 hover:bg-cyan-100/70 dark:border-cyan-900/40 dark:bg-cyan-950/20 dark:hover:border-cyan-800"
          >
            <div className="text-left">
              <p className="font-bold text-slate-950 dark:text-white">{textos.abrirSeguimientoKpis}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Registra avances, marca checks y deja contexto en segundos.
              </p>
            </div>
            <ArrowRight
              size={20}
              className="text-cyan-700 transition group-hover:translate-x-1 dark:text-cyan-300"
            />
          </button>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {resumenes.slice(1).map((item) => (
              <TarjetaResumen key={item.titulo} {...item} />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Target size={18} />
            </span>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Mis KPIs
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tus indicadores visibles sin mezclarte con el resto del sistema.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {kpisVisibles.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                {textos.sinKpisVisiblesPerfil}
              </div>
            ) : (
              kpisVisibles.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{item.nombre}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.descripcion}</p>
                    </div>
                    <span className="font-black text-cyan-700 dark:text-cyan-300">{item.promedio}%</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{item.frecuencia}</span>
                    <span>{formatearMeta(item.meta_valor, item.unidad)}</span>
                  </div>
                  <div className="mt-3">
                    <EtiquetaAsignacion item={item} />
                  </div>
                  <div className="mt-3">
                    <BarraCumplimiento valor={item.promedio} />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

export function CentroKpis({
  centro,
  textos,
  onAbrirSeguimiento,
  onAbrirSugeridos,
  onAbrirWizard,
  puedeGestionar = false,
  modo = 'admin',
}) {
  const catalogoOrdenado = useMemo(() => {
    return [...(centro.catalogo ?? [])].sort((a, b) => (b.promedio ?? 0) - (a.promedio ?? 0))
  }, [centro.catalogo])

  const esEmpleado = modo === 'empleado'
  const departamentosVisibles = centro.alcance?.departamentos ?? []
  const puestosVisibles = centro.alcance?.puestos ?? []
  const tabs = esEmpleado
    ? [
        { id: 'operativo', label: textos.tabVistaOperativa },
        { id: 'catalogo', label: textos.tabCatalogo },
      ]
    : [
        { id: 'general', label: textos.tabVistaGeneral },
        { id: 'catalogo', label: textos.tabCatalogo },
        { id: 'equipo', label: textos.tabEquipo },
        { id: 'alertas', label: textos.tabAlertas },
      ]
  const [tabActiva, setTabActiva] = useState(tabs[0].id)

  const resumenes = [
    {
      titulo: textos.totalKpis,
      valor: centro.resumen.total_kpis,
      descripcion: textos.catalogoKpis,
      icono: DatabaseZap,
    },
    {
      titulo: textos.promedioGlobal,
      valor: `${centro.resumen.promedio_global}%`,
      descripcion: textos.rendimientoEquipo,
      icono: Gauge,
    },
    {
      titulo: textos.empleadosConKpi,
      valor: centro.resumen.empleados_con_kpi,
      descripcion: textos.actividadKpi,
      icono: Users,
    },
    {
      titulo: textos.seguimientosPendientes,
      valor: centro.resumen.seguimientos_pendientes,
      descripcion: textos.seguimientoOperativo,
      icono: CheckSquare,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            {textos.centroKpisSubtitulo}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.navKpis}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {esEmpleado
              ? 'Espacio claro para revisar tus indicadores y registrar avances sin saturación.'
              : 'Panel de KPIs organizado por secciones para que puedas leer, actuar y crear sin perderte.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAbrirSeguimiento}
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            {textos.abrirSeguimientoKpis}
            <ArrowRight size={16} />
          </button>

          {puedeGestionar ? (
            <button
              type="button"
              onClick={onAbrirWizard}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Plus size={16} />
              {textos.crearKpiRapido}
            </button>
          ) : null}
        </div>
      </div>

      <section
        className={`rounded-[28px] border p-5 shadow-soft ${
          esEmpleado
            ? 'border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 dark:border-cyan-900/60 dark:from-cyan-950/30 dark:via-slate-900 dark:to-blue-950/20'
            : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {esEmpleado ? 'Alcance visible' : 'Navegación'}
            </p>
            <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">
              {esEmpleado ? 'Tus KPIs y tu contexto operativo' : 'Centro completo de KPIs'}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {esEmpleado
                ? 'Aquí solo ves indicadores asignados directamente a ti o relacionados con las áreas donde participas.'
                : 'Usa las pestañas para ver primero lo importante y dejar el detalle para cuando realmente lo necesites.'}
            </p>
          </div>

          {esEmpleado ? (
            <div className="flex max-w-xl flex-wrap gap-2">
              {departamentosVisibles.map((item) => (
                <span
                  key={`departamento-${item}`}
                  className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 shadow-sm dark:bg-slate-950 dark:text-cyan-300"
                >
                  {item}
                </span>
              ))}
              {puestosVisibles.map((item) => (
                <span
                  key={`puesto-${item}`}
                  className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white dark:bg-cyan-500 dark:text-slate-950"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <Tabs items={tabs} activo={tabActiva} onCambiar={setTabActiva} />
        </div>
      </section>

      {esEmpleado ? (
        <>
          {tabActiva === 'operativo' ? (
            <SeccionEmpleado
              centro={centro}
              textos={textos}
              resumenes={resumenes}
              onAbrirSeguimiento={onAbrirSeguimiento}
            />
          ) : null}
          {tabActiva === 'catalogo' ? <SeccionCatalogo catalogoOrdenado={catalogoOrdenado} textos={textos} /> : null}
        </>
      ) : (
        <>
          {tabActiva === 'general' ? (
            <SeccionFocoAdmin
              centro={centro}
              textos={textos}
              resumenes={resumenes}
              catalogoOrdenado={catalogoOrdenado}
              onAbrirWizard={onAbrirWizard}
              onAbrirSugeridos={onAbrirSugeridos}
            />
          ) : null}
          {tabActiva === 'catalogo' ? <SeccionCatalogo catalogoOrdenado={catalogoOrdenado} textos={textos} /> : null}
          {tabActiva === 'equipo' ? <SeccionEquipo centro={centro} textos={textos} /> : null}
          {tabActiva === 'alertas' ? <SeccionAlertas centro={centro} textos={textos} /> : null}
        </>
      )}
    </div>
  )
}
