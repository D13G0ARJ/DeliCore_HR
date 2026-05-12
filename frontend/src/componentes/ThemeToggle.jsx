import { Moon, SunMedium } from 'lucide-react'

export function ThemeToggle({ tema, alCambiarTema, textos }) {
  const esOscuro = tema === 'dark'

  function manejarClick(evento) {
    alCambiarTema(evento)
  }

  return (
    <button
      type="button"
      onClick={manejarClick}
      className="group inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
      aria-label={esOscuro ? textos.ariaModoClaro : textos.ariaModoOscuro}
    >
      <span className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors dark:bg-slate-800 dark:text-amber-300">
        {esOscuro ? <SunMedium size={16} /> : <Moon size={16} />}
      </span>
      <span>{esOscuro ? textos.themeLight : textos.themeDark}</span>
    </button>
  )
}
