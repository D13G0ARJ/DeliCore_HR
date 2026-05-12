<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Puesto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ControladorAsistenteIaRol extends Controller
{
    public function mostrar(Request $request): JsonResponse
    {
        $idioma = $request->query('idioma', 'es');

        $puestos = Puesto::query()
            ->with(['departamento.manual', 'manual'])
            ->where(function ($query) {
                $query->whereHas('manual')
                    ->orWhereHas('departamento.manual');
            })
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'resumen' => [
                'roles_disponibles' => $puestos->count(),
                'consultas_sugeridas' => $puestos->count() * 3,
                'modo' => 'manual_only',
                'cobertura' => $this->texto(
                    $idioma,
                    'Cobertura por rol con respuestas limitadas al manual operativo.',
                    'Role-based coverage with answers limited to the operational manual.'
                ),
            ],
            'roles' => $puestos->map(fn (Puesto $puesto) => $this->transformarRol($puesto, $idioma))->values(),
            'alcance' => [
                'titulo' => $this->texto(
                    $idioma,
                    'Alcance del asistente',
                    'Assistant scope'
                ),
                'descripcion' => $this->texto(
                    $idioma,
                    'Este asistente responde solo con el contexto del manual, proposito y descripcion operativa del rol seleccionado.',
                    'This assistant answers only with the context from the selected role manual, purpose and operational description.'
                ),
                'regla' => $this->texto(
                    $idioma,
                    'No inventa procesos fuera del rol y prioriza fragmentos literales del manual.',
                    'It does not invent processes outside the role and prioritizes literal snippets from the manual.'
                ),
            ],
        ]);
    }

    public function consultar(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'puesto_id' => ['required', 'integer', 'exists:puestos,id'],
            'pregunta' => ['required', 'string', 'max:1000'],
            'idioma' => ['nullable', 'string', 'in:es,en'],
        ]);

        $idioma = $datos['idioma'] ?? 'es';

        $puesto = Puesto::query()
            ->with(['departamento.manual', 'manual'])
            ->findOrFail($datos['puesto_id']);

        $manual = $puesto->manual?->contenido
            ?? $puesto->departamento?->manual?->contenido
            ?? $puesto->proposito
            ?? '';

        $fragmentos = $this->extraerFragmentos($manual, $puesto->proposito, $puesto->departamento?->descripcion);
        $mejores = $this->seleccionarFragmentos($fragmentos, $datos['pregunta'])->take(3)->values();

        $respuesta = $this->construirRespuesta(
            $idioma,
            $puesto->nombre,
            $datos['pregunta'],
            $mejores
        );

        return response()->json([
            'rol' => [
                'id' => $puesto->id,
                'nombre' => $puesto->nombre,
                'departamento' => $puesto->departamento?->nombre,
            ],
            'pregunta' => $datos['pregunta'],
            'respuesta' => $respuesta,
            'fuentes' => $mejores->map(fn (string $fragmento) => [
                'texto' => $fragmento,
                'origen' => $puesto->manual?->titulo
                    ?? $puesto->departamento?->manual?->titulo
                    ?? 'Manual operativo',
            ])->values(),
            'siguientes_preguntas' => $this->preguntasSugeridas($puesto->nombre, $idioma)->slice(0, 3)->values(),
            'modo' => 'manual_only',
        ]);
    }

    private function transformarRol(Puesto $puesto, string $idioma): array
    {
        $manual = $puesto->manual?->contenido
            ?? $puesto->departamento?->manual?->contenido
            ?? $puesto->proposito
            ?? '';

        return [
            'id' => $puesto->id,
            'nombre' => $puesto->nombre,
            'departamento' => $puesto->departamento?->nombre,
            'nivel' => $puesto->nivel,
            'resumen' => Str::limit($manual, 180),
            'preguntas_sugeridas' => $this->preguntasSugeridas($puesto->nombre, $idioma)->values(),
        ];
    }

    private function preguntasSugeridas(string $nombrePuesto, string $idioma): Collection
    {
        $nombre = $nombrePuesto;

        return collect([
            $this->texto(
                $idioma,
                "Cuales son las responsabilidades clave de {$nombre}?",
                "What are the key responsibilities of {$nombre}?"
            ),
            $this->texto(
                $idioma,
                "Que debo revisar primero en {$nombre}?",
                "What should I review first in {$nombre}?"
            ),
            $this->texto(
                $idioma,
                "Que riesgos o errores debo evitar en {$nombre}?",
                "What risks or mistakes should I avoid in {$nombre}?"
            ),
            $this->texto(
                $idioma,
                "Resume el flujo operativo de {$nombre}.",
                "Summarize the operational workflow of {$nombre}."
            ),
        ]);
    }

    private function extraerFragmentos(?string ...$textos): Collection
    {
        return collect($textos)
            ->filter()
            ->flatMap(function (string $texto) {
                return collect(preg_split('/\r?\n|•|[.;]/', $texto))
                    ->map(fn ($fragmento) => trim($fragmento))
                    ->filter(fn ($fragmento) => mb_strlen($fragmento) > 12);
            })
            ->unique()
            ->values();
    }

    private function seleccionarFragmentos(Collection $fragmentos, string $pregunta): Collection
    {
        $terminos = $this->tokenizar($pregunta);

        return $fragmentos
            ->map(function (string $fragmento) use ($terminos) {
                $tokensFragmento = $this->tokenizar($fragmento);
                $coincidencias = count(array_intersect($terminos, $tokensFragmento));

                return [
                    'fragmento' => $fragmento,
                    'puntaje' => $coincidencias,
                ];
            })
            ->sortByDesc('puntaje')
            ->values()
            ->when(
                fn (Collection $items) => $items->first()['puntaje'] === 0,
                fn (Collection $items) => $items->take(3),
                fn (Collection $items) => $items->filter(fn ($item) => $item['puntaje'] > 0)->take(3)
            )
            ->pluck('fragmento')
            ->values();
    }

    private function tokenizar(string $texto): array
    {
        $limpio = Str::of(Str::ascii(Str::lower($texto)))
            ->replaceMatches('/[^a-z0-9\s]/', ' ')
            ->squish()
            ->value();

        $stopwords = [
            'de', 'la', 'el', 'los', 'las', 'y', 'o', 'que', 'en', 'para', 'con', 'del', 'al',
            'a', 'un', 'una', 'por', 'se', 'do', 'does', 'what', 'how', 'should', 'first', 'the',
            'and', 'for', 'role', 'this', 'that', 'que', 'cuales', 'como', 'debo', 'primero',
        ];

        return collect(explode(' ', $limpio))
            ->filter(fn ($token) => mb_strlen($token) > 2 && !in_array($token, $stopwords, true))
            ->unique()
            ->values()
            ->all();
    }

    private function construirRespuesta(
        string $idioma,
        string $nombrePuesto,
        string $pregunta,
        Collection $fragmentos
    ): string {
        if ($fragmentos->isEmpty()) {
            return $this->texto(
                $idioma,
                "No encontre suficiente contexto en el manual de {$nombrePuesto} para responder con precision. Intenta reformular la pregunta usando el proceso, tarea o control que necesitas revisar.",
                "I could not find enough context in the {$nombrePuesto} manual to answer precisely. Try rephrasing the question using the process, task, or control you need to review."
            );
        }

        $apertura = $this->texto(
            $idioma,
            "Con base en el manual de {$nombrePuesto}, esto es lo mas relevante para responder tu pregunta:",
            "Based on the {$nombrePuesto} manual, this is the most relevant context to answer your question:"
        );

        $cierre = $this->texto(
            $idioma,
            "Si quieres, puedo profundizar en uno de estos puntos o resumirlo como pasos accionables.",
            "If you want, I can go deeper into one of these points or summarize it as actionable steps."
        );

        $cuerpo = $fragmentos
            ->map(fn (string $fragmento) => '- '.$fragmento)
            ->implode("\n");

        return $apertura."\n\n".$cuerpo."\n\n".$cierre;
    }

    private function texto(string $idioma, string $es, string $en): string
    {
        return $idioma === 'en' ? $en : $es;
    }
}
