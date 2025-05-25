import { NLPProcessor } from "@/components/nlp-processor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Documentation } from "@/components/documentation"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-slate-900 dark:via-blue-900 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Bienvenido a nuestra Tienda Deportiva
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Procesador de Lenguaje Natural
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Sistema automatizado de análisis sintáctico y generación de respuestas
          </p>
        </div>

        <Tabs defaultValue="processor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger
              value="processor"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              Procesador Automático
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Documentación
            </TabsTrigger>
          </TabsList>
          <TabsContent value="processor">
            <NLPProcessor />
          </TabsContent>
          <TabsContent value="documentation">
            <Documentation />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
