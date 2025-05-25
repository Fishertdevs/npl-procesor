"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import type { Token } from "@/components/nlp-processor"
import { isAccepted, identifierAutomaton, verbAutomaton, nounAutomaton } from "@/lib/automata"

interface LexicalAnalyzerProps {
  tokens: Token[]
  onContinue: () => void
  isProcessing: boolean
  tokenization: string
  error: string
}

export const LexicalAnalyzer = ({ tokens, onContinue, isProcessing, tokenization, error }: LexicalAnalyzerProps) => {
  const validTokens = tokens.filter((token) => token.valid)
  const invalidTokens = tokens.filter((token) => !token.valid)

  // Función para verificar si un token es aceptado por un autómata específico
  const checkAutomaton = (lexeme: string, automaton: any) => {
    return isAccepted(automaton, lexeme.toLowerCase())
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle>Análisis Léxico - Tienda Deportiva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-green-700 dark:text-green-300">E/ Oración</label>
              <div className="p-3 mt-1 border-2 border-green-300 rounded-md bg-green-50 dark:bg-green-900/30">
                {tokens.map((token, i) => token.lexeme).join(" ")}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700 dark:text-blue-300">/S Tokenización 1</label>
              <div className="p-3 mt-1 border-2 border-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/30">
                {tokenization}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-red-700 dark:text-red-300">Error léxico en palabra</label>
              <div className="p-3 mt-1 border-2 border-red-300 rounded-md bg-red-50 dark:bg-red-900/30">
                {error || "No se encontraron errores léxicos"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-700 dark:text-purple-300">/S Análisis Léxico</label>
              <div className="p-3 mt-1 border-2 border-purple-300 rounded-md bg-purple-50 dark:bg-purple-900/30">
                {invalidTokens.length > 0
                  ? `Oración con errores léxicos. ${tokens.length} palabras analizadas.`
                  : `Oración correcta. ${tokens.length} palabras analizadas.`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle>Tabla de Símbolos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border-2 border-orange-300 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50">
                  <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Lexema</TableHead>
                  <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Token</TableHead>
                  <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Tipo Token</TableHead>
                  <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Constante</TableHead>
                  <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Estado</TableHead>
                  <TableHead className="font-semibold text-orange-700 dark:text-orange-300">Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <TableRow key={index} className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <TableCell className="font-medium">{token.lexeme}</TableCell>
                      <TableCell>{token.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-300"
                        >
                          {token.typeToken}
                        </Badge>
                      </TableCell>
                      <TableCell>{token.constant || ""}</TableCell>
                      <TableCell>
                        {token.valid ? (
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
                        {token.errorChar && (
                          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                            Carácter inválido: {token.errorChar}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No hay tokens para mostrar. Inicie el análisis léxico primero.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle>Verificación de Autómatas</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border-2 border-purple-300 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50">
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Lexema</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Identificador</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Verbo</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-300">Sustantivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <TableRow key={index} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <TableCell className="font-medium">{token.lexeme}</TableCell>
                      <TableCell>
                        {checkAutomaton(token.lexeme, identifierAutomaton) ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Aceptado
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            Rechazado
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {checkAutomaton(token.lexeme, verbAutomaton) ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Aceptado
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            Rechazado
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {checkAutomaton(token.lexeme, nounAutomaton) ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Aceptado
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            Rechazado
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No hay tokens para mostrar. Inicie el análisis léxico primero.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={tokens.length === 0 || isProcessing}
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          Continuar con Análisis Sintáctico
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
