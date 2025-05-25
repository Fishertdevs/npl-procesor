"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import type { SyntacticToken } from "@/components/nlp-processor"
import { generateLL1Table, spanishGrammar } from "@/lib/grammar"
import { useMemo } from "react"

interface SyntacticAnalyzerProps {
  tokens: SyntacticToken[]
  onContinue: () => void
  isProcessing: boolean
  tokenization: string
  error: string
  parsingSteps: Array<{ stack: string[]; input: string[]; action: string }>
  syntaxTree: string
}

export const SyntacticAnalyzer = ({
  tokens,
  onContinue,
  isProcessing,
  tokenization,
  error,
  parsingSteps,
  syntaxTree,
}: SyntacticAnalyzerProps) => {
  const validTokens = tokens.filter((token) => token.syntacticValid)
  const invalidTokens = tokens.filter((token) => !token.syntacticValid)

  // Determinar si la oración es sintácticamente válida
  const isSentenceValid = invalidTokens.length === 0 && tokens.length > 0

  // Obtener los tipos de tokens para la tabla LL(1)
  const tokenTypes = useMemo(() => {
    return tokens.map((token) => token.typeToken || "desconocido")
  }, [tokens])

  // Generar la tabla LL(1) para la gramática
  const parseTable = useMemo(() => {
    return generateLL1Table(spanishGrammar)
  }, [])

  // Filtrar la tabla LL(1) para mostrar solo las entradas relevantes para los tokens actuales
  const relevantParseTable = useMemo(() => {
    const uniqueTokenTypes = Array.from(new Set(tokenTypes))
    const relevantTable: Record<string, Record<string, string[][]>> = {}

    // Incluir todos los no terminales
    for (const nonTerminal of spanishGrammar.nonTerminals) {
      relevantTable[nonTerminal] = {}

      // Solo incluir los terminales que aparecen en la oración
      for (const tokenType of uniqueTokenTypes) {
        if (parseTable[nonTerminal] && parseTable[nonTerminal][tokenType]) {
          relevantTable[nonTerminal][tokenType] = parseTable[nonTerminal][tokenType]
        } else {
          relevantTable[nonTerminal][tokenType] = []
        }
      }

      // Añadir algunos terminales comunes para completar la tabla
      const commonTerminals = ["art", "sust", "verbo", "prep", "pronom", "det"]
      for (const terminal of commonTerminals) {
        if (!uniqueTokenTypes.includes(terminal)) {
          if (parseTable[nonTerminal] && parseTable[nonTerminal][terminal]) {
            relevantTable[nonTerminal][terminal] = parseTable[nonTerminal][terminal]
          } else {
            relevantTable[nonTerminal][terminal] = []
          }
        }
      }
    }

    return relevantTable
  }, [parseTable, tokenTypes])

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle>Análisis Sintáctico - Tienda Deportiva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-orange-700 dark:text-orange-300">E/ Oración</label>
              <div className="p-3 mt-1 border-2 border-orange-300 rounded-md bg-orange-50 dark:bg-orange-900/30">
                {tokens.map((token, i) => token.lexeme).join(" ")}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-red-700 dark:text-red-300">/S Tokenización 1</label>
              <div className="p-3 mt-1 border-2 border-red-300 rounded-md bg-red-50 dark:bg-red-900/30">
                {tokens.map((token) => token.type).join(" ")}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-green-700 dark:text-green-300">/S Análisis Léxico</label>
              <div className="p-3 mt-1 border-2 border-green-300 rounded-md bg-green-50 dark:bg-green-900/30">
                {tokens.some((token) => !token.valid)
                  ? `Oración con errores léxicos. ${tokens.length} palabras analizadas.`
                  : `Oración correcta. ${tokens.length} palabras analizadas.`}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">/S Tokenización 2</label>
              <div className="p-3 mt-1 border-2 border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/30">
                {tokenization}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Error sintáctico en palabra
              </label>
              <div className="p-3 mt-1 border-2 border-purple-300 rounded-md bg-purple-50 dark:bg-purple-900/30">
                {error || "No se encontraron errores sintácticos"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                /S Análisis Sintáctico
              </label>
              <div className="p-3 mt-1 border-2 border-emerald-300 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
                {isSentenceValid ? "Oración correcta sintácticamente" : "Oración con errores sintácticos"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle>Análisis de Tokens Sintácticos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border-2 border-purple-300 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50">
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Lexema</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Tipo Léxico</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Tipo Sintáctico</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Estado</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Error Sintáctico</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <TableRow key={index} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <TableCell className="font-medium">{token.lexeme}</TableCell>
                      <TableCell>{token.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 border-blue-300"
                        >
                          {token.syntacticType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {token.syntacticValid ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Válido
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            Inválido
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {token.syntacticError && (
                          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                            {token.syntacticError}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No hay tokens para mostrar. Complete el análisis léxico primero.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle>Pila de Análisis LL(1)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border-2 border-blue-300 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50">
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Paso</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Pila</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Entrada</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsingSteps.length > 0 ? (
                  parsingSteps.map((step, index) => (
                    <TableRow key={index} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          {step.stack.map((item, i) => (
                            <div
                              key={i}
                              className="border border-blue-300 p-1 w-10 text-center bg-blue-100 dark:bg-blue-900/30 rounded"
                            >
                              {item}
                            </div>
                          ))}
                          {step.stack.length === 0 && <div className="text-slate-400 italic">vacía</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {step.input.length > 0 ? (
                          step.input.join(" ")
                        ) : (
                          <span className="text-slate-400 italic">vacía</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{step.action}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No hay pasos de análisis para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle>Tabla de Análisis Sintáctico</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="p-4 border-2 border-emerald-300 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
            <h3 className="text-lg font-medium mb-2 text-emerald-700 dark:text-emerald-300">
              Gramática Utilizada (Chomsky)
            </h3>
            <pre className="p-3 bg-white dark:bg-slate-800 rounded border text-sm overflow-x-auto">
              {`S → SN SV
SN → Det N | N
SV → V | V SN
Det → el | la | los | las | un | una
N → sustantivo
V → verbo`}
            </pre>

            <h3 className="text-lg font-medium mt-4 mb-2 text-emerald-700 dark:text-emerald-300">
              Tabla LL(1) para la oración actual
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-emerald-300">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50">
                    <th className="border border-emerald-300 p-2 font-semibold text-emerald-700 dark:text-emerald-300"></th>
                    {Object.keys(relevantParseTable[Object.keys(relevantParseTable)[0]] || {}).map((terminal) => (
                      <th
                        key={terminal}
                        className="border border-emerald-300 p-2 font-semibold text-emerald-700 dark:text-emerald-300"
                      >
                        {terminal}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(relevantParseTable).map(([nonTerminal, terminals]) => (
                    <tr key={nonTerminal} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      <td className="border border-emerald-300 p-2 font-medium text-emerald-700 dark:text-emerald-300">
                        {nonTerminal}
                      </td>
                      {Object.keys(relevantParseTable[Object.keys(relevantParseTable)[0]] || {}).map((terminal) => {
                        const productions = terminals[terminal] || []
                        return (
                          <td key={terminal} className="border border-emerald-300 p-2">
                            {productions.length > 0
                              ? productions.map((prod, i) => (
                                  <div key={i} className="text-sm">{`${nonTerminal} → ${prod.join(" ")}`}</div>
                                ))
                              : ""}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={tokens.length === 0 || isProcessing}
          className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          Continuar con Procesamiento Semántico
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
