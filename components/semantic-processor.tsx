"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, ArrowRight, BookOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SemanticToken } from "@/components/nlp-processor"
import { knowledgeBase } from "@/lib/semantic"

interface SemanticProcessorProps {
  tokens: SemanticToken[]
  response: string
  tokenization: string
}

export const SemanticProcessor = ({ tokens, response, tokenization }: SemanticProcessorProps) => {
  const [activeTab, setActiveTab] = useState("tokens")

  // Análisis dinámico de tokens semánticos
  const semanticAnalysis = useMemo(() => {
    // Filtrar stopwords para análisis semántico
    const relevantTokens = tokens.filter((token) => !token.isStopword)

    // Agrupar tokens por categorías semánticas
    const entityTokens = relevantTokens.filter((token) => token.syntacticType === "sust")
    const actionTokens = relevantTokens.filter((token) => token.syntacticType === "verbo")
    const modifierTokens = relevantTokens.filter(
      (token) => token.syntacticType === "adj" || token.syntacticType === "adv",
    )

    // Generar un resumen del análisis
    const summary = () => {
      if (tokens.length === 0) return "No hay tokens para analizar."

      const totalTokens = tokens.length
      const relevantCount = relevantTokens.length
      const stopwordCount = totalTokens - relevantCount

      return `Se analizaron ${totalTokens} tokens, de los cuales ${relevantCount} son relevantes para el análisis semántico y ${stopwordCount} son palabras vacías (stopwords).`
    }

    // Identificar conceptos en la base de conocimiento
    const identifiedConcepts = new Set<string>()
    relevantTokens.forEach((token) => {
      if (token.semanticValue) {
        identifiedConcepts.add(token.semanticValue)
      }

      // Buscar en la base de conocimiento
      Object.keys(knowledgeBase.concepts).forEach((concept) => {
        if (token.lexeme.toLowerCase().includes(concept) || concept.includes(token.lexeme.toLowerCase())) {
          identifiedConcepts.add(concept)
        }

        // Buscar en sinónimos
        knowledgeBase.concepts[concept].synonyms.forEach((synonym) => {
          if (token.lexeme.toLowerCase().includes(synonym) || synonym.includes(token.lexeme.toLowerCase())) {
            identifiedConcepts.add(concept)
          }
        })
      })
    })

    // Generar relaciones semánticas entre conceptos identificados
    const conceptRelations: { source: string; target: string; relation: string }[] = []
    const conceptsArray = Array.from(identifiedConcepts)

    for (let i = 0; i < conceptsArray.length; i++) {
      for (let j = i + 1; j < conceptsArray.length; j++) {
        const concept1 = conceptsArray[i]
        const concept2 = conceptsArray[j]

        if (knowledgeBase.concepts[concept1] && knowledgeBase.concepts[concept2]) {
          // Verificar si hay asociaciones mutuas
          if (knowledgeBase.concepts[concept1].associations.includes(concept2)) {
            conceptRelations.push({
              source: concept1,
              target: concept2,
              relation: "está asociado con",
            })
          } else if (knowledgeBase.concepts[concept2].associations.includes(concept1)) {
            conceptRelations.push({
              source: concept2,
              target: concept1,
              relation: "está asociado con",
            })
          }
        }
      }
    }

    // Generar interpretación semántica dinámica
    const generateInterpretation = () => {
      if (relevantTokens.length === 0) {
        return "No hay suficientes tokens relevantes para generar una interpretación."
      }

      let interpretation = ""

      // Estructura básica de la oración
      if (entityTokens.length > 0 && actionTokens.length > 0) {
        const subject = entityTokens[0].lexeme
        const action = actionTokens[0].lexeme

        interpretation += `La consulta se refiere a "${subject}" y la acción "${action}". `

        if (entityTokens.length > 1) {
          interpretation += `Los productos mencionados son: "${entityTokens
            .slice(1)
            .map((t) => t.lexeme)
            .join(", ")}". `
        }

        if (modifierTokens.length > 0) {
          interpretation += `Con características: ${modifierTokens.map((t) => t.lexeme).join(", ")}. `
        }
      } else if (entityTokens.length > 0) {
        interpretation += `La consulta menciona los siguientes productos deportivos: ${entityTokens.map((t) => t.lexeme).join(", ")}. `
      } else if (actionTokens.length > 0) {
        interpretation += `La consulta se refiere a las siguientes acciones: ${actionTokens.map((t) => t.lexeme).join(", ")}. `
      }

      // Añadir información sobre conceptos identificados
      if (identifiedConcepts.size > 0) {
        interpretation += `\n\nConceptos deportivos identificados: ${Array.from(identifiedConcepts).join(", ")}. `

        // Añadir descripciones de los conceptos
        Array.from(identifiedConcepts).forEach((concept) => {
          if (knowledgeBase.concepts[concept]) {
            interpretation += `\n- ${concept}: ${knowledgeBase.concepts[concept].description}`
          }
        })
      }

      // Añadir información sobre relaciones identificadas
      if (conceptRelations.length > 0) {
        interpretation += `\n\nRelaciones entre conceptos deportivos:`
        conceptRelations.forEach((rel) => {
          interpretation += `\n- "${rel.source}" ${rel.relation} "${rel.target}"`
        })
      }

      return interpretation
    }

    return {
      relevantTokens,
      entityTokens,
      actionTokens,
      modifierTokens,
      summary: summary(),
      identifiedConcepts: Array.from(identifiedConcepts),
      conceptRelations,
      interpretation: generateInterpretation(),
    }
  }, [tokens])

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle>Procesamiento Semántico - Tienda Deportiva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-700 dark:text-purple-300">E/ Oración</label>
              <div className="p-3 mt-1 border-2 border-purple-300 rounded-md bg-purple-50 dark:bg-purple-900/30">
                {tokens.map((token, i) => token.lexeme).join(" ")}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-pink-700 dark:text-pink-300">/S Tokenización 1</label>
              <div className="p-3 mt-1 border-2 border-pink-300 rounded-md bg-pink-50 dark:bg-pink-900/30">
                {tokens.map((token) => token.type).join(" ")}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">/S Análisis Léxico</label>
              <div className="p-3 mt-1 border-2 border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/30">
                {tokens.some((token) => !token.valid)
                  ? `Oración con errores léxicos. ${tokens.length} palabras analizadas.`
                  : `Oración correcta. ${tokens.length} palabras analizadas.`}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-green-700 dark:text-green-300">/S Tokenización 2</label>
              <div className="p-3 mt-1 border-2 border-green-300 rounded-md bg-green-50 dark:bg-green-900/30">
                {tokens.map((token) => token.typeToken).join(" ")}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-orange-700 dark:text-orange-300">/S Análisis Sintáctico</label>
              <div className="p-3 mt-1 border-2 border-orange-300 rounded-md bg-orange-50 dark:bg-orange-900/30">
                {tokens.some((token) => !token.syntacticValid)
                  ? "Oración con errores sintácticos"
                  : "Oración correcta sintácticamente"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">/S Tokenización 3</label>
              <div className="p-3 mt-1 border-2 border-emerald-300 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
                {tokenization}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-teal-700 dark:text-teal-300">
                /S Respuesta Automática Generada
              </label>
              <div className="p-3 mt-1 border-2 border-teal-300 rounded-md bg-teal-50 dark:bg-teal-900/30 whitespace-pre-line">
                {response || "No hay respuesta semántica disponible."}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                /S Resumen del Análisis
              </label>
              <div className="p-3 mt-1 border-2 border-indigo-300 rounded-md bg-indigo-50 dark:bg-indigo-900/30">
                {semanticAnalysis.summary}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <TabsTrigger
            value="tokens"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Análisis de Tokens
          </TabsTrigger>
          <TabsTrigger
            value="entities"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Productos y Acciones
          </TabsTrigger>
          <TabsTrigger
            value="relations"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Relaciones Semánticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle>Análisis de Tokens Semánticos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-md border-2 border-blue-300 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                      <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Lexema</TableHead>
                      <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Tipo Sintáctico</TableHead>
                      <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Valor Semántico</TableHead>
                      <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Stopword</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokens.length > 0 ? (
                      tokens.map((token, index) => (
                        <TableRow
                          key={index}
                          className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 ${token.isStopword ? "opacity-60" : ""}`}
                        >
                          <TableCell className="font-medium">{token.lexeme}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-300"
                            >
                              {token.syntacticType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {token.semanticValue ? (
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300"
                              >
                                {token.semanticValue}
                              </Badge>
                            ) : semanticAnalysis.identifiedConcepts.some(
                                (concept) =>
                                  token.lexeme.toLowerCase().includes(concept) ||
                                  concept.includes(token.lexeme.toLowerCase()),
                              ) ? (
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300"
                              >
                                {semanticAnalysis.identifiedConcepts.find(
                                  (concept) =>
                                    token.lexeme.toLowerCase().includes(concept) ||
                                    concept.includes(token.lexeme.toLowerCase()),
                                )}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">No identificado</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {token.isStopword ? (
                              <div className="flex items-center text-amber-600">
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Sí
                              </div>
                            ) : (
                              <div className="flex items-center text-slate-600 dark:text-slate-400">
                                <AlertCircle className="mr-1 h-4 w-4" />
                                No
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No hay tokens para mostrar. Complete el análisis sintáctico primero.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle>Productos Deportivos Identificados</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-md border-2 border-green-300 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50">
                        <TableHead className="font-semibold text-green-700 dark:text-green-300">Producto</TableHead>
                        <TableHead className="font-semibold text-green-700 dark:text-green-300">Tipo</TableHead>
                        <TableHead className="font-semibold text-green-700 dark:text-green-300">
                          Valor Semántico
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semanticAnalysis.entityTokens.length > 0 ? (
                        semanticAnalysis.entityTokens.map((token, index) => (
                          <TableRow key={index} className="hover:bg-green-50 dark:hover:bg-green-900/20">
                            <TableCell className="font-medium">{token.lexeme}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-300"
                              >
                                {token.syntacticType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {token.semanticValue ? (
                                <Badge
                                  variant="outline"
                                  className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300"
                                >
                                  {token.semanticValue}
                                </Badge>
                              ) : semanticAnalysis.identifiedConcepts.some(
                                  (concept) =>
                                    token.lexeme.toLowerCase().includes(concept) ||
                                    concept.includes(token.lexeme.toLowerCase()),
                                ) ? (
                                <Badge
                                  variant="outline"
                                  className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300"
                                >
                                  {semanticAnalysis.identifiedConcepts.find(
                                    (concept) =>
                                      token.lexeme.toLowerCase().includes(concept) ||
                                      concept.includes(token.lexeme.toLowerCase()),
                                  )}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">No identificado</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            No se identificaron productos deportivos.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle>Acciones Identificadas</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-md border-2 border-orange-300 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50">
                        <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Acción</TableHead>
                        <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Tipo</TableHead>
                        <TableHead className="font-semibold text-orange-700 dark:text-orange-300">
                          Valor Semántico
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semanticAnalysis.actionTokens.length > 0 ? (
                        semanticAnalysis.actionTokens.map((token, index) => (
                          <TableRow key={index} className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
                            <TableCell className="font-medium">{token.lexeme}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300"
                              >
                                {token.syntacticType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {token.semanticValue ? (
                                <Badge
                                  variant="outline"
                                  className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300"
                                >
                                  {token.semanticValue}
                                </Badge>
                              ) : semanticAnalysis.identifiedConcepts.some(
                                  (concept) =>
                                    token.lexeme.toLowerCase().includes(concept) ||
                                    concept.includes(token.lexeme.toLowerCase()),
                                ) ? (
                                <Badge
                                  variant="outline"
                                  className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300"
                                >
                                  {semanticAnalysis.identifiedConcepts.find(
                                    (concept) =>
                                      token.lexeme.toLowerCase().includes(concept) ||
                                      concept.includes(token.lexeme.toLowerCase()),
                                  )}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">No identificado</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            No se identificaron acciones.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="relations">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle>Relaciones Semánticas - Tienda Deportiva</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 border-2 border-emerald-300 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
                  <h3 className="text-lg font-medium mb-2 text-emerald-700 dark:text-emerald-300">
                    Análisis de Relaciones Deportivas
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    El análisis semántico identifica las relaciones entre productos deportivos, acciones comerciales y
                    características en la consulta.
                  </p>

                  {semanticAnalysis.relevantTokens.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium text-emerald-700 dark:text-emerald-300">
                        Estructura Semántica Deportiva:
                      </h4>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border-2 border-emerald-200">
                        {semanticAnalysis.entityTokens.length > 0 && semanticAnalysis.actionTokens.length > 0 ? (
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                Producto/Consulta:
                              </span>
                              {semanticAnalysis.entityTokens.slice(0, 1).map((token, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300"
                                >
                                  {token.lexeme}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                Acción Comercial:
                              </span>
                              {semanticAnalysis.actionTokens.slice(0, 1).map((token, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
                                >
                                  {token.lexeme}
                                </Badge>
                              ))}
                            </div>
                            {semanticAnalysis.entityTokens.length > 1 && (
                              <div className="flex flex-wrap gap-2">
                                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                  Productos Adicionales:
                                </span>
                                {semanticAnalysis.entityTokens.slice(1).map((token, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300"
                                  >
                                    {token.lexeme}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {semanticAnalysis.modifierTokens.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                                  Características:
                                </span>
                                {semanticAnalysis.modifierTokens.map((token, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-300"
                                  >
                                    {token.lexeme}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-500">
                            No se pudieron identificar relaciones semánticas claras en el contexto deportivo.
                          </p>
                        )}
                      </div>

                      {semanticAnalysis.identifiedConcepts.length > 0 && (
                        <>
                          <h4 className="font-medium mt-4 text-emerald-700 dark:text-emerald-300">
                            Conceptos Deportivos Identificados:
                          </h4>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border-2 border-emerald-200">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {semanticAnalysis.identifiedConcepts.map((concept, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300"
                                >
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                            <div className="space-y-2">
                              {semanticAnalysis.identifiedConcepts.map((concept, i) => (
                                <div key={i} className="text-sm">
                                  <span className="font-medium text-emerald-700 dark:text-emerald-300">{concept}:</span>{" "}
                                  {knowledgeBase.concepts[concept]?.description ||
                                    "Concepto relacionado con productos deportivos"}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {semanticAnalysis.conceptRelations.length > 0 && (
                        <>
                          <h4 className="font-medium mt-4 text-emerald-700 dark:text-emerald-300">
                            Relaciones entre Conceptos Deportivos:
                          </h4>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border-2 border-emerald-200">
                            <ul className="space-y-2">
                              {semanticAnalysis.conceptRelations.map((rel, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300"
                                  >
                                    {rel.source}
                                  </Badge>
                                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                                  <Badge
                                    variant="outline"
                                    className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300"
                                  >
                                    {rel.target}
                                  </Badge>
                                  <span className="text-sm text-slate-600 dark:text-slate-400">({rel.relation})</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                      <h4 className="font-medium mt-4 text-emerald-700 dark:text-emerald-300">
                        Interpretación Semántica:
                      </h4>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border-2 border-emerald-200">
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                          {semanticAnalysis.interpretation}
                        </p>
                      </div>

                      <h4 className="font-medium mt-4 text-emerald-700 dark:text-emerald-300">
                        Respuesta Automática Generada:
                      </h4>
                      <div className="p-4 bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 rounded border-2 border-teal-300">
                        <p className="text-teal-700 dark:text-teal-300 font-medium">{response}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-500">
                      No hay suficientes tokens relevantes para analizar relaciones semánticas deportivas.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
