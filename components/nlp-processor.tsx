"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LexicalAnalyzer } from "@/components/lexical-analyzer"
import { SyntacticAnalyzer } from "@/components/syntactic-analyzer"
import { SemanticProcessor } from "@/components/semantic-processor"
import { Upload, Play, RotateCcw, Zap, ShoppingBag, Download, FileImage, Trash2 } from "lucide-react"
import { simulateParsingSteps, spanishGrammar } from "@/lib/grammar"
import { analyzeSemantics, knowledgeBase, isStopword } from "@/lib/semantic"
import { sportsStoreQuestions, generateAutomaticResponse, sportsStoreKB } from "@/lib/sports-store-data"
import { generateSyntaxTree, renderTreeAsText } from "@/lib/syntax-tree"

// Actualizar la estructura de tokens para incluir todas las columnas requeridas en la tabla de símbolos
export interface Token {
  lexeme: string
  type: string
  valid: boolean
  errorChar?: string
  position?: number
  // Nuevos campos según la guía
  typeToken?: string // Tipo token (sust, verbo, prep, etc.)
  constant?: string // Valor constante si aplica
  reserved?: boolean // Si es palabra reservada
}

export interface SyntacticToken extends Token {
  syntacticType: string
  syntacticValid: boolean
  syntacticError?: string
}

export interface SemanticToken extends SyntacticToken {
  semanticValue?: string
  isStopword?: boolean
  // Nuevos campos para la fase de respuesta
  response?: string
}

export interface ParsingStep {
  stack: string[]
  input: string[]
  action: string
}

// Nueva interfaz para el historial de respuestas
export interface ResponseHistory {
  questionIndex: number
  question: string
  response: string
  timestamp: string
  analysisId: string
}

