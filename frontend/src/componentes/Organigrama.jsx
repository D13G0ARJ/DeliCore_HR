import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './Organigrama.css'
import { TarjetaNodoFlow } from './TarjetaNodoFlow'
import { aplanarOrganigrama, aplicarLayoutDagre } from '../utils/organigramaFlow'

const nodeTypes = {
  tarjetaOrganigrama: TarjetaNodoFlow,
}

function VistaOrganigramaFlow({ nodos, textos, idioma, alSeleccionar }) {
  const contenedorRef = useRef(null)
  const [estaPantallaCompleta, setEstaPantallaCompleta] = useState(false)

  useEffect(() => {
    function sincronizarPantallaCompleta() {
      setEstaPantallaCompleta(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', sincronizarPantallaCompleta)
    return () => {
      document.removeEventListener('fullscreenchange', sincronizarPantallaCompleta)
    }
  }, [])

  const { nodes, edges } = useMemo(() => {
    const estructuraPlana = aplanarOrganigrama(nodos, alSeleccionar, idioma)
    return aplicarLayoutDagre(estructuraPlana.nodes, estructuraPlana.edges)
  }, [nodos, alSeleccionar, idioma])

  async function alternarPantallaCompleta() {
    const elemento = contenedorRef.current
    if (!elemento) {
      return
    }

    if (!document.fullscreenElement) {
      await elemento.requestFullscreen()
      return
    }

    await document.exitFullscreen()
  }

  return (
    <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {textos.organigrama}
          </h3>
          <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {textos.clickPerfil}
          </p>
        </div>

        <button
          className="organigrama-flow__fullscreen"
          type="button"
          onClick={alternarPantallaCompleta}
        >
          {estaPantallaCompleta ? textos.salirPantallaCompleta : textos.verPantallaCompleta}
        </button>
      </div>

      <div
        ref={contenedorRef}
        className={[
          'organigrama-flow',
          estaPantallaCompleta ? 'organigrama-flow--fullscreen' : '',
        ].join(' ')}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18, duration: 700 }}
          minZoom={0.3}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          }}
        >
          <Background color="#e2e8f0" gap={18} size={1} />
          <Controls
            position="bottom-right"
            showInteractive={false}
            className="organigrama-flow__controls"
          />
          <MiniMap
            pannable
            zoomable
            className="!hidden xl:!block organigrama-flow__minimap"
            maskColor="rgba(15, 23, 42, 0.08)"
          />
        </ReactFlow>
      </div>
    </section>
  )
}

export function Organigrama({ nodos, textos, idioma, alSeleccionar }) {
  return (
    <ReactFlowProvider>
      <VistaOrganigramaFlow
        nodos={nodos}
        textos={textos}
        idioma={idioma}
        alSeleccionar={alSeleccionar}
      />
    </ReactFlowProvider>
  )
}
