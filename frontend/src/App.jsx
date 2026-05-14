import { useEffect, useMemo, useState } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  ChartColumn,
  CircleAlert,
  CircleCheckBig,
  ClipboardList,
  Network,
  Users,
} from 'lucide-react'
import './App.css'
import { AsistenteIaRol } from './componentes/AsistenteIaRol'
import { CentroKpis } from './componentes/CentroKpis'
import { DirectorioEmpleados } from './componentes/DirectorioEmpleados'
import { EspacioEmpleado } from './componentes/EspacioEmpleado'
import { GestionUsuarios } from './componentes/GestionUsuarios'
import { Layout } from './componentes/Layout'
import { KpisSugeridos } from './componentes/KpisSugeridos'
import { Organigrama } from './componentes/Organigrama'
import { PanelPerfil } from './componentes/PanelPerfil'
import { PerfilEmpleado } from './componentes/PerfilEmpleado'
import { PerfilTalento } from './componentes/PerfilTalento'
import { SeguimientoKpis } from './componentes/SeguimientoKpis'
import { CrearKpiWizard } from './componentes/CrearKpiWizard'
import {
  actualizarEmpleadoAdmin,
  crearEmpleadoAdmin,
  crearKpi,
  obtenerAccesoDemo,
  obtenerAsistenteIaRol,
  obtenerCentroKpis,
  obtenerDirectorioEmpleados,
  obtenerGestionUsuarios,
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

const mapaIconosResumen = {
  empleados: Users,
  roles: BriefcaseBusiness,
  kpis: ChartColumn,
  seguimiento: ClipboardList,
  cumplimiento: CircleCheckBig,
}

function extraerPorcentaje(valor = '0%') {
  const coincidencia = String(valor).match(/\d+/)
  return Number(coincidencia?.[0] ?? 0)
}

function TarjetaResumen({ item }) {
  const Icono = mapaIconosResumen[item.id] ?? ChartColumn

  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            {item.titulo}
          </span>
          <strong className="mt-3 block text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            {item.valor}
          </strong>
        </div>

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          <Icono size={22} />
        </span>
      </div>

      <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-600 dark:text-slate-300">
        {item.detalle}
      </p>

      <div className="mt-4 rounded-2xl bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
        {item.tendencia}
      </div>
    </article>
  )
}

function TarjetaAccion({ icono: Icono, titulo, descripcion, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-[24px] border border-slate-200/80 bg-white/90 p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          <Icono size={20} />
        </span>
        <ArrowRight
          size={18}
          className="mt-1 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700 dark:group-hover:text-slate-200"
        />
      </div>
      <h3 className="mt-4 text-lg font-black tracking-tight text-slate-950 dark:text-white">
        {titulo}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{descripcion}</p>
    </button>
  )
}

function TarjetaArea({ area, textos }) {
  return (
    <article className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
            {area.nombre}
          </h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {textos.lider}: {area.lider || 'N/A'}
          </p>
        </div>

        <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {textos.coberturaKpi}
          </p>
          <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{area.cobertura_kpi}%</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {textos.puestosActivos}
          </p>
          <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{area.puestos}</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {textos.empleadosActivos}
          </p>
          <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{area.empleados}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{area.meta}</p>
    </article>
  )
}

function TarjetaFocoKpi({ puesto, textos }) {
  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-black tracking-tight text-slate-950 dark:text-white">
            {puesto.nombre}
          </h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {puesto.empleado || textos.superAdmin}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
          {puesto.progreso}%
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>
          {textos.departamentoSingular}: <span className="font-semibold">{puesto.departamento}</span>
        </p>
        <p>
          {textos.kpiPrincipal}: <span className="font-semibold">{puesto.kpi_principal}</span>
        </p>
        <p>
          {textos.frecuencia}: <span className="font-semibold">{puesto.frecuencia}</span>
        </p>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          <span>{textos.cumplimiento}</span>
          <span>{puesto.progreso}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
            style={{ width: `${puesto.progreso}%` }}
          />
        </div>
      </div>
    </article>
  )
}