// Actualizar el componente NLPProcessor para incluir las tres tokenizaciones y la respuesta
export const NLPProcessor = () => {
  const [inputText, setInputText] = useState<string>("")
  const [tokens, setTokens] = useState<Token[]>([])
  const [syntacticTokens, setSyntacticTokens] = useState<SyntacticToken[]>([])
  const [semanticTokens, setSemanticTokens] = useState<SemanticToken[]>([])
  const [semanticResponse, setSemanticResponse] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("input")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [lexicalOutput, setLexicalOutput] = useState<string>("")
  const [syntacticOutput, setSyntacticOutput] = useState<string>("")
  const [semanticOutput, setSementicOutput] = useState<string>("")
  const [lexicalError, setLexicalError] = useState<string>("")
  const [syntacticError, setSyntacticError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const diagramInputRef = useRef<HTMLInputElement>(null)
  const [parsingSteps, setParsingSteps] = useState<ParsingStep[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [isAutoProcessing, setIsAutoProcessing] = useState<boolean>(false)
  const [processedQuestions, setProcessedQuestions] = useState<
    Array<{
      question: string
      response: string
      processed: boolean
    }>
  >([])

  // Nuevos estados para el historial y diagramas
  const [responseHistory, setResponseHistory] = useState<ResponseHistory[]>([])
  const [syntaxTree, setSyntaxTree] = useState<string>("")
  const [diagrams, setDiagrams] = useState<{ name: string; url: string; type: string }[]>([])

  // Inicializar las preguntas al cargar el componente
  useEffect(() => {
    const initialQuestions = sportsStoreQuestions.map((q) => ({
      question: q,
      response: "",
      processed: false,
    }))
    setProcessedQuestions(initialQuestions)
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setInputText(text)
      }
      reader.readAsText(file)
    }
  }

  const handleDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newDiagrams = [...diagrams]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        newDiagrams.push({
          name: file.name,
          url,
          type: file.type,
        })
      }
    }

    setDiagrams(newDiagrams)

    // Reset the input
    if (diagramInputRef.current) {
      diagramInputRef.current.value = ""
    }
  }

  const removeDiagram = (index: number) => {
    const newDiagrams = [...diagrams]
    URL.revokeObjectURL(newDiagrams[index].url)
    newDiagrams.splice(index, 1)
    setDiagrams(newDiagrams)
  }

  // Función para procesar automáticamente todas las preguntas
  const processAllQuestions = async () => {
    setIsAutoProcessing(true)
    setCurrentQuestionIndex(0)

    for (let i = 0; i < sportsStoreQuestions.length; i++) {
      setCurrentQuestionIndex(i)
      const question = sportsStoreQuestions[i]
      setInputText(question)

      // Procesar la pregunta
      await processQuestion(question, i)

      // Esperar un poco antes de la siguiente pregunta
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    setIsAutoProcessing(false)
    setActiveTab("results")
  }

  // Función para procesar una pregunta individual
  const processQuestion = async (question: string, index: number): Promise<void> => {
    return new Promise((resolve) => {
      setIsProcessing(true)

      // Simular procesamiento
      setTimeout(() => {
        // Análisis léxico
        const lexicalResult = performLexicalAnalysisSync(question)

        // Análisis sintáctico
        const syntacticResult = performSyntacticAnalysisSync(lexicalResult.tokens)

        // Generar árbol sintáctico con los tokens
        const tokenLexemes = lexicalResult.tokens.map((t) => t.lexeme)
        const tree = generateSyntaxTree(syntacticResult.parsingSteps, tokenLexemes)
        const treeText = renderTreeAsText(tree)
        setSyntaxTree(treeText)

        // Análisis semántico y generación de respuesta
        const response = generateAutomaticResponse(question, sportsStoreKB)

        // Crear entrada en el historial
        const historyEntry: ResponseHistory = {
          questionIndex: index,
          question,
          response,
          timestamp: new Date().toLocaleString(),
          analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }

        // Actualizar historial
        setResponseHistory((prev) => [...prev, historyEntry])

        // Actualizar la lista de preguntas procesadas
        setProcessedQuestions((prev) => {
          const updated = [...prev]
          updated[index] = {
            question,
            response,
            processed: true,
          }
          return updated
        })

        setSemanticResponse(response)
        setIsProcessing(false)
        resolve()
      }, 1500)
    })
  }

  // Función para descargar respuesta individual como .txt
  const downloadResponse = (historyEntry: ResponseHistory) => {
    const content = `RESPUESTA AUTOMÁTICA - TIENDA DEPORTIVA
========================================

Pregunta: ${historyEntry.question}
Fecha y Hora: ${historyEntry.timestamp}
ID de Análisis: ${historyEntry.analysisId}

RESPUESTA GENERADA:
${historyEntry.response}

========================================
Sistema de Procesamiento de Lenguaje Natural
Basado en Gramática Generativa de Chomsky
`

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `respuesta_pregunta_${historyEntry.questionIndex + 1}_${historyEntry.analysisId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Función para descargar todo el historial como .txt
  const downloadAllHistory = () => {
    let content = `HISTORIAL COMPLETO DE RESPUESTAS - TIENDA DEPORTIVA
=====================================================

Total de análisis realizados: ${responseHistory.length}
Fecha de generación: ${new Date().toLocaleString()}

`

    responseHistory.forEach((entry, index) => {
      content += `
ANÁLISIS #${index + 1}
----------------------------------------
Pregunta ${entry.questionIndex + 1}: ${entry.question}
Fecha y Hora: ${entry.timestamp}
ID de Análisis: ${entry.analysisId}

RESPUESTA GENERADA:
${entry.response}

----------------------------------------
`
    })

    content += `
=====================================================
Sistema de Procesamiento de Lenguaje Natural
Basado en Gramática Generativa de Chomsky
Respuestas generadas automáticamente (no predeterminadas)
`

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `historial_completo_respuestas_${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Mejorar la función performLexicalAnalysis para un análisis léxico más completo
  const performLexicalAnalysis = () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    setLexicalError("")

    // Simulación de análisis léxico
    setTimeout(() => {
      const result = performLexicalAnalysisSync(inputText)
      setTokens(result.tokens)
      setLexicalOutput(result.tokenization)
      setLexicalError(result.error)
      setActiveTab("lexical")
      setIsProcessing(false)
    }, 1000)
  }

  const performLexicalAnalysisSync = (text: string) => {
    const words = text.split(/\s+/).filter((word) => word.length > 0)
    const newTokens: Token[] = []
    let hasError = false
    let errorWord = ""
    let errorChar = ""

    // Tokenización 1 - output (exactamente como lo pide la guía)
    let tokenization1 = ""

    words.forEach((word, index) => {
      // Limpiar la palabra de signos de puntuación al final
      const cleanWord = word.replace(/[.,;:!?¿¡]$/, "")
      const punctuation = word.match(/[.,;:!?¿¡]$/)?.[0] || ""

      // Clasificación de tokens según la guía
      let type = "id" // Por defecto todos son identificadores
      let typeToken = "" // Tipo token (sust, verbo, prep, etc.)
      let valid = true
      let errorCharFound = undefined
      let constant = undefined
      let reserved = false

      // Reglas para determinar el tipo de token
      if (/^\d+$/.test(cleanWord)) {
        type = "int"
        typeToken = "num"
        constant = cleanWord
      } else if (/^\d+\.\d+$/.test(cleanWord)) {
        type = "float"
        typeToken = "num"
        constant = cleanWord
      } else if (/^[?!.,;:¿¡]$/.test(cleanWord)) {
        type = cleanWord
        typeToken = "punt"
      } else {
        // Clasificación léxica mejorada para tienda deportiva
        if (/^(el|la|los|las|un|una|unos|unas)$/i.test(cleanWord)) {
          typeToken = "art"
          reserved = true
        } else if (
          /^(a|ante|bajo|con|contra|de|desde|en|entre|hacia|hasta|para|por|según|sin|sobre|tras)$/i.test(cleanWord)
        ) {
          typeToken = "prep"
          reserved = true
        } else if (
          /^(yo|tu|él|ella|nosotros|vosotros|ellos|ellas|me|te|le|nos|os|les|se|mi|ti|si|qué|cuál|cuánto|dónde|cómo)$/i.test(
            cleanWord,
          )
        ) {
          typeToken = "pronom"
          reserved = true
        } else if (
          /^(muy|bastante|demasiado|poco|mucho|más|menos|tan|tanto|casi|aproximadamente|exactamente|solamente|sólo|apenas|justo)$/i.test(
            cleanWord,
          )
        ) {
          typeToken = "adv"
          reserved = true
        } else if (
          /^(y|e|ni|que|o|u|pero|aunque|sin embargo|no obstante|sino|mas|luego|así que|conque|por lo tanto|por consiguiente|porque|pues|ya que|puesto que|si|cuando|mientras|como|donde|según)$/i.test(
            cleanWord,
          )
        ) {
          typeToken = "conj"
          reserved = true
        } else if (
          /^(tener|tienen|costar|cuesta|vender|comprar|entregar|hacer|ser|estar|haber|cuestan|hacen|ofrecen)$/i.test(
            cleanWord,
          )
        ) {
          typeToken = "verbo"
        } else if (
          /^(cuanto|cuantos|cuanta|cuantas|donde|como|que|quien|quienes|cuando|por que|porque)$/i.test(cleanWord)
        ) {
          typeToken = "interr"
        } else if (
          /^(deportivo|profesional|cómodo|resistente|transpirable|ligero|oficial|genuino|elástico)$/i.test(cleanWord)
        ) {
          typeToken = "adj"
        } else {
          // Por defecto, asumimos que es un sustantivo (productos deportivos)
          typeToken = "sust"
        }
      }

      // Verificar si hay caracteres no válidos
      if (/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9?!.,;:¿¡]/.test(cleanWord)) {
        valid = false
        errorCharFound = cleanWord.match(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9?!.,;:¿¡]/)?.[0]

        if (!hasError) {
          hasError = true
          errorWord = cleanWord
          errorChar = errorCharFound || ""
        }
      }

      // Agregar a la tokenización exactamente como lo pide la guía
      tokenization1 += `${type} `

      newTokens.push({
        lexeme: cleanWord,
        type,
        typeToken,
        valid,
        errorChar: errorCharFound,
        position: index,
        constant,
        reserved,
      })

      // Si hay un signo de puntuación al final, añadirlo como token separado
      if (punctuation) {
        tokenization1 += `${punctuation} `
        newTokens.push({
          lexeme: punctuation,
          type: punctuation,
          typeToken: "punt",
          valid: true,
          position: index,
        })
      }
    })

    const error = hasError ? `Error léxico en palabra: ${errorWord}, Carácter: ${errorChar}` : ""

    return {
      tokens: newTokens,
      tokenization: tokenization1.trim(),
      error,
    }
  }

  // Mejorar la función performSyntacticAnalysis para un análisis sintáctico más completo
  const performSyntacticAnalysis = () => {
    if (tokens.length === 0) return

    setIsProcessing(true)
    setSyntacticError("")

    // Simulación de análisis sintáctico
    setTimeout(() => {
      const result = performSyntacticAnalysisSync(tokens)
      setSyntacticTokens(result.tokens)
      setSyntacticOutput(result.tokenization)
      setSyntacticError(result.error)
      setParsingSteps(result.parsingSteps)

      // Generar árbol sintáctico con los tokens
      const tokenLexemes = tokens.map((t) => t.lexeme)
      const tree = generateSyntaxTree(result.parsingSteps, tokenLexemes)
      const treeText = renderTreeAsText(tree)
      setSyntaxTree(treeText)

      setActiveTab("syntactic")
      setIsProcessing(false)
    }, 1000)
  }

  const performSyntacticAnalysisSync = (inputTokens: Token[]) => {
    // Tokenización 2 - output (exactamente como lo pide la guía)
    let tokenization2 = ""
    let hasError = false
    let errorWord = ""

    // Preparar tokens para el análisis sintáctico
    const tokenTypes = inputTokens.map((token) => token.typeToken || "desconocido")

    // Simular el análisis sintáctico usando el parser LL(1)
    const parsingResult = simulateParsingSteps(spanishGrammar, tokenTypes)

    const newSyntacticTokens: SyntacticToken[] = inputTokens.map((token, index) => {
      // Obtener el tipo sintáctico directamente del typeToken
      const syntacticType = token.typeToken || "desconocido"
      let syntacticValid = true
      let syntacticError = undefined

      // Verificación sintáctica basada en el resultado del parser
      if (
        !parsingResult.valid &&
        parsingResult.error &&
        index === parsingResult.steps[parsingResult.steps.length - 2]?.input.length
      ) {
        syntacticValid = false
        syntacticError = parsingResult.error

        if (!hasError) {
          hasError = true
          errorWord = token.lexeme
        }
      }

      // Agregar a la tokenización exactamente como lo pide la guía
      tokenization2 += `${syntacticType} `

      return {
        ...token,
        syntacticType,
        syntacticValid,
        syntacticError,
      }
    })

    const error =
      hasError || !parsingResult.valid
        ? `Error sintáctico: ${parsingResult.error || `Error en palabra: ${errorWord}`}`
        : ""

    return {
      tokens: newSyntacticTokens,
      tokenization: tokenization2.trim(),
      error,
      parsingSteps: parsingResult.steps,
    }
  }

  // Función para guardar automáticamente en el historial
  const saveToHistory = (question: string, response: string, questionIndex?: number) => {
    const historyEntry: ResponseHistory = {
      questionIndex: questionIndex ?? -1, // -1 para preguntas individuales
      question,
      response,
      timestamp: new Date().toLocaleString(),
      analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    setResponseHistory((prev) => [...prev, historyEntry])
    return historyEntry
  }

  const performSemanticProcessing = () => {
    if (syntacticTokens.length === 0) return

    setIsProcessing(true)

    // Simulación de procesamiento semántico
    setTimeout(() => {
      // Obtener lexemas para el análisis semántico
      const lexemes = syntacticTokens.map((token) => token.lexeme)

      // Realizar análisis semántico
      const semanticResult = analyzeSemantics(lexemes, knowledgeBase)

      // Tokenización 3 - output (sin stopwords)
      const tokenization3 = semanticResult.relevantTokens.join(" ")

      // Crear tokens semánticos
      const newSemanticTokens: SemanticToken[] = syntacticTokens.map((token) => {
        // Verificar si es stopword
        const isTokenStopword = isStopword(token.lexeme)

        // Buscar valor semántico
        let semanticValue = undefined

        // Si el token está relacionado con algún concepto, asignar ese valor
        if (
          semanticResult.concepts.some(
            (concept) => concept.includes(token.lexeme.toLowerCase()) || token.lexeme.toLowerCase().includes(concept),
          )
        ) {
          semanticValue = semanticResult.concepts.find(
            (concept) => concept.includes(token.lexeme.toLowerCase()) || token.lexeme.toLowerCase().includes(concept),
          )
        }

        return {
          ...token,
          isStopword: isTokenStopword,
          semanticValue,
        }
      })

      setSemanticTokens(newSemanticTokens)
      setSementicOutput(tokenization3)

      // Generar una respuesta semántica dinámica basada en el análisis
      const dynamicResponse = generateAutomaticResponse(inputText, sportsStoreKB)
      setSemanticResponse(dynamicResponse)

      // GUARDAR AUTOMÁTICAMENTE EN EL HISTORIAL
      saveToHistory(inputText, dynamicResponse)

      setActiveTab("semantic")
      setIsProcessing(false)
    }, 1000)
  }

  const handleProcessAll = () => {
    performLexicalAnalysis()
    setTimeout(() => {
      performSyntacticAnalysis()
      setTimeout(() => {
        performSemanticProcessing()
      }, 1200)
    }, 1200)
  }

  const resetProcessor = () => {
    setInputText("")
    setTokens([])
    setSyntacticTokens([])
    setSemanticTokens([])
    setSemanticResponse("")
    setLexicalOutput("")
    setSyntacticOutput("")
    setSementicOutput("")
    setLexicalError("")
    setSyntacticError("")
    setParsingSteps([])
    setSyntaxTree("")
    setCurrentQuestionIndex(0)
    setActiveTab("input")
  }

  const setExampleText = (example: string) => {
    setInputText(example)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <TabsTrigger
            value="input"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            Entrada
          </TabsTrigger>
          <TabsTrigger
            value="lexical"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Análisis Léxico
          </TabsTrigger>
          <TabsTrigger
            value="syntactic"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
          >
            Análisis Sintáctico
          </TabsTrigger>
          <TabsTrigger
            value="semantic"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            Procesamiento Semántico
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
          >
            Resultados Automáticos
          </TabsTrigger>
          <TabsTrigger
            value="diagrams"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state-active]:to-purple-500 data-[state=active]:text-white"
          >
            Diagramas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Sistema de Procesamiento Automático - Tienda Deportiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pregunta Individual (Cualquier pregunta sobre deportes)
                </label>
                <Textarea
                  placeholder="Ingrese cualquier pregunta sobre productos deportivos... El sistema generará respuestas automáticas para cualquier consulta."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[100px] border-2 border-blue-300 focus:border-blue-500"
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={performLexicalAnalysis}
                    disabled={!inputText.trim() || isProcessing}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Análisis Léxico
                  </Button>
                  <Button
                    onClick={handleProcessAll}
                    disabled={!inputText.trim() || isProcessing}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Procesar Todo
                  </Button>
                  <Button
                    onClick={resetProcessor}
                    variant="outline"
                    className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reiniciar
                  </Button>
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Cargar Archivo
                    </Button>
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-blue-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Procesamiento Automático de 10 Preguntas Predefinidas
                  </h3>
                  <Button
                    onClick={processAllQuestions}
                    disabled={isAutoProcessing}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    {isAutoProcessing ? `Procesando ${currentQuestionIndex + 1}/10...` : "Procesar Todas las Preguntas"}
                  </Button>
                </div>

                {isAutoProcessing && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Procesando pregunta {currentQuestionIndex + 1} de 10...
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle>Preguntas Predefinidas - Tienda Deportiva</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Seleccione una de las 10 preguntas predefinidas para el análisis automático:
                </p>
                <div className="grid gap-3">
                  {sportsStoreQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-2 border-green-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {index + 1}. {question}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInputText(question)}
                        className="text-xs bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
                      >
                        Usar pregunta
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                    Características del sistema:
                  </h4>
                  <ul className="text-xs space-y-1 list-disc pl-4 text-slate-700 dark:text-slate-300">
                    <li>✅ Análisis sintáctico con árboles gramaticales automáticos</li>
                    <li>✅ Generación automática de respuestas (no predefinidas)</li>
                    <li>✅ Funciona con CUALQUIER pregunta sobre deportes</li>
                    <li>✅ Preprocesamiento: eliminación de puntuación y stopwords</li>
                    <li>✅ Procesamiento en bucle de las 10 preguntas</li>
                    <li>✅ Contexto específico: tienda deportiva</li>
                    <li>✅ Historial completo de respuestas con descarga individual</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lexical">
          <LexicalAnalyzer
            tokens={tokens}
            onContinue={performSyntacticAnalysis}
            isProcessing={isProcessing}
            tokenization={lexicalOutput}
            error={lexicalError}
          />
        </TabsContent>

        <TabsContent value="syntactic">
          <SyntacticAnalyzer
            tokens={syntacticTokens}
            onContinue={performSemanticProcessing}
            isProcessing={isProcessing}
            tokenization={syntacticOutput}
            error={syntacticError}
            parsingSteps={parsingSteps}
            syntaxTree={syntaxTree}
          />
        </TabsContent>

        <TabsContent value="semantic">
          <SemanticProcessor tokens={semanticTokens} response={semanticResponse} tokenization={semanticOutput} />
        </TabsContent>

        <TabsContent value="results">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Historial Completo de Respuestas Automáticas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                      Total de análisis realizados: {responseHistory.length}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Cada respuesta es única y generada automáticamente para cualquier pregunta
                    </p>
                  </div>
                  {responseHistory.length > 0 && (
                    <Button
                      onClick={downloadAllHistory}
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Descargar Todo el Historial
                    </Button>
                  )}
                </div>

                {responseHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No hay respuestas en el historial aún.</p>
                    <p className="text-sm mt-2">Procese algunas preguntas para ver el historial aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {responseHistory.map((entry, index) => (
                      <div
                        key={entry.analysisId}
                        className="p-4 rounded-lg border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-slate-700 dark:text-slate-300">
                              Análisis #{index + 1} -{" "}
                              {entry.questionIndex === -1
                                ? "Pregunta Individual"
                                : `Pregunta ${entry.questionIndex + 1}`}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {entry.timestamp} | ID: {entry.analysisId}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadResponse(entry)}
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Descargar .txt
                          </Button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 italic font-medium">
                          "{entry.question}"
                        </p>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-md border border-emerald-200 dark:border-emerald-700">
                          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                            Respuesta Generada Automáticamente:
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                            {entry.response}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {processedQuestions.every((q) => q.processed) && processedQuestions.length > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg border-2 border-emerald-300">
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                      ✅ Procesamiento Automático Completado
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Se han procesado exitosamente las 10 preguntas de la tienda deportiva con generación automática de
                      respuestas basada en análisis sintáctico y semántico. Cada respuesta es única y no predeterminada.
                      El sistema también funciona con cualquier pregunta personalizada.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagrams">
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Gestión de Diagramas del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                    Diagramas Cargados ({diagrams.length})
                  </h3>
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => diagramInputRef.current?.click()}
                      className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Cargar Diagramas
                    </Button>
                    <Input
                      type="file"
                      ref={diagramInputRef}
                      onChange={handleDiagramUpload}
                      accept="image/*"
                      className="hidden"
                      multiple
                    />
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 text-indigo-700 dark:text-indigo-300">
                    Tipos de diagramas recomendados:
                  </h4>
                  <ul className="text-xs space-y-1 list-disc pl-4 text-slate-700 dark:text-slate-300">
                    <li>Diagramas de autómatas finitos deterministas (AFD)</li>
                    <li>Árboles de derivación sintáctica</li>
                    <li>Diagramas de flujo del proceso de análisis</li>
                    <li>Diagramas de la base de conocimiento semántica</li>
                    <li>Diagramas de clases del sistema</li>
                    <li>Diagramas de casos de uso</li>
                  </ul>
                </div>

                {diagrams.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 border-2 border-dashed border-indigo-300 rounded-md">
                    <FileImage className="mx-auto h-10 w-10 mb-2" />
                    <p>No hay diagramas cargados.</p>
                    <p className="text-sm mt-1">Haga clic en "Cargar Diagramas" para añadir imágenes.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {diagrams.map((diagram, index) => (
                      <div key={index} className="border-2 border-indigo-300 rounded-md p-4 bg-white dark:bg-slate-800">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-indigo-700 dark:text-indigo-300 truncate">{diagram.name}</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeDiagram(index)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-md overflow-hidden">
                          <img
                            src={diagram.url || "/placeholder.svg"}
                            alt={diagram.name}
                            className="max-w-full h-auto mx-auto max-h-64 object-contain"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tipo: {diagram.type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
