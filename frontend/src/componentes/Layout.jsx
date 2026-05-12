import {
  Bot,
  Building2,
  ChevronRight,
  Gauge,
  LayoutDashboard,
  LogOut,
  Network,
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
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200/70 bg-white/85 px-5 py-6 shadow-soft backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">DeliCore HR</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{textos.subtituloSidebar}</p>
          </div>
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
                onClick={() => alCambiarVista(item.id)}
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
            onClick={alCerrarSesion}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
          >
            <LogOut size={18} />
            <span>{textos.cerrarSesion}</span>
          </button>
        </div>
      </aside>

      <div className="ml-72 min-h-screen">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between gap-4 px-8 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
                {textos.panel}
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">{textos.marca}</h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle tema={tema} alCambiarTema={alCambiarTema} textos={textos} />

              <button
                type="button"
                onClick={alCambiarIdioma}
                className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              >
                {idioma === 'es' ? 'EN' : 'ES'}
              </button>

              <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
                <Avatar
                  size={38}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
                    color: '#fff',
                  }}
                >
                  SA
                </Avatar>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {textos.rolActivo}
                  </p>
                  <p className="font-bold">{textos.superAdmin}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-88px)] bg-slate-50 px-8 py-8 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  )
}
