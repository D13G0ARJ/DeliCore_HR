import { traducirNodoOrganigrama } from '../traducciones'

export function PanelPerfil({ nodo, idioma, textos, alCerrar }) {
  if (!nodo) {
    return null
  }

  const nodoVisual = traducirNodoOrganigrama(nodo, idioma)

  return (
    <aside className="panel-perfil__fondo" onClick={alCerrar}>
      <section className="panel-perfil" onClick={(evento) => evento.stopPropagation()}>
        <button className="panel-perfil__cerrar" type="button" onClick={alCerrar}>
          x
        </button>

        <span className="inline-flex w-max items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
          {textos.perfil}
        </span>
        <h2>{nodoVisual.nombre}</h2>

        <div className="panel-perfil__datos">
          <div>
            <span>{textos.departamentoSingular}</span>
            <strong>{nodoVisual.departamento}</strong>
          </div>
          <div>
            <span>{textos.nivel}</span>
            <strong>{nodoVisual.nivel}</strong>
          </div>
          <div>
            <span>{textos.lider}</span>
            <strong>{nodoVisual.lideres}</strong>
          </div>
        </div>

        <div className="panel-perfil__bloque">
          <span>{textos.proposito}</span>
          <p>{nodoVisual.proposito}</p>
        </div>

        <div className="panel-perfil__bloque">
          <span>{textos.manual}</span>
          <p>{nodoVisual.manual}</p>
        </div>

        <div className="placeholder-ia">
          <span>{textos.asistenteIa}</span>
          <strong>{textos.asistenteIaConstruccion}</strong>
          <p>{textos.asistenteIaDescripcion}</p>
        </div>
      </section>
    </aside>
  )
}
