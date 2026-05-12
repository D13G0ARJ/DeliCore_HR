import dagre from 'dagre'
import { traducirNodoOrganigrama } from '../traducciones'

const ANCHO_NODO = 230
const ALTO_NODO = 164
const ANCHO_NODO_COMPACTO = 188
const ALTO_NODO_COMPACTO = 94
const ANCHO_NODO_ETIQUETA = 160
const ALTO_NODO_ETIQUETA = 44
const DESPLAZAMIENTO_CARRIL_DERECHO = 280

const NODOS_FILA_PRINCIPAL = [
  'OPERACIONES',
  'LOGISTICA',
  'ADMINISTRACION Y FINANZAS',
  'RECURSOS HUMANOS',
  'IT/SISTEMAS',
]

const NODOS_ADMINISTRATIVOS = new Set([
  'ADMINISTRACION Y FINANZAS',
  'RECURSOS HUMANOS',
  'BOOKKEEPING',
  'ACCOUNT RECIEVABLE',
  'ACCOUNT PAYABLE',
  'PAYROLL',
])

function normalizarTexto(valor = '') {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

function esAsistentes(nodo) {
  return normalizarTexto(nodo?.nombre) === 'ASISTENTES'
}

function esEtiquetaOperaciones(nodo) {
  return normalizarTexto(nodo?.nombre) === 'OPERACIONES'
}

function extraerTareas(nodo) {
  if (Array.isArray(nodo?.tareas) && nodo.tareas.length > 0) {
    return nodo.tareas
  }

  if (!nodo?.manual) {
    return []
  }

  const lineas = nodo.manual
    .split(/\r?\n|•|-/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (lineas.length > 1) {
    return lineas.slice(0, 4)
  }

  const segmentos = nodo.manual
    .split(/[.;]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 18)

  return segmentos.slice(0, 4)
}

function clonarNodo(nodo) {
  return {
    ...nodo,
    hijos: (nodo.hijos ?? []).map(clonarNodo),
  }
}

function reestructurarRamaOperaciones(nodosRaiz) {
  const nodos = nodosRaiz.map(clonarNodo)

  function recorrer(nodo) {
    const nombreNodo = normalizarTexto(nodo.nombre)

    if (nombreNodo === 'OPERACIONES') {
      const ventas = (nodo.hijos ?? []).find(
        (hijo) => normalizarTexto(hijo.nombre) === 'VENTAS',
      )

      if (ventas) {
        const indiceSupervisora = (ventas.hijos ?? []).findIndex(
          (hijo) => normalizarTexto(hijo.nombre) === 'SUPERVISORA',
        )

        if (indiceSupervisora >= 0) {
          const [supervisora] = ventas.hijos.splice(indiceSupervisora, 1)

          const indiceMerchandisers = (ventas.hijos ?? []).findIndex(
            (hijo) => normalizarTexto(hijo.nombre) === 'MERCHANDISERS',
          )

          if (indiceMerchandisers >= 0) {
            const [merchandisers] = ventas.hijos.splice(indiceMerchandisers, 1)
            supervisora.hijos = [...(supervisora.hijos ?? []), merchandisers]
          }

          nodo.hijos = [...(nodo.hijos ?? []), supervisora]
        }
      }
    }

    nodo.hijos = (nodo.hijos ?? []).map(recorrer)
    return nodo
  }

  return nodos.map(recorrer)
}

function obtenerDimensiones(nodo) {
  if (esEtiquetaOperaciones(nodo)) {
    return { width: ANCHO_NODO_ETIQUETA, height: ALTO_NODO_ETIQUETA }
  }

  if (esAsistentes(nodo)) {
    return { width: ANCHO_NODO_COMPACTO, height: ALTO_NODO_COMPACTO }
  }

  const tareas = extraerTareas(nodo)
  const alturaExtra = tareas.length > 0 ? Math.min(tareas.length, 4) * 18 : 0

  return { width: ANCHO_NODO, height: ALTO_NODO + alturaExtra }
}

export function aplanarOrganigrama(nodosRaiz, alSeleccionar, idioma = 'es') {
  const nodosProcesados = reestructurarRamaOperaciones(nodosRaiz)
  const nodes = []
  const edges = []

  function recorrer(nodo, parentId = null) {
    const id = String(nodo.id ?? nodo.nombre)
    const { width, height } = obtenerDimensiones(nodo)
    const nodoVisual = traducirNodoOrganigrama(nodo, idioma)
    const tareas = extraerTareas(nodoVisual)

    nodes.push({
      id,
      type: 'tarjetaOrganigrama',
      position: { x: 0, y: 0 },
      draggable: false,
      selectable: true,
      data: {
        nodo,
        nodoVisual,
        onSelect: alSeleccionar,
        compacta: esAsistentes(nodo),
        esEtiqueta: esEtiquetaOperaciones(nodo),
        tareas,
      },
      style: { width, height },
    })

    if (parentId) {
      const edgeBase = {
        id: `${parentId}-${id}`,
        source: String(parentId),
        target: id,
        type: 'smoothstep',
        animated: false,
        zIndex: -1,
        style: {
          stroke: '#94a3b8',
          strokeWidth: 2,
        },
      }

      if (esAsistentes(nodo)) {
        edges.push({
          ...edgeBase,
          sourceHandle: 'right',
          targetHandle: 'left',
        })
      } else {
        edges.push(edgeBase)
      }
    }

    ;(nodo.hijos ?? []).forEach((hijo) => recorrer(hijo, id))
  }

  nodosProcesados.forEach((nodo) => recorrer(nodo))

  return { nodes, edges }
}

export function getLayoutedElements(nodes, edges) {
  const mapaNodos = new Map(
    nodes.map((node) => [normalizarTexto(node.data?.nodo?.nombre), node.id]),
  )

  const idDuenos = mapaNodos.get('DUENOS')
  const idDirector = mapaNodos.get('DIRECTOR GENERAL')
  const idAdministracion = mapaNodos.get('ADMINISTRACION Y FINANZAS')
  const idRecursosHumanos = mapaNodos.get('RECURSOS HUMANOS')

  const edgesTemporales = edges.map((edge) => {
    if (!idDuenos || !idDirector) {
      return edge
    }

    const esEdgeAdministracion =
      edge.source === idDuenos &&
      (edge.target === idAdministracion || edge.target === idRecursosHumanos)

    if (!esEdgeAdministracion) {
      return edge
    }

    return {
      ...edge,
      source: idDirector,
    }
  })

  const grafo = new dagre.graphlib.Graph()
  grafo.setDefaultEdgeLabel(() => ({}))
  grafo.setGraph({
    rankdir: 'TB',
    nodesep: 80,
    ranksep: 120,
    marginx: 40,
    marginy: 40,
  })

  nodes.forEach((node) => {
    const width = node.style?.width ?? ANCHO_NODO
    const height = node.style?.height ?? ALTO_NODO

    grafo.setNode(node.id, { width, height })
  })

  edgesTemporales.forEach((edge) => {
    grafo.setEdge(edge.source, edge.target)
  })

  dagre.layout(grafo)

  const nodesPosicionados = nodes.map((node) => {
    const info = grafo.node(node.id)
    const width = node.style?.width ?? ANCHO_NODO
    const height = node.style?.height ?? ALTO_NODO

    return {
      ...node,
      position: {
        x: info.x - width / 2,
        y: info.y - height / 2,
      },
    }
  })

  const duenos = nodesPosicionados.find(
    (node) => normalizarTexto(node.data?.nodo?.nombre) === 'DUENOS',
  )

  const director = nodesPosicionados.find(
    (node) => normalizarTexto(node.data?.nodo?.nombre) === 'DIRECTOR GENERAL',
  )

  const asistentes = nodesPosicionados.find((node) => esAsistentes(node.data?.nodo))

  if (director && asistentes) {
    asistentes.position = {
      x: director.position.x + 340,
      y: director.position.y,
    }
  }

  nodesPosicionados.forEach((node) => {
    const nombre = normalizarTexto(node.data?.nodo?.nombre)

    if (NODOS_ADMINISTRATIVOS.has(nombre)) {
      node.position = {
        ...node.position,
        x: node.position.x + 400,
      }
    }
  })

  const edgesFinales = edges.map((edge) => {
    const esDesdeDuenos = edge.source === idDuenos

    return {
      ...edge,
      type: 'smoothstep',
      zIndex: esDesdeDuenos ? -10 : edge.zIndex ?? -1,
      style: {
        ...edge.style,
        zIndex: esDesdeDuenos ? -10 : -1,
      },
    }
  })

  return { nodes: nodesPosicionados, edges: edgesFinales }
}

export const aplicarLayoutDagre = getLayoutedElements
