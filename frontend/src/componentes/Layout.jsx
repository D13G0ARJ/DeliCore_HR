import { useState } from 'react'
import {
  Bot,
  Building2,
  ChevronRight,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  X,
  UserSquare2,
  Users,
} from 'lucide-react'
import { Avatar, Tag } from 'antd'
import { ThemeToggle } from './ThemeToggle'

const itemsNavegacion = [
  { id: 'dashboard', icono: LayoutDashboard, traduccion: 'navDashboard' },
  { id: 'organigrama', icono: Network, traduccion: 'navOrganigrama' },
  { id: 'directorio', icono: Users, traduccion: 'navDirectorio' },
  { id: 'perfil', icono: UserSquare2, traduccion: 'navPerfil' },
  { id: 'kpis', icono: Gauge, traduccion: 'navKpis' },
  { id: 'ia', icono: Bot, traduccion: 'navIa', beta: true },
]

export function Layout({
  vistaActiva,
  alCambiarVista,
  idioma,
  alCambiarIdioma,
  tema,
  alCambiarTema,
  alCerrarSesion,
  textos,
  children,
}) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

  function manejarCambioVista(id) {
    alCambiarVista(id)
    setMenuMovilAbierto(false)
  }

  function manejarCerrarSesion() {
    setMenuMovilAbierto(false)
    alCerrarSesion()
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {menuMovilAbierto ? (
        <button
          type="button"
          aria-label={textos.cerrarMenu}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuMovilAbierto(false)}
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/70 bg-white/85 px-5 py-6 shadow-soft backdrop-blur-md transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900/85',
          menuMovilAbierto ? 'translate-x-0' : '-translate-x-full',
          'lg:z-40 lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
            <Building2 size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black tracking-tight">DeliCore HR</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{textos.subtituloSidebar}</p>
          </div>
          <button
            type="button"
            aria-label={textos.cerrarMenu}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
            onClick={() => setMenuMovilAbierto(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          {itemsNavegacion.map((item) => {
            const Icono = item.icono
            const activo =
              vistaActiva === item.id ||
              (item.id === 'kpis' &&
                (vistaActiva === 'seguimiento-kpis' || vistaActiva === 'kpis-sugeridos'))

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => manejarCambioVista(item.id)}
                className={[
                  'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-300',
                  activo
                    ? 'bg-slate-900 text-white shadow-lg dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                ].join(' ')}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={[
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      activo
                        ? 'bg-white/15 dark:bg-slate-950/15'
                        : 'bg-slate-100 dark:bg-slate-800',
                    ].join(' ')}
                  >
                    <Icono size={18} />
                  </span>
                  <span className="font-semibold">{textos[item.traduccion]}</span>
                  {item.beta ? (
                    <Tag color="blue" className="!m-0 !rounded-full !px-2 !py-0.5">
                      {textos.etiquetaBeta}
                    </Tag>
                  ) : null}
                </span>
                <ChevronRight size={16} className={activo ? 'opacity-100' : 'opacity-40'} />
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={manejarCerrarSesion}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
          >
            <LogOut size={18} />
            <span>{textos.cerrarSesion}</span>
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={textos.abrirMenu}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 lg:hidden"
                onClick={() => setMenuMovilAbierto(true)}
              >
                <Menu size={20} />
              </button>

              <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
                {textos.panel}
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">{textos.marca}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle tema={tema} alCambiarTema={alCambiarTema} textos={textos} />

              <button
                type="button"
                onClick={alCambiarIdioma}
                className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 sm:px-4"
              >
                {idioma === 'es' ? 'EN' : 'ES'}
              </button>

              <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-2 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 sm:px-3">
                <Avatar
                  size={38}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
                    color: '#fff',
                  }}
                >
                  SA
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {textos.rolActivo}
                  </p>
                  <p className="font-bold">{textos.superAdmin}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-88px)] bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
