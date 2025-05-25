import { Documentation } from "@/components/documentation"

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
          Documentación del Proyecto
        </h1>
        <p className="text-center mb-8 text-slate-600 dark:text-slate-300">
          Procesador de Lenguaje Natural basado en la gramática generativa de Noam Chomsky
        </p>
        <Documentation />
      </div>
    </main>
  )
}
