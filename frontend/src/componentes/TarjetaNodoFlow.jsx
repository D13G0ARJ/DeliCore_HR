import { Handle, Position } from '@xyflow/react'
import {
  Building2,
  Crown,
  Monitor,
  Network,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'

function normalizarTexto(valor = '') {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

function obtenerTema(nombreNodo) {
  const nombre = normalizarTexto(nombreNodo)

  if (
    nombre.includes('DUENOS') ||
    nombre.includes('DIRECTOR GENERAL') ||
    nombre.includes('ASISTENTES')
  ) {
    return {
      envoltura: 'border-blue-200 bg-blue-50',
      cabecera: 'bg-gradient-to-r from-blue-700 to-blue-500 text-white',
      icono: 'bg-blue-100 text-blue-700',
    }
  }

  if (
    nombre.includes('ADMINISTRACION') ||
    nombre.includes('RECURSOS HUMANOS') ||
    nombre.includes('PAYROLL') ||
    nombre.includes('BOOKKEEPING') ||
    nombre.includes('ACCOUNT')
  ) {
    return {
      envoltura: 'border-green-200 bg-green-50',
      cabecera: 'bg-gradient-to-r from-green-700 to-lime-500 text-white',
      icono: 'bg-green-100 text-green-700',
    }
  }

  if (
    nombre.includes('LOGISTICA') ||
    nombre.includes('BODEGA') ||
    nombre.includes('PICKEO') ||
    nombre.includes('CHOFERES') ||
    nombre.includes('DELIVERY')
  ) {
    return {
      envoltura: 'border-orange-200 bg-orange-50',
      cabecera: 'bg-gradient-to-r from-orange-600 to-rose-500 text-white',
      icono: 'bg-orange-100 text-orange-700',
    }
  }

  return {
    envoltura: 'border-cyan-200 bg-cyan-50',
    cabecera: 'bg-gradient-to-r from-cyan-700 to-teal-500 text-white',
    icono: 'bg-cyan-100 text-cyan-700',
  }
}

function obtenerIcono(nombreNodo) {
  const nombre = normalizarTexto(nombreNodo)

  if (nombre.includes('DUENOS')) return Crown
  if (nombre.includes('DIRECTOR GENERAL')) return ShieldCheck
  if (nombre.includes('LOGISTICA') || nombre.includes('BODEGA') || nombre.includes('DELIVERY')) {
    return Truck
  }
  if (nombre.includes('RECURSOS HUMANOS') || nombre.includes('VENTAS')) return Users
  if (nombre.includes('ADMINISTRACION') || nombre.includes('PAYROLL') || nombre.includes('ACCOUNT')) {
    return Wallet
  }
  if (nombre.includes('IT')) return Network
  if (nombre.includes('SISTEMAS')) return Monitor
  return Building2
}

export function TarjetaNodoFlow({ data }) {
  const { nodo, nodoVisual = nodo, onSelect, compacta, esEtiqueta, tareas = [] } = data
  const tema = obtenerTema(nodo.nombre)
  const Icono = obtenerIcono(nodo.nombre)
  const mostrarSubtitulo =
    nodo.lideres && normalizarTexto(nodo.lideres) !== normalizarTexto(nodo.nombre)

  if (esEtiqueta) {
    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Top}
          className="!opacity-0 !bg-transparent !border-transparent"
        />
        <Handle
          id="left"
          type="target"
          position={Position.Left}
          className="!opacity-0 !bg-transparent !border-transparent"
        />
        <button
          type="button"
          onClick={() => onSelect(nodo)}
          className={[
            'group flex h-auto w-full items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-black uppercase tracking-[0.12em] shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-400 hover:ring-2 hover:ring-blue-100',
            tema.envoltura,
          ].join(' ')}
        >
          <Icono size={14} />
          <span className="!text-xs !font-black !uppercase !tracking-[0.14em] !text-slate-900">
            {nodoVisual.nombre}
          </span>
        </button>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!opacity-0 !bg-transparent !border-transparent"
        />
        <Handle
          id="right"
          type="source"
          position={Position.Right}
          className="!opacity-0 !bg-transparent !border-transparent"
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 !bg-transparent !border-transparent"
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!opacity-0 !bg-transparent !border-transparent"
      />
      <button
        type="button"
        onClick={() => onSelect(nodo)}
        className={[
          'group h-auto w-full overflow-hidden rounded-2xl border text-left shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-400 hover:ring-2 hover:ring-blue-100',
          tema.envoltura,
          compacta ? 'min-h-[92px]' : 'min-h-[108px]',
        ].join(' ')}
      >
        <div
          className={[
            'flex items-center justify-between gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]',
            tema.cabecera,
          ].join(' ')}
        >
          <span className="truncate">{nodoVisual.nombre}</span>
          <span className={['rounded-full p-1.5', tema.icono].join(' ')}>
            <Icono size={14} />
          </span>
        </div>

        <div className="px-4 py-3">
          {mostrarSubtitulo ? (
            <p className="text-sm font-bold leading-5 text-slate-800">
              {nodoVisual.lideres}
            </p>
          ) : (
            <p className="text-sm font-semibold leading-5 text-slate-700">
              {nodoVisual.departamento}
            </p>
          )}

          {tareas.length > 0 ? (
            <ul className="mt-2 list-disc pl-4 text-[10px] leading-4 text-gray-700">
              {tareas.map((tarea) => (
                <li key={tarea}>{tarea}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </button>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!opacity-0 !bg-transparent !border-transparent"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!opacity-0 !bg-transparent !border-transparent"
      />
    </div>
  )
}
