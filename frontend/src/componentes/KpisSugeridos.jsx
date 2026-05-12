import { ArrowLeft, Sparkles } from 'lucide-react'

function TarjetaSugerencia({ item, textos }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
            {item.nombre}
          </h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {item.puesto} · {item.departamento}
          </p>
        </div>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
          {item.frecuencia}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {textos.meta}
          </p>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{item.meta}</p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {textos.porqueSeSugiere}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.porque}</p>
        </div>

        <div className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 px-4 py-3 dark:border-cyan-900 dark:bg-cyan-950/20">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
            {textos.manualResumen}
          </p>
          <p className="mt-2 text-sm leading-6 text-cyan-900 dark:text-cyan-100">{item.contexto}</p>
        </div>
      </div>
    </div>
  )
}

export function KpisSugeridos({ centro, textos, onVolver }) {
  const total = centro.kpis_sugeridos?.length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            {textos.kpisSugeridosSubtitulo}
          </p>
          <h2 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            <span>{textos.kpisSugeridosTitulo}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              {total}
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onVolver}
          className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowLeft size={16} />
          {textos.volverCentroKpis}
        </button>
      </div>

      <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
            <Sparkles size={18} />
          </span>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {textos.kpisSugeridosPanel}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{textos.porqueSeSugiere}</p>
          </div>
        </div>

        {total === 0 ? (
          <p className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
            {textos.sinKpisSugeridos}
          </p>
        ) : (
          <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-2">
            {centro.kpis_sugeridos.map((item, index) => (
              <TarjetaSugerencia key={`${item.puesto}-${item.nombre}-${index}`} item={item} textos={textos} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