function TarjetaSeguimiento({ item, textos }) {
  return (
    <article className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-black tracking-tight text-slate-950 dark:text-white">
            {item.titulo}
          </h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.empleado}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          {item.frecuencia}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>
          {textos.puesto}: <span className="font-semibold">{item.puesto}</span>
        </p>
        <p>
          {textos.departamentoSingular}: <span className="font-semibold">{item.departamento}</span>
        </p>
        <p>
          {textos.kpiPrincipal}: <span className="font-semibold">{item.kpi}</span>
        </p>
        <p>
          {textos.fechaIngreso}: <span className="font-semibold">{item.fecha}</span>
        </p>
      </div>
    </article>
  )
}

function VistaDashboard({ panel, textos, alCambiarVista }) {
  const resumenPrincipal = panel.resumen.slice(0, 4)
  const resumenCumplimiento = panel.resumen.find((item) => item.id === 'cumplimiento') ?? {
    valor: '0%',
    detalle: '',
  }
  const focoKpis = panel.puestos_destacados.slice(0, 4)
  const seguimientos = panel.seguimiento_operativo ?? []
  const porcentajeCumplimiento = extraerPorcentaje(resumenCumplimiento?.valor)

  return (
    <div className="space-y-6">
      <section>
        <article className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
              {textos.vistaDashboard}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {panel.empresa.industria}
            </span>
          </div>

          <div className="mt-5 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                {panel.empresa.nombre}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                {panel.empresa.objetivo}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] bg-slate-50 px-4 py-4 dark:bg-slate-950/50">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {textos.puestosActivos}
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                    {panel.metricas_contexto.puestos_activos}
                  </p>
                </div>
                <div className="rounded-[22px] bg-slate-50 px-4 py-4 dark:bg-slate-950/50">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {textos.puestosSinKpi}
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                    {panel.metricas_contexto.puestos_sin_kpi}
                  </p>
                </div>
                <div className="rounded-[22px] bg-slate-50 px-4 py-4 dark:bg-slate-950/50">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {textos.cumplimientoSemanal}
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                    {resumenCumplimiento.valor}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="xl:max-w-xl">
                    <div className="flex items-center gap-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {textos.cumplimiento}
                      </p>
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
                        {resumenCumplimiento.valor}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                      {textos.lecturaEjecutiva}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {textos.dashboardNarrativaUno
                        .replace('{puestosConKpi}', panel.metricas_contexto.puestos_con_kpi)
                        .replace('{puestosActivos}', panel.metricas_contexto.puestos_activos)}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px]">
                    <div className="rounded-[22px] border border-slate-200/80 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/70">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {textos.puestosConKpi}
                      </p>
                      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                        {panel.metricas_contexto.puestos_con_kpi}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-slate-200/80 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/70">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {textos.departamentosActivos}
                      </p>
                      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                        {panel.metricas_contexto.departamentos_activos}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-slate-200/80 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/70">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {textos.seguimientoOperativo}
                      </p>
                      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                        {panel.metricas_contexto.seguimientos_pendientes}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    <span>{textos.cumplimientoSemanal}</span>
                    <span>{resumenCumplimiento.valor}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600"
                      style={{ width: `${porcentajeCumplimiento}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {textos.dashboardNarrativaDos
                      .replace('{rolesMultiples}', panel.metricas_contexto.roles_multiples)
                      .replace(
                        '{seguimientosPendientes}',
                        panel.metricas_contexto.seguimientos_pendientes,
                      )}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {resumenCumplimiento.detalle}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <TarjetaAccion
                icono={Network}
                titulo={textos.navOrganigrama}
                descripcion={textos.clickPerfil}
                onClick={() => alCambiarVista('organigrama')}
              />
              <TarjetaAccion
                icono={Users}
                titulo={textos.navGestionUsuarios}
                descripcion={textos.gestionUsuariosSubtitulo}
                onClick={() => alCambiarVista('gestion-usuarios')}
              />
              <TarjetaAccion
                icono={ChartColumn}
                titulo={textos.navKpis}
                descripcion={textos.centroKpisSubtitulo}
                onClick={() => alCambiarVista('kpis')}
              />
              <TarjetaAccion
                icono={ClipboardList}
                titulo={textos.navSeguimientoKpis}
                descripcion={textos.seguimientoKpisSubtitulo}
                onClick={() => alCambiarVista('seguimiento-kpis')}
              />
              <TarjetaAccion
                icono={Bot}
                titulo={textos.navIa}
                descripcion={panel.asistente_ia.capacidad}
                onClick={() => alCambiarVista('ia')}
              />
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-4">
        {resumenPrincipal.map((item) => (
          <TarjetaResumen key={item.id} item={item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {textos.departamentos}
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.resumen}
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {panel.departamentos.length} {textos.listo}
            </span>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {panel.departamentos.map((departamento) => (
              <TarjetaArea key={departamento.nombre} area={departamento} textos={textos} />
            ))}
          </div>
        </article>

        <div className="grid gap-5">
          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                <ChartColumn size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {textos.kpiPrincipal}
                </p>
                <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {textos.puestos}
                </h3>
              </div>
            </div>

            {focoKpis.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                {textos.sinKpis}
              </div>
            ) : (
              <div className="space-y-4">
                {focoKpis.map((puesto) => (
                  <TarjetaFocoKpi key={`${puesto.nombre}-${puesto.kpi_principal}`} puesto={puesto} textos={textos} />
                ))}
              </div>
            )}
          </article>

          <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <CircleAlert size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {textos.seguimientoOperativo}
                </p>
                <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {textos.seguimientosPendientes}
                </h3>
              </div>
            </div>

            {seguimientos.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                {textos.sinSeguimientos}
              </div>
            ) : (
              <div className="space-y-4">
                {seguimientos.map((item) => (
                  <TarjetaSeguimiento key={item.id} item={item} textos={textos} />
                ))}
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertTriangle size={20} />
            </span>
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.alertas}
            </h3>
          </div>
          <div className="mt-5 grid gap-3">
            {panel.alertas.map((alerta) => (
              <div
                key={alerta}
                className="rounded-[22px] border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300"
              >
                {alerta}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Bot size={20} />
            </span>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {textos.asistenteIa}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {panel.asistente_ia.capacidad}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-cyan-100 bg-cyan-50/80 px-4 py-3 text-sm leading-6 text-cyan-900 dark:border-cyan-950/50 dark:bg-cyan-950/20 dark:text-cyan-200">
            {textos.asistenteIaDashboardAyuda}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-950/50">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {textos.estado}
              </p>
              <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                {panel.asistente_ia.estado}
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-950/50">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {textos.rolesDisponibles}
              </p>
              <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
                {panel.asistente_ia.roles_disponibles}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {textos.rolActivo}
            </p>
            <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
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

function App() {
  const [idioma, setIdioma] = useState('es')
  const [tema, setTema] = useState(() => localStorage.getItem('tema-delicore') ?? 'light')
  const [autenticado, setAutenticado] = useState(false)
  const [accesoDemo, setAccesoDemo] = useState(null)
  const [tipoAcceso, setTipoAcceso] = useState('admin')
  const [perfilSeleccionado, setPerfilSeleccionado] = useState('')
  const [sesionActiva, setSesionActiva] = useState(null)
  const [vistaActiva, setVistaActiva] = useState('dashboard')
  const [panel, setPanel] = useState(null)
  const [organigrama, setOrganigrama] = useState([])
  const [directorio, setDirectorio] = useState(null)
  const [perfilTalento, setPerfilTalento] = useState(null)
  const [centroKpis, setCentroKpis] = useState(null)
  const [gestionUsuarios, setGestionUsuarios] = useState(null)
  const [asistenteIaRol, setAsistenteIaRol] = useState(null)
  const [empleadoSeleccionadoId, setEmpleadoSeleccionadoId] = useState(null)
  const [nodoActivo, setNodoActivo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [guardandoKpi, setGuardandoKpi] = useState(false)
  const [guardandoUsuario, setGuardandoUsuario] = useState(false)
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
    obtenerAccesoDemo()
      .then((datos) => {
        setAccesoDemo(datos)
        setPerfilSeleccionado(String(datos?.perfiles?.admin?.[0]?.empleado_id ?? ''))
      })
      .catch((nuevoError) => setError(nuevoError.message))
  }, [])

  useEffect(() => {
    if (!autenticado) {
      return
    }

    cargarDatos()
  }, [autenticado, sesionActiva])

  useEffect(() => {
    if (!autenticado) {
      return
    }

    cargarAsistenteIa()
  }, [idioma])

  async function cargarDatos() {
    setCargando(true)
    setError('')

    const empleadoId = sesionActiva?.tipo === 'empleado' ? sesionActiva.empleado_id : undefined

    try {
      const [datosPerfilTalento, datosCentroKpis] = await Promise.all([
        obtenerPerfilTalento({ empleadoId }),
        obtenerCentroKpis({ empleadoId }),
      ])

      setPerfilTalento(datosPerfilTalento)
      setCentroKpis(datosCentroKpis)

      if (sesionActiva?.tipo === 'admin') {
        const [datosPanel, datosOrganigrama, datosDirectorio, datosGestionUsuarios, datosAsistenteIa] = await Promise.all([
          obtenerPanelGeneral(),
          obtenerOrganigrama(),
          obtenerDirectorioEmpleados(),
          obtenerGestionUsuarios(),
          obtenerAsistenteIaRol(idioma),
        ])

        setPanel(datosPanel)
        setOrganigrama(datosOrganigrama.organigrama ?? [])
        setDirectorio(datosDirectorio)
        setGestionUsuarios(datosGestionUsuarios)
        setAsistenteIaRol(datosAsistenteIa)
        setEmpleadoSeleccionadoId(datosDirectorio?.empleados?.[0]?.id ?? null)
      } else {
        const datosAsistenteIa = await obtenerAsistenteIaRol(idioma)
        setAsistenteIaRol(datosAsistenteIa)
        setPanel(null)
        setOrganigrama([])
        setDirectorio(null)
        setGestionUsuarios(null)
        setEmpleadoSeleccionadoId(empleadoId ?? null)
      }
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
    const perfiles = accesoDemo?.perfiles?.[tipoAcceso] ?? []
    const perfil = perfiles.find((item) => String(item.empleado_id) === String(perfilSeleccionado))

    if (!perfil) {
      setError('Selecciona un perfil valido para ingresar.')
      return
    }

    setSesionActiva(perfil)
    setVistaActiva('dashboard')
    setAutenticado(true)
  }

  function cambiarIdioma() {
    setIdioma((actual) => (actual === 'es' ? 'en' : 'es'))
  }

  function cerrarSesion() {
    setAutenticado(false)
    setSesionActiva(null)
    setVistaActiva('dashboard')
    setPanel(null)
    setOrganigrama([])
    setDirectorio(null)
    setPerfilTalento(null)
    setCentroKpis(null)
    setGestionUsuarios(null)
    setAsistenteIaRol(null)
    setEmpleadoSeleccionadoId(null)
    setNodoActivo(null)
    setError('')
  }

  async function manejarCrearKpi(datos) {
    setGuardandoKpi(true)
    setError('')

    try {
      await crearKpi(datos)
      await cargarDatos()
      return true
    } catch (nuevoError) {
      setError(nuevoError.message)
      return false
    } finally {
      setGuardandoKpi(false)
    }
  }

  async function manejarCrearUsuario(datos) {
    setGuardandoUsuario(true)
    setError('')

    try {
      const respuesta = await crearEmpleadoAdmin(datos)
      await Promise.all([cargarDatos(), obtenerAccesoDemo().then(setAccesoDemo)])
      setEmpleadoSeleccionadoId(respuesta?.empleado?.id ?? null)
      return respuesta
    } catch (nuevoError) {
      setError(nuevoError.message)
      return null
    } finally {
      setGuardandoUsuario(false)
    }
  }

  async function manejarActualizarUsuario(id, datos) {
    setGuardandoUsuario(true)
    setError('')

    try {
      const respuesta = await actualizarEmpleadoAdmin(id, datos)
      await Promise.all([cargarDatos(), obtenerAccesoDemo().then(setAccesoDemo)])
      setEmpleadoSeleccionadoId(respuesta?.empleado?.id ?? null)
      return respuesta
    } catch (nuevoError) {
      setError(nuevoError.message)
      return null
    } finally {
      setGuardandoUsuario(false)
    }
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

              <div className="mt-8 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTipoAcceso('admin')
                    setPerfilSeleccionado(String(accesoDemo?.perfiles?.admin?.[0]?.empleado_id ?? ''))
                  }}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-bold transition',
                    tipoAcceso === 'admin'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white/70 text-slate-700',
                  ].join(' ')}
                >
                  Administrador
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipoAcceso('empleado')
                    setPerfilSeleccionado(String(accesoDemo?.perfiles?.empleado?.[0]?.empleado_id ?? ''))
                  }}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-bold transition',
                    tipoAcceso === 'empleado'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white/70 text-slate-700',
                  ].join(' ')}
                >
                  Empleado
                </button>
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
                <select
                  value={perfilSeleccionado}
                  onChange={(evento) => setPerfilSeleccionado(evento.target.value)}
                >
                  {((accesoDemo?.perfiles?.[tipoAcceso]) ?? []).map((perfil) => (
                    <option key={perfil.empleado_id} value={perfil.empleado_id}>
                      {perfil.nombre} · {perfil.puesto}
                    </option>
                  ))}
                </select>
              </label>

              <label className="campo-login">
                <span>{textos.contrasena}</span>
                <input defaultValue="demo123" type="password" />
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
        sesion={sesionActiva}
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

        {sesionActiva?.tipo === 'admin' && panelLocalizado && !cargando && !error && vistaActiva === 'dashboard' ? (
          <VistaDashboard panel={panelLocalizado} textos={textos} alCambiarVista={setVistaActiva} />
        ) : null}

        {sesionActiva?.tipo === 'empleado' && !cargando && !error && vistaActiva === 'dashboard' ? (
          <EspacioEmpleado
            perfil={perfilTalentoLocalizado}
            centro={centroKpisLocalizado}
            sesion={sesionActiva}
            textos={textos}
            onAbrirKpis={() => setVistaActiva('kpis')}
            onAbrirSeguimiento={() => setVistaActiva('seguimiento-kpis')}
            onAbrirAsistente={() => setVistaActiva('ia')}
          />
        ) : null}

        {sesionActiva?.tipo === 'empleado' && !cargando && !error && vistaActiva === 'perfil' ? (
          <PerfilEmpleado
            perfil={perfilTalentoLocalizado}
            centro={centroKpisLocalizado}
            sesion={sesionActiva}
            textos={textos}
            idioma={idioma}
          />
        ) : null}

        {sesionActiva?.tipo === 'admin' && !cargando && !error && vistaActiva === 'organigrama' ? (
          <VistaOrganigrama
            organigrama={organigrama}
            textos={textos}
            idioma={idioma}
            alSeleccionar={setNodoActivo}
          />
        ) : null}

        {sesionActiva?.tipo === 'admin' && !cargando && !error && vistaActiva === 'directorio' && directorioLocalizado ? (
          <DirectorioEmpleados
            directorio={directorioLocalizado}
            textos={textos}
            idioma={idioma}
            empleadoSeleccionadoId={empleadoSeleccionadoId}
            onSeleccionarEmpleado={setEmpleadoSeleccionadoId}
            onAbrirPerfil={() => setVistaActiva('perfil')}
          />
        ) : null}

        {sesionActiva?.tipo === 'admin' && !cargando && !error && vistaActiva === 'gestion-usuarios' && gestionUsuarios ? (
          <GestionUsuarios
            gestion={gestionUsuarios}
            onCrearUsuario={manejarCrearUsuario}
            onActualizarUsuario={manejarActualizarUsuario}
            guardando={guardandoUsuario}
          />
        ) : null}

        {sesionActiva?.tipo === 'admin' && !cargando && !error && vistaActiva === 'perfil' && perfilTalentoLocalizado ? (
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
            onAbrirSeguimiento={() => setVistaActiva('seguimiento-kpis')}
            onAbrirSugeridos={() => setVistaActiva('kpis-sugeridos')}
            onAbrirWizard={() => setVistaActiva('registro-actividades')}
            puedeGestionar={sesionActiva?.tipo === 'admin'}
            modo={sesionActiva?.tipo}
          />
        ) : null}

        {vistaActiva === 'registro-actividades' ? (
          <CrearKpiWizard
            centro={centroKpisLocalizado}
            directorio={directorioLocalizado}
            textos={textos}
            onVolver={() => setVistaActiva('kpis')}
            onGuardar={async (datos) => {
              const creado = await manejarCrearKpi(datos)
              if (creado) {
                setVistaActiva('seguimiento-kpis')
              }
            }}
            guardando={guardandoKpi}
          />
        ) : null}

        {!cargando && !error && vistaActiva === 'seguimiento-kpis' && centroKpisLocalizado ? (
          <SeguimientoKpis
            centro={centroKpisLocalizado}
            textos={textos}
            idioma={idioma}
            onVolver={sesionActiva?.tipo === 'admin' ? () => setVistaActiva('kpis') : null}
            modo={sesionActiva?.tipo}
          />
        ) : null}

        {sesionActiva?.tipo === 'admin' && !cargando && !error && vistaActiva === 'kpis-sugeridos' && centroKpisLocalizado ? (
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
            sesion={sesionActiva}
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
