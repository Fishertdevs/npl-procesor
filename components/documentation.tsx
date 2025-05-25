"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, BookOpen, Code, Database, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { jsPDF } from "jspdf"

export const Documentation = () => {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [diagrams, setDiagrams] = useState<{ name: string; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentationRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newDiagrams = [...diagrams]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        newDiagrams.push({ name: file.name, url })
      }
    }

    setDiagrams(newDiagrams)

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Método para generar PDF
  const generatePDF = () => {
    if (!documentationRef.current) return

    setIsGeneratingPDF(true)

    try {
      // Crear un nuevo documento PDF
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()

      // Añadir título y subtítulo
      pdf.setFontSize(20)
      pdf.setTextColor(0, 51, 102)
      pdf.text("Documentación del Procesador de Lenguaje Natural", pdfWidth / 2, 15, { align: "center" })
      pdf.setFontSize(12)
      pdf.setTextColor(102, 102, 102)
      pdf.text("Basado en la gramática generativa de Noam Chomsky", pdfWidth / 2, 22, { align: "center" })
      pdf.setTextColor(0, 0, 0)

      // Añadir tabla de contenidos
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Tabla de Contenidos", 10, 35)
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)

      let tocY = 45
      pdf.text("1. Descripción del Proyecto", 15, tocY)
      tocY += 5
      pdf.text("2. Análisis Léxico", 15, tocY)
      tocY += 5
      pdf.text("3. Análisis Sintáctico", 15, tocY)
      tocY += 5
      pdf.text("4. Análisis Semántico", 15, tocY)
      tocY += 5
      pdf.text("5. Diagramas del Proyecto", 15, tocY)
      tocY += 5

      // Sección: Descripción del Proyecto
      pdf.addPage()
      let y = 20

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(0, 51, 102)
      pdf.text("1. Descripción del Proyecto", 10, y)
      pdf.setTextColor(0, 0, 0)
      y += 10

      pdf.setFontSize(14)
      pdf.text("1.1 Contexto y Fundamentos Teóricos", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "El procesamiento de lenguaje natural (PLN) es un campo de la inteligencia artificial que se centra en la interacción entre las computadoras y el lenguaje humano. Este proyecto implementa un procesador de lenguaje natural basado en los principios de la gramática generativa desarrollada por Noam Chomsky, uno de los lingüistas más influyentes del siglo XX.",
        y,
      )

      y = addParagraph(
        pdf,
        "La gramática generativa de Chomsky propone que el lenguaje humano se basa en un conjunto finito de reglas que pueden generar un número infinito de oraciones gramaticalmente correctas. Este modelo teórico sirve como base para nuestro sistema de procesamiento lingüístico, que analiza oraciones en español a través de tres niveles fundamentales: léxico, sintáctico y semántico.",
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("1.2 Objetivos del Proyecto", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "El objetivo principal de este proyecto es implementar un sistema completo de procesamiento de lenguaje natural que pueda:",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Analizar la estructura léxica de oraciones en español, identificando tokens y clasificándolos según su tipo.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Verificar la corrección sintáctica de las oraciones según las reglas gramaticales del español.",
        y,
      )

      y = addBulletPoint(pdf, "Extraer el significado semántico de las oraciones mediante una base de conocimiento.", y)

      y = addBulletPoint(
        pdf,
        "Proporcionar una interfaz interactiva que permita visualizar cada fase del procesamiento.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Servir como herramienta educativa para comprender los principios de la lingüística computacional.",
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("1.3 Características Principales", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(pdf, "El sistema cuenta con las siguientes características principales:", y)

      y = addBulletPoint(
        pdf,
        "Análisis léxico mediante autómatas finitos deterministas (AFD) que reconocen diferentes tipos de tokens.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Análisis sintáctico utilizando gramáticas libres de contexto y un parser LL(1) para verificar la estructura gramatical.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Procesamiento semántico con una base de conocimiento extensible que permite la interpretación del significado.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Interfaz interactiva que muestra paso a paso el proceso de análisis y los resultados de cada fase.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Detección y reporte de errores léxicos y sintácticos con información detallada sobre la naturaleza del error.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Soporte para carga de archivos de texto para procesar oraciones desde fuentes externas.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Visualización de la tabla de símbolos, la pila de análisis y las relaciones semánticas identificadas.",
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("1.4 Tecnologías Utilizadas", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(pdf, "El proyecto ha sido desarrollado utilizando las siguientes tecnologías:", y)

      y = addBulletPoint(
        pdf,
        "Next.js y React: Framework y biblioteca de JavaScript para la construcción de interfaces de usuario interactivas.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "TypeScript: Superset de JavaScript que añade tipado estático para mejorar la robustez y mantenibilidad del código.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Tailwind CSS: Framework de CSS utilitario para el diseño y estilizado de la interfaz.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Algoritmos de PLN: Implementaciones personalizadas de autómatas finitos, parsers LL(1) y procesamiento semántico.",
        y,
      )

      // Sección: Análisis Léxico
      pdf.addPage()
      y = 20

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(0, 51, 102)
      pdf.text("2. Análisis Léxico", 10, y)
      pdf.setTextColor(0, 0, 0)
      y += 10

      pdf.setFontSize(14)
      pdf.text("2.1 Fundamentos Teóricos", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "El análisis léxico es la primera fase del procesamiento de lenguaje natural y consiste en la descomposición del texto de entrada en unidades léxicas llamadas tokens. Este proceso es fundamental para las fases posteriores, ya que proporciona la estructura básica sobre la que se realizará el análisis sintáctico y semántico.",
        y,
      )

      y = addParagraph(
        pdf,
        "En nuestro sistema, el análisis léxico se implementa mediante autómatas finitos deterministas (AFD), que son modelos computacionales capaces de reconocer lenguajes regulares. Cada autómata está diseñado para reconocer un tipo específico de token, como identificadores, números, palabras reservadas o símbolos.",
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("2.2 Autómatas Finitos Deterministas (AFD)", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "Un autómata finito determinista (AFD) se define formalmente como una 5-tupla (Q, Σ, δ, q0, F) donde:",
        y,
      )

      y = addBulletPoint(pdf, "Q es un conjunto finito de estados", y)
      y = addBulletPoint(pdf, "Σ es un alfabeto finito", y)
      y = addBulletPoint(pdf, "δ: Q × Σ → Q es la función de transición", y)
      y = addBulletPoint(pdf, "q0 ∈ Q es el estado inicial", y)
      y = addBulletPoint(pdf, "F ⊆ Q es el conjunto de estados de aceptación", y)

      y = addParagraph(pdf, "En nuestro sistema, hemos implementado los siguientes autómatas:", y)

      y = addBulletPoint(
        pdf,
        "Autómata para identificadores: Reconoce identificadores que comienzan con una letra o guion bajo y pueden contener letras, dígitos o guiones bajos.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Autómata para verbos: Reconoce palabras que siguen los patrones morfológicos de los verbos en español.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Autómata para sustantivos: Reconoce palabras que siguen los patrones morfológicos de los sustantivos en español.",
        y,
      )

      y = addBulletPoint(pdf, "Autómata para números: Reconoce constantes numéricas enteras y decimales.", y)

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("2.3 Proceso de Tokenización", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(pdf, "El proceso de tokenización sigue los siguientes pasos:", y)

      y = addBulletPoint(
        pdf,
        "Segmentación: La entrada se divide en unidades léxicas (palabras y signos de puntuación).",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Clasificación: Cada unidad léxica se clasifica según su tipo (identificador, número, palabra reservada, etc.).",
        y,
      )

      y = addBulletPoint(pdf, "Validación: Se verifica que cada token sea válido según las reglas del lenguaje.", y)

      y = addBulletPoint(
        pdf,
        "Generación de la tabla de símbolos: Se crea una tabla con información detallada sobre cada token.",
        y,
      )

      y = addParagraph(
        pdf,
        "La salida del proceso de tokenización es una secuencia de tokens con sus respectivos tipos y atributos, que servirá como entrada para el análisis sintáctico.",
        y,
      )

      y = addParagraph(pdf, "Ejemplo de tokenización:", y)

      y = addCodeBlock(
        pdf,
        `Entrada: "El gato come pescado"
Tokenización: id id id id
Tokens: [
  { lexeme: "El", type: "id", typeToken: "art" },
  { lexeme: "gato", type: "id", typeToken: "sust" },
  { lexeme: "come", type: "id", typeToken: "verbo" },
  { lexeme: "pescado", type: "id", typeToken: "sust" }
]`,
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("2.4 Detección de Errores Léxicos", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(pdf, "El analizador léxico es capaz de detectar diversos tipos de errores, como:", y)

      y = addBulletPoint(pdf, "Caracteres no válidos: Caracteres que no pertenecen al alfabeto del lenguaje.", y)

      y = addBulletPoint(pdf, "Tokens malformados: Tokens que no siguen las reglas de formación del lenguaje.", y)

      y = addBulletPoint(pdf, "Secuencias inválidas: Combinaciones de caracteres que no forman tokens válidos.", y)

      y = addParagraph(
        pdf,
        "Cuando se detecta un error, el analizador reporta la palabra específica donde ocurrió el error y el carácter que lo causó, permitiendo una fácil identificación y corrección del problema.",
        y,
      )

      y = addParagraph(pdf, "Ejemplo de error léxico:", y)

      y = addCodeBlock(
        pdf,
        `Entrada: "El gat0 come pescado"
Error: Error léxico en palabra: gat0, Carácter: 0`,
        y,
      )

      // Sección: Análisis Sintáctico
      pdf.addPage()
      y = 20

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(0, 51, 102)
      pdf.text("3. Análisis Sintáctico", 10, y)
      pdf.setTextColor(0, 0, 0)
      y += 10

      pdf.setFontSize(14)
      pdf.text("3.1 Gramática Libre de Contexto", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "Una gramática libre de contexto (GLC) es un formalismo que permite describir la estructura sintáctica de un lenguaje. Se define formalmente como una 4-tupla (N, Σ, P, S) donde:",
        y,
      )

      y = addBulletPoint(pdf, "N es un conjunto finito de símbolos no terminales", y)
      y = addBulletPoint(pdf, "Σ es un conjunto finito de símbolos terminales (disjunto de N)", y)
      y = addBulletPoint(
        pdf,
        "P es un conjunto finito de reglas de producción de la forma A → α, donde A ∈ N y α ∈ (N ∪ Σ)*",
        y,
      )
      y = addBulletPoint(pdf, "S ∈ N es el símbolo inicial", y)

      y = addParagraph(
        pdf,
        "En nuestro sistema, utilizamos una gramática libre de contexto basada en el modelo de Chomsky para definir la estructura de las oraciones en español. Esta gramática incluye reglas para sintagmas nominales, sintagmas verbales, determinantes, sustantivos, verbos, adjetivos, adverbios y preposiciones.",
        y,
      )

      y = addParagraph(pdf, "Gramática simplificada para oraciones en español:", y)

      y = addCodeBlock(
        pdf,
        `S → SN SV
SN → Det N | Det N Adj | N | N Adj
SV → V | V SN | V Adv | V Adv SN
SP → Prep SN
Det → el | la | los | las | un | una | unos | unas
N → sustantivo
V → verbo
Adj → adjetivo
Adv → adverbio
Prep → a | ante | bajo | con | contra | de | desde | en | entre | hacia | hasta | para | por | según | sin | sobre | tras`,
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("3.2 Parser LL(1)", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "Un parser LL(1) es un analizador sintáctico descendente que construye el árbol de derivación de arriba hacia abajo, de izquierda a derecha, utilizando un símbolo de anticipación para decidir qué producción aplicar. El '(1)' indica que solo se utiliza un símbolo de anticipación.",
        y,
      )

      y = addParagraph(
        pdf,
        "El parser LL(1) utiliza una tabla de análisis sintáctico para determinar qué producción aplicar en cada paso del análisis. Esta tabla mapea pares de no terminales y terminales a producciones de la gramática.",
        y,
      )

      y = addParagraph(pdf, "Algoritmo del parser LL(1):", y)

      y = addBulletPoint(pdf, "Inicializar la pila con el símbolo inicial de la gramática", y)
      y = addBulletPoint(pdf, "Mientras la pila no esté vacía:", y)
      y = addBulletPoint(
        pdf,
        "    - Si el tope de la pila es un terminal, compararlo con el símbolo actual de entrada",
        y,
      )
      y = addBulletPoint(pdf, "    - Si coinciden, desapilar y avanzar en la entrada", y)
      y = addBulletPoint(pdf, "    - Si no coinciden, reportar un error", y)
      y = addBulletPoint(pdf, "    - Si el tope de la pila es un no terminal, consultar la tabla de análisis", y)
      y = addBulletPoint(pdf, "    - Reemplazar el no terminal por la producción correspondiente", y)
      y = addBulletPoint(pdf, "Si la pila está vacía y se ha consumido toda la entrada, la oración es válida", y)

      y = addParagraph(pdf, "Ejemplo de análisis sintáctico:", y)

      y = addCodeBlock(
        pdf,
        `Entrada: "El gato come pescado"
Tokens: [art, sust, verbo, sust]
Pila inicial: [S]
Paso 1: [SN, SV] (Expandir S → SN SV)
Paso 2: [Det, N, SV] (Expandir SN → Det N)
Paso 3: [art, N, SV] (Expandir Det → art)
Paso 4: [N, SV] (Coincidir art)
Paso 5: [sust, SV] (Expandir N → sust)
Paso 6: [SV] (Coincidir sust)
Paso 7: [V, SN] (Expandir SV → V SN)
Paso 8: [verbo, SN] (Expandir V → verbo)
Paso 9: [SN] (Coincidir verbo)
Paso 10: [Det, N] (Expandir SN → Det N)
Paso 11: [sust] (Expandir N → sust)
Paso 12: [] (Coincidir sust)
Resultado: Oración correcta sintácticamente`,
        y,
      )

      pdf.addPage()
      y = 20

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("3.3 Tabla de Análisis LL(1)", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "La tabla de análisis LL(1) es una estructura fundamental para el parser LL(1). Se construye a partir de la gramática y mapea pares de no terminales y terminales a producciones. Para cada no terminal A y terminal a, la tabla indica qué producción de A debe aplicarse cuando se encuentra a en la entrada.",
        y,
      )

      y = addParagraph(
        pdf,
        "La construcción de la tabla LL(1) implica calcular los conjuntos FIRST y FOLLOW para cada símbolo no terminal de la gramática:",
        y,
      )

      y = addBulletPoint(
        pdf,
        "FIRST(α): conjunto de terminales que pueden aparecer al inicio de una cadena derivada de α",
        y,
      )
      y = addBulletPoint(
        pdf,
        "FOLLOW(A): conjunto de terminales que pueden aparecer inmediatamente después de A en alguna forma sentencial",
        y,
      )

      y = addParagraph(
        pdf,
        "Para cada producción A → α y cada terminal a ∈ FIRST(α), se añade la entrada [A, a] = α a la tabla. Si ε ∈ FIRST(α), entonces para cada terminal b ∈ FOLLOW(A), se añade la entrada [A, b] = α.",
        y,
      )

      y = addParagraph(pdf, "Ejemplo simplificado de tabla LL(1) para nuestra gramática:", y)

      // Simulación de tabla con texto
      y += 5
      pdf.text("No Terminal", 15, y)
      pdf.text("art", 60, y)
      pdf.text("sust", 90, y)
      pdf.text("verbo", 120, y)
      y += 5
      pdf.line(10, y, 180, y)
      y += 5

      pdf.text("S", 15, y)
      pdf.text("S → SN SV", 60, y)
      pdf.text("S → SN SV", 90, y)
      pdf.text("", 120, y)
      y += 5

      pdf.text("SN", 15, y)
      pdf.text("SN → Det N", 60, y)
      pdf.text("SN → N", 90, y)
      pdf.text("", 120, y)
      y += 5

      pdf.text("SV", 15, y)
      pdf.text("", 60, y)
      pdf.text("", 90, y)
      pdf.text("SV → V | V SN", 120, y)
      y += 5

      pdf.text("Det", 15, y)
      pdf.text("Det → art", 60, y)
      pdf.text("", 90, y)
      pdf.text("", 120, y)
      y += 5

      pdf.text("N", 15, y)
      pdf.text("", 60, y)
      pdf.text("N → sust", 90, y)
      pdf.text("", 120, y)
      y += 5

      pdf.text("V", 15, y)
      pdf.text("", 60, y)
      pdf.text("", 90, y)
      pdf.text("V → verbo", 120, y)
      y += 10

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("3.4 Detección de Errores Sintácticos", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(pdf, "El analizador sintáctico es capaz de detectar diversos tipos de errores, como:", y)

      y = addBulletPoint(
        pdf,
        "Secuencias de tokens que no siguen las reglas gramaticales (por ejemplo, dos verbos consecutivos).",
        y,
      )

      y = addBulletPoint(pdf, "Estructuras de frase incorrectas (por ejemplo, un sintagma nominal sin sustantivo).", y)

      y = addBulletPoint(pdf, "Tokens inesperados en determinadas posiciones de la oración.", y)

      y = addBulletPoint(pdf, "Oraciones incompletas que no pueden derivarse completamente de la gramática.", y)

      y = addParagraph(
        pdf,
        "Cuando se detecta un error, el analizador reporta la palabra específica donde ocurrió el error y una descripción del problema encontrado, facilitando la identificación y corrección del error.",
        y,
      )

      y = addParagraph(pdf, "Ejemplo de error sintáctico:", y)

      y = addCodeBlock(
        pdf,
        `Entrada: "El gato come rápido pescado"
Error: No hay producción para SV con el token 'adv'`,
        y,
      )

      // Sección: Análisis Semántico
      pdf.addPage()
      y = 20

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(0, 51, 102)
      pdf.text("4. Análisis Semántico", 10, y)
      pdf.setTextColor(0, 0, 0)
      y += 10

      pdf.setFontSize(14)
      pdf.text("4.1 Base de Conocimiento", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "La base de conocimiento es una estructura de datos que contiene información sobre conceptos, sus relaciones y propiedades. Esta base es fundamental para el procesamiento semántico, ya que proporciona el contexto necesario para interpretar el significado de las oraciones.",
        y,
      )

      y = addParagraph(pdf, "Estructura de la base de conocimiento:", y)

      y = addCodeBlock(
        pdf,
        `interface KnowledgeBase {
  concepts: Record<string, ConceptInfo>
}

interface ConceptInfo {
  synonyms: string[]
  associations: string[]
  description: string
}`,
        y,
      )

      y = addParagraph(pdf, "Cada concepto en la base de conocimiento incluye:", y)

      y = addBulletPoint(pdf, "Sinónimos: Términos alternativos que se refieren al mismo concepto.", y)
      y = addBulletPoint(pdf, "Asociaciones: Conceptos relacionados semánticamente.", y)
      y = addBulletPoint(pdf, "Descripción: Explicación detallada del concepto.", y)

      y = addParagraph(pdf, "Ejemplo de entrada en la base de conocimiento:", y)

      y = addCodeBlock(
        pdf,
        `"computadora": {
  synonyms: ["ordenador", "PC", "laptop", "computador"],
  associations: ["tecnología", "hardware", "software", "dispositivo"],
  description: "Dispositivo electrónico que procesa datos según instrucciones almacenadas."
}`,
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("4.2 Procesamiento de Stopwords", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "Las stopwords (palabras vacías) son palabras muy comunes que generalmente no aportan significado relevante al análisis semántico. Ejemplos de stopwords en español incluyen artículos (el, la, los), preposiciones (a, de, en), conjunciones (y, o, pero) y algunos pronombres.",
        y,
      )

      y = addParagraph(
        pdf,
        "El proceso de eliminación de stopwords consiste en filtrar estas palabras del texto antes de realizar el análisis semántico, lo que permite concentrarse en las palabras con mayor carga semántica (sustantivos, verbos, adjetivos y adverbios significativos).",
        y,
      )

      y = addParagraph(pdf, "Beneficios de la eliminación de stopwords:", y)

      y = addBulletPoint(pdf, "Reducción del ruido en el análisis semántico", y)
      y = addBulletPoint(pdf, "Mejora de la eficiencia del procesamiento", y)
      y = addBulletPoint(pdf, "Enfoque en las palabras con mayor contenido semántico", y)
      y = addBulletPoint(pdf, "Optimización de la identificación de conceptos relevantes", y)

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("4.3 Algoritmo de Porter para Stemming", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "El stemming es el proceso de reducir las palabras a su raíz o forma base. El algoritmo de Porter es uno de los métodos más utilizados para realizar stemming, y en nuestro sistema hemos implementado una adaptación para el español.",
        y,
      )

      y = addParagraph(pdf, "El algoritmo de Porter para español sigue estos pasos principales:", y)

      y = addBulletPoint(pdf, "Normalización: Convertir a minúsculas y eliminar acentos", y)
      y = addBulletPoint(pdf, "Eliminación de sufijos plurales: -es, -s", y)
      y = addBulletPoint(pdf, "Eliminación de diminutivos: -ito, -ita, -cito, -cita", y)
      y = addBulletPoint(pdf, "Eliminación de sufijos de adverbios: -mente", y)
      y = addBulletPoint(pdf, "Eliminación de sufijos verbales: -ando, -endo, -ar, -er, -ir, etc.", y)
      y = addBulletPoint(pdf, "Eliminación de sufijos nominales: -anza, -ismo, -able, -ible, etc.", y)

      y = addParagraph(pdf, "Ejemplo de stemming:", y)

      y = addCodeBlock(
        pdf,
        `"computadoras" → "computador"
"rápidamente" → "rapid"
"programación" → "program"`,
        y,
      )

      y = addParagraph(
        pdf,
        "El stemming facilita la identificación de palabras relacionadas semánticamente, ya que reduce diferentes formas de una palabra a una raíz común.",
        y,
      )

      pdf.addPage()
      y = 20

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("4.4 Generación de Respuestas Semánticas", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "El proceso de generación de respuestas semánticas consiste en interpretar el significado de la oración analizada y producir una respuesta coherente basada en la base de conocimiento. Este proceso sigue los siguientes pasos:",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Identificación de conceptos: Se identifican los conceptos presentes en la oración mediante la comparación con la base de conocimiento.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Análisis de relaciones: Se analizan las relaciones entre los conceptos identificados.",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Extracción de estructura semántica: Se identifica la estructura semántica de la oración (sujeto, acción, objeto, modificadores).",
        y,
      )

      y = addBulletPoint(
        pdf,
        "Generación de respuesta: Se genera una respuesta basada en la información extraída y la base de conocimiento.",
        y,
      )

      y = addParagraph(pdf, "Ejemplo de generación de respuesta semántica:", y)

      y = addCodeBlock(
        pdf,
        `Entrada: "Cuanto vale una libra de café Aguila Roja?"
Conceptos identificados: ["café", "Aguila Roja", "libra"]
Estructura semántica: 
  - Consulta sobre precio
  - Producto: café Aguila Roja
  - Cantidad: una libra
Respuesta: "El precio de 1 libra de café Aguila Roja es $8000."`,
        y,
      )

      y = addParagraph(
        pdf,
        "La calidad de la respuesta semántica depende en gran medida de la riqueza de la base de conocimiento y de la precisión del análisis léxico y sintáctico previos.",
        y,
      )

      // Sección: Diagramas del Proyecto
      pdf.addPage()
      y = 20

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(0, 51, 102)
      pdf.text("5. Diagramas del Proyecto", 10, y)
      pdf.setTextColor(0, 0, 0)
      y += 10

      pdf.setFontSize(14)
      pdf.text("5.1 Diagramas Recomendados", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "Para una mejor comprensión del sistema, se recomienda la creación y visualización de los siguientes diagramas:",
        y,
      )

      y = addSubsection(pdf, "5.1.1 Diagrama de Autómatas Finitos", y)
      y = addParagraph(
        pdf,
        "Este diagrama representa gráficamente los autómatas finitos deterministas utilizados en el análisis léxico. Muestra los estados, transiciones y estados de aceptación de cada autómata, facilitando la comprensión del proceso de reconocimiento de tokens.",
        y,
      )

      y = addSubsection(pdf, "5.1.2 Diagrama de Árbol de Derivación", y)
      y = addParagraph(
        pdf,
        "Este diagrama muestra la estructura jerárquica de una oración según las reglas de la gramática. Cada nodo interno representa un símbolo no terminal, y cada hoja representa un símbolo terminal. El árbol ilustra cómo se deriva la oración a partir del símbolo inicial de la gramática.",
        y,
      )

      y = addSubsection(pdf, "5.1.3 Diagrama de Flujo del Proceso", y)
      y = addParagraph(
        pdf,
        "Este diagrama representa el flujo completo del procesamiento de lenguaje natural, desde la entrada de texto hasta la generación de la respuesta semántica. Muestra las diferentes fases del proceso y cómo se conectan entre sí.",
        y,
      )

      y = addSubsection(pdf, "5.1.4 Diagrama de la Base de Conocimiento", y)
      y = addParagraph(
        pdf,
        "Este diagrama ilustra la estructura de la base de conocimiento, mostrando los conceptos, sus relaciones y propiedades. Puede representarse como un grafo donde los nodos son conceptos y las aristas son relaciones entre ellos.",
        y,
      )

      y = addSubsection(pdf, "5.1.5 Diagrama de Clases del Sistema", y)
      y = addParagraph(
        pdf,
        "Este diagrama muestra la estructura de clases del sistema, incluyendo las clases, interfaces, atributos, métodos y relaciones entre ellos. Proporciona una visión general de la arquitectura del software.",
        y,
      )

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      y += 3
      pdf.text("5.2 Diagramas Cargados", 10, y)
      y += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)

      if (diagrams.length > 0) {
        y = addParagraph(pdf, "Los siguientes diagramas han sido cargados en el sistema:", y)

        for (let i = 0; i < diagrams.length; i++) {
          y = addBulletPoint(pdf, `${diagrams[i].name}`, y)
        }

        y = addParagraph(pdf, "Nota: Los diagramas están disponibles para su visualización en la aplicación web.", y)
      } else {
        y = addParagraph(
          pdf,
          "No hay diagramas cargados actualmente en el sistema. Utilice la función 'Cargar Diagrama' en la aplicación web para añadir diagramas.",
          y,
        )
      }

      // Conclusión
      pdf.addPage()
      y = 20

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(0, 51, 102)
      pdf.text("6. Conclusión", 10, y)
      pdf.setTextColor(0, 0, 0)
      y += 10

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(10)
      y = addParagraph(
        pdf,
        "El Procesador de Lenguaje Natural basado en la gramática generativa de Noam Chomsky representa una implementación completa y funcional de los principios fundamentales de la lingüística computacional. A través de sus tres niveles de análisis (léxico, sintáctico y semántico), el sistema es capaz de procesar oraciones en español, verificar su corrección gramatical y extraer su significado.",
        y,
      )

      y = addParagraph(
        pdf,
        "Este proyecto no solo demuestra la aplicación práctica de conceptos teóricos como autómatas finitos, gramáticas libres de contexto y procesamiento semántico, sino que también proporciona una herramienta educativa valiosa para comprender el funcionamiento interno de los sistemas de procesamiento de lenguaje natural.",
        y,
      )

      y = addParagraph(pdf, "Las posibles mejoras y extensiones futuras incluyen:", y)

      y = addBulletPoint(pdf, "Ampliación de la base de conocimiento para cubrir más dominios", y)
      y = addBulletPoint(pdf, "Implementación de análisis de dependencias gramaticales", y)
      y = addBulletPoint(pdf, "Mejora del algoritmo de stemming para mayor precisión", y)
      y = addBulletPoint(pdf, "Incorporación de técnicas de aprendizaje automático para el análisis semántico", y)
      y = addBulletPoint(
        pdf,
        "Desarrollo de una interfaz de programación de aplicaciones (API) para integración con otros sistemas",
        y,
      )

      y = addParagraph(
        pdf,
        "En conclusión, este proyecto representa un paso significativo en la comprensión y aplicación de los principios de la lingüística computacional, y sienta las bases para futuros desarrollos en el campo del procesamiento de lenguaje natural.",
        y,
      )

      // Añadir pie de página con fecha
      const date = new Date().toLocaleDateString()
      pdf.setFontSize(8)
      pdf.text(`Documento generado el ${date} | Procesador de Lenguaje Natural v1.0`, pdfWidth / 2, 285, {
        align: "center",
      })

      // Guardar el PDF
      pdf.save("documentacion-nlp-processor.pdf")
    } catch (error) {
      console.error("Error al generar el PDF:", error)
      alert("Ocurrió un error al generar el PDF. Por favor, inténtelo de nuevo.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Funciones auxiliares para añadir contenido al PDF
  const addSection = (pdf: jsPDF, title: string, y: number): number => {
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 10, y)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    return y + 10
  }

  const addSubsection = (pdf: jsPDF, title: string, y: number): number => {
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 10, y)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    return y + 6
  }

  const addParagraph = (pdf: jsPDF, text: string, y: number): number => {
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const maxWidth = pdfWidth - 20

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")

    const splitText = pdf.splitTextToSize(text, maxWidth)
    pdf.text(splitText, 10, y)
    return y + splitText.length * 5 + 3
  }

  const addBulletPoint = (pdf: jsPDF, text: string, y: number): number => {
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const maxWidth = pdfWidth - 25

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")

    pdf.text("•", 15, y)
    const splitText = pdf.splitTextToSize(text, maxWidth)
    pdf.text(splitText, 20, y)
    return y + splitText.length * 5 + 3
  }

  const addCodeBlock = (pdf: jsPDF, code: string, y: number): number => {
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const maxWidth = pdfWidth - 30

    // Dibujar un rectángulo gris claro como fondo
    pdf.setFillColor(245, 245, 245)

    const lines = code.split("\n")
    let maxLines = 0

    // Calcular la altura necesaria para el código
    for (const line of lines) {
      const splitText = pdf.splitTextToSize(line, maxWidth)
      maxLines += splitText.length
    }

    const rectHeight = maxLines * 5 + 10
    pdf.rect(15, y - 3, pdfWidth - 30, rectHeight, "F")

    // Añadir el código
    pdf.setFontSize(9)
    pdf.setFont("courier", "normal")
    pdf.setTextColor(70, 70, 70)

    let currentY = y
    for (const line of lines) {
      const splitText = pdf.splitTextToSize(line, maxWidth)
      pdf.text(splitText, 20, currentY)
      currentY += splitText.length * 5
    }

    pdf.setTextColor(0, 0, 0)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)

    return y + rectHeight + 5
  }

  return (
    <div className="space-y-6" ref={documentationRef}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Documentación del Proyecto</h2>
        <Button onClick={generatePDF} disabled={isGeneratingPDF} className="gap-2">
          <Download className="h-4 w-4" />
          {isGeneratingPDF ? "Generando PDF..." : "Descargar PDF"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BookOpen className="mr-2 h-4 w-4" />
            Descripción
          </TabsTrigger>
          <TabsTrigger value="lexical">
            <Code className="mr-2 h-4 w-4" />
            Análisis Léxico
          </TabsTrigger>
          <TabsTrigger value="syntactic">
            <Code className="mr-2 h-4 w-4" />
            Análisis Sintáctico
          </TabsTrigger>
          <TabsTrigger value="semantic">
            <Database className="mr-2 h-4 w-4" />
            Análisis Semántico
          </TabsTrigger>
          <TabsTrigger value="diagrams">
            <FileText className="mr-2 h-4 w-4" />
            Diagramas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="documentation-section">
          <Card>
            <CardHeader>
              <CardTitle>Descripción del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Contexto y Fundamentos Teóricos</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El procesamiento de lenguaje natural (PLN) es un campo de la inteligencia artificial que se centra en
                  la interacción entre las computadoras y el lenguaje humano. Este proyecto implementa un procesador de
                  lenguaje natural basado en los principios de la gramática generativa desarrollada por Noam Chomsky,
                  uno de los lingüistas más influyentes del siglo XX.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  La gramática generativa de Chomsky propone que el lenguaje humano se basa en un conjunto finito de
                  reglas que pueden generar un número infinito de oraciones gramaticalmente correctas. Este modelo
                  teórico sirve como base para nuestro sistema de procesamiento lingüístico, que analiza oraciones en
                  español a través de tres niveles fundamentales: léxico, sintáctico y semántico.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Objetivos del Proyecto</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El objetivo principal de este proyecto es implementar un sistema completo de procesamiento de lenguaje
                  natural que pueda:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    Analizar la estructura léxica de oraciones en español, identificando tokens y clasificándolos según
                    su tipo.
                  </li>
                  <li>
                    Verificar la corrección sintáctica de las oraciones según las reglas gramaticales del español.
                  </li>
                  <li>Extraer el significado semántico de las oraciones mediante una base de conocimiento.</li>
                  <li>Proporcionar una interfaz interactiva que permita visualizar cada fase del procesamiento.</li>
                  <li>
                    Servir como herramienta educativa para comprender los principios de la lingüística computacional.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Características Principales</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    Análisis léxico mediante autómatas finitos deterministas (AFD) que reconocen diferentes tipos de
                    tokens.
                  </li>
                  <li>
                    Análisis sintáctico utilizando gramáticas libres de contexto y un parser LL(1) para verificar la
                    estructura gramatical.
                  </li>
                  <li>
                    Procesamiento semántico con una base de conocimiento extensible que permite la interpretación del
                    significado.
                  </li>
                  <li>
                    Interfaz interactiva que muestra paso a paso el proceso de análisis y los resultados de cada fase.
                  </li>
                  <li>
                    Detección y reporte de errores léxicos y sintácticos con información detallada sobre la naturaleza
                    del error.
                  </li>
                  <li>Soporte para carga de archivos de texto para procesar oraciones desde fuentes externas.</li>
                  <li>
                    Visualización de la tabla de símbolos, la pila de análisis y las relaciones semánticas
                    identificadas.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Tecnologías Utilizadas</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Next.js y React:</strong> Framework y biblioteca de JavaScript para la construcción de
                    interfaces de usuario interactivas.
                  </li>
                  <li>
                    <strong>TypeScript:</strong> Superset de JavaScript que añade tipado estático para mejorar la
                    robustez y mantenibilidad del código.
                  </li>
                  <li>
                    <strong>Tailwind CSS:</strong> Framework de CSS utilitario para el diseño y estilizado de la
                    interfaz.
                  </li>
                  <li>
                    <strong>Algoritmos de PLN:</strong> Implementaciones personalizadas de autómatas finitos, parsers
                    LL(1) y procesamiento semántico.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lexical" className="documentation-section">
          <Card>
            <CardHeader>
              <CardTitle>Documentación del Análisis Léxico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Fundamentos Teóricos</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El análisis léxico es la primera fase del procesamiento de lenguaje natural y consiste en la
                  descomposición del texto de entrada en unidades léxicas llamadas tokens. Este proceso es fundamental
                  para las fases posteriores, ya que proporciona la estructura básica sobre la que se realizará el
                  análisis sintáctico y semántico.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  En nuestro sistema, el análisis léxico se implementa mediante autómatas finitos deterministas (AFD),
                  que son modelos computacionales capaces de reconocer lenguajes regulares. Cada autómata está diseñado
                  para reconocer un tipo específico de token, como identificadores, números, palabras reservadas o
                  símbolos.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Autómatas Finitos Deterministas (AFD)</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Un autómata finito determinista (AFD) se define formalmente como una 5-tupla (Q, Σ, δ, q0, F) donde:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Q es un conjunto finito de estados</li>
                  <li>Σ es un alfabeto finito</li>
                  <li>δ: Q × Σ → Q es la función de transición</li>
                  <li>q0 ∈ Q es el estado inicial</li>
                  <li>F ⊆ Q es el conjunto de estados de aceptación</li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  En nuestro sistema, hemos implementado los siguientes autómatas:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Autómata para identificadores:</strong> Reconoce identificadores que comienzan con una letra
                    o guion bajo y pueden contener letras, dígitos o guiones bajos.
                  </li>
                  <li>
                    <strong>Autómata para verbos:</strong> Reconoce palabras que siguen los patrones morfológicos de los
                    verbos en español.
                  </li>
                  <li>
                    <strong>Autómata para sustantivos:</strong> Reconoce palabras que siguen los patrones morfológicos
                    de los sustantivos en español.
                  </li>
                  <li>
                    <strong>Autómata para números:</strong> Reconoce constantes numéricas enteras y decimales.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Proceso de Tokenización</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El proceso de tokenización sigue los siguientes pasos:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Segmentación:</strong> La entrada se divide en unidades léxicas (palabras y signos de
                    puntuación).
                  </li>
                  <li>
                    <strong>Clasificación:</strong> Cada unidad léxica se clasifica según su tipo (identificador,
                    número, palabra reservada, etc.).
                  </li>
                  <li>
                    <strong>Validación:</strong> Se verifica que cada token sea válido según las reglas del lenguaje.
                  </li>
                  <li>
                    <strong>Generación de la tabla de símbolos:</strong> Se crea una tabla con información detallada
                    sobre cada token.
                  </li>
                </ol>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  La salida del proceso de tokenización es una secuencia de tokens con sus respectivos tipos y
                  atributos, que servirá como entrada para el análisis sintáctico.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ejemplo de tokenización:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`Entrada: "El gato come pescado"
Tokenización: id id id id
Tokens: [
  { lexeme: "El", type: "id", typeToken: "art" },
  { lexeme: "gato", type: "id", typeToken: "sust" },
  { lexeme: "come", type: "id", typeToken: "verbo" },
  { lexeme: "pescado", type: "id", typeToken: "sust" }
]`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Detección de Errores Léxicos</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El analizador léxico es capaz de detectar diversos tipos de errores, como:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Caracteres no válidos:</strong> Caracteres que no pertenecen al alfabeto del lenguaje.
                  </li>
                  <li>
                    <strong>Tokens malformados:</strong> Tokens que no siguen las reglas de formación del lenguaje.
                  </li>
                  <li>
                    <strong>Secuencias inválidas:</strong> Combinaciones de caracteres que no forman tokens válidos.
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Cuando se detecta un error, el analizador reporta la palabra específica donde ocurrió el error y el
                  carácter que lo causó, permitiendo una fácil identificación y corrección del problema.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ejemplo de error léxico:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`Entrada: "El gat0 come pescado"
Error: Error léxico en palabra: gat0, Carácter: 0`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Implementación de Autómatas</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  En nuestro sistema, los autómatas finitos deterministas se implementan como estructuras de datos que
                  contienen estados, transiciones y estados de aceptación. Cada autómata se define mediante una interfaz
                  que especifica sus componentes:
                </p>
                <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                  {`interface State {
  id: string;
  isAccepting: boolean;
  transitions: Record<string, string>;
}

interface Automaton {
  states: Record<string, State>;
  initialState: string;
  alphabet: string[];
  name: string;
  description: string;
}`}
                </pre>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  La función principal para verificar si una cadena es aceptada por un autómata es la siguiente:
                </p>
                <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                  {`export function isAccepted(automaton: Automaton, input: string): boolean {
  let currentState = automaton.initialState;

  for (const char of input) {
    // Verificar si el carácter está en el alfabeto
    if (!automaton.alphabet.includes(char)) {
      return false;
    }
    // Obtener el siguiente estado
    const nextState = automaton.states[currentState].transitions[char];

    // Si no hay transición para este carácter, la cadena no es aceptada
    if (!nextState) {
      return false;
    }

    currentState = nextState;
  }

  // Verificar si el estado final es de aceptación
  return automaton.states[currentState].isAccepting;
}`}
                </pre>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Esta implementación permite una verificación eficiente de los tokens durante el análisis léxico,
                  facilitando la detección de errores y la clasificación de las unidades léxicas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syntactic" className="documentation-section">
          <Card>
            <CardHeader>
              <CardTitle>Documentación del Análisis Sintáctico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Gramática Libre de Contexto</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Una gramática libre de contexto (GLC) es un formalismo que permite describir la estructura sintáctica
                  de un lenguaje. Se define formalmente como una 4-tupla (N, Σ, P, S) donde:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>N es un conjunto finito de símbolos no terminales</li>
                  <li>Σ es un conjunto finito de símbolos terminales (disjunto de N)</li>
                  <li>P es un conjunto finito de reglas de producción de la forma A → α, donde A ∈ N y α ∈ (N ∪ Σ)*</li>
                  <li>S ∈ N es el símbolo inicial</li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  En nuestro sistema, utilizamos una gramática libre de contexto basada en el modelo de Chomsky para
                  definir la estructura de las oraciones en español. Esta gramática incluye reglas para sintagmas
                  nominales, sintagmas verbales, determinantes, sustantivos, verbos, adjetivos, adverbios y
                  preposiciones.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Gramática simplificada para oraciones en español:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`S → SN SV
SN → Det N | Det N Adj | N | N Adj
SV → V | V SN | V Adv | V Adv SN
SP → Prep SN
Det → el | la | los | las | un | una | unos | unas
N → sustantivo
V → verbo
Adj → adjetivo
Adv → adverbio
Prep → a | ante | bajo | con | contra | de | desde | en | entre | hacia | hasta | para | por | según | sin | sobre | tras`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Parser LL(1)</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Un parser LL(1) es un analizador sintáctico descendente que construye el árbol de derivación de arriba
                  hacia abajo, de izquierda a derecha, utilizando un símbolo de anticipación para decidir qué producción
                  aplicar. El '(1)' indica que solo se utiliza un símbolo de anticipación.
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El parser LL(1) utiliza una tabla de análisis sintáctico para determinar qué producción aplicar en
                  cada paso del análisis. Esta tabla mapea pares de no terminales y terminales a producciones de la
                  gramática.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Algoritmo del parser LL(1):</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Inicializar la pila con el símbolo inicial de la gramática</li>
                    <li>
                      Mientras la pila no esté vacía:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Si el tope de la pila es un terminal, compararlo con el símbolo actual de entrada</li>
                        <li>Si coinciden, desapilar y avanzar en la entrada</li>
                        <li>Si no coinciden, reportar un error</li>
                        <li>Si el tope de la pila es un no terminal, consultar la tabla de análisis</li>
                        <li>Reemplazar el no terminal por la producción correspondiente</li>
                      </ul>
                    </li>
                    <li>Si la pila está vacía y se ha consumido toda la entrada, la oración es válida</li>
                  </ol>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ejemplo de análisis sintáctico:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`Entrada: "El gato come pescado"
Tokens: [art, sust, verbo, sust]
Pila inicial: [S]
Paso 1: [SN, SV] (Expandir S → SN SV)
Paso 2: [Det, N, SV] (Expandir SN → Det N)
Paso 3: [art, N, SV] (Expandir Det → art)
Paso 4: [N, SV] (Coincidir art)
Paso 5: [sust, SV] (Expandir N → sust)
Paso 6: [SV] (Coincidir sust)
Paso 7: [V, SN] (Expandir SV → V SN)
Paso 8: [verbo, SN] (Expandir V → verbo)
Paso 9: [SN] (Coincidir verbo)
Paso 10: [Det, N] (Expandir SN → Det N)
Paso 11: [sust] (Expandir N → sust)
Paso 12: [] (Coincidir sust)
Resultado: Oración correcta sintácticamente`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Tabla de Análisis LL(1)</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  La tabla de análisis LL(1) es una estructura fundamental para el parser LL(1). Se construye a partir
                  de la gramática y mapea pares de no terminales y terminales a producciones. Para cada no terminal A y
                  terminal a, la tabla indica qué producción de A debe aplicarse cuando se encuentra a en la entrada.
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  La construcción de la tabla LL(1) implica calcular los conjuntos FIRST y FOLLOW para cada símbolo no
                  terminal de la gramática:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>FIRST(α):</strong> conjunto de terminales que pueden aparecer al inicio de una cadena
                    derivada de α
                  </li>
                  <li>
                    <strong>FOLLOW(A):</strong> conjunto de terminales que pueden aparecer inmediatamente después de A
                    en alguna forma sentencial
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Para cada producción A → α y cada terminal a ∈ FIRST(α), se añade la entrada [A, a] = α a la tabla. Si
                  ε ∈ FIRST(α), entonces para cada terminal b ∈ FOLLOW(A), se añade la entrada [A, b] = α.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <h4 className="font-medium mb-1">Ejemplo simplificado de tabla LL(1) para nuestra gramática:</h4>
                  <table className="min-w-full border-collapse border">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-700">
                        <th className="border p-2">No Terminal</th>
                        <th className="border p-2">art</th>
                        <th className="border p-2">sust</th>
                        <th className="border p-2">verbo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-medium">S</td>
                        <td className="border p-2">S → SN SV</td>
                        <td className="border p-2">S → SN SV</td>
                        <td className="border p-2"></td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">SN</td>
                        <td className="border p-2">SN → Det N</td>
                        <td className="border p-2">SN → N</td>
                        <td className="border p-2"></td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">SV</td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2">SV → V | V SN</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">Det</td>
                        <td className="border p-2">Det → art</td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">N</td>
                        <td className="border p-2"></td>
                        <td className="border p-2">N → sust</td>
                        <td className="border p-2"></td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">V</td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2">V → verbo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Detección de Errores Sintácticos</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El analizador sintáctico es capaz de detectar diversos tipos de errores, como:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    Secuencias de tokens que no siguen las reglas gramaticales (por ejemplo, dos verbos consecutivos).
                  </li>
                  <li>Estructuras de frase incorrectas (por ejemplo, un sintagma nominal sin sustantivo).</li>
                  <li>Tokens inesperados en determinadas posiciones de la oración.</li>
                  <li>Oraciones incompletas que no pueden derivarse completamente de la gramática.</li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Cuando se detecta un error, el analizador reporta la palabra específica donde ocurrió el error y una
                  descripción del problema encontrado, facilitando la identificación y corrección del error.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ejemplo de error sintáctico:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`Entrada: "El gato come rápido pescado"
Error: No hay producción para SV con el token 'adv'`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Implementación del Parser LL(1)</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  La implementación del parser LL(1) en nuestro sistema incluye las siguientes funciones principales:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>generateLL1Table:</strong> Genera la tabla de análisis sintáctico a partir de la gramática.
                  </li>
                  <li>
                    <strong>isValidSentence:</strong> Verifica si una secuencia de tokens es válida según la gramática.
                  </li>
                  <li>
                    <strong>simulateParsingSteps:</strong> Simula el proceso de análisis sintáctico y devuelve la pila
                    en cada paso.
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Estas funciones permiten realizar un análisis sintáctico completo de las oraciones, verificando su
                  corrección gramatical y proporcionando información detallada sobre el proceso de análisis.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic" className="documentation-section">
          <Card>
            <CardHeader>
              <CardTitle>Documentación del Análisis Semántico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Base de Conocimiento</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  La base de conocimiento es una estructura de datos que contiene información sobre conceptos, sus
                  relaciones y propiedades. Esta base es fundamental para el procesamiento semántico, ya que proporciona
                  el contexto necesario para interpretar el significado de las oraciones.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Estructura de la base de conocimiento:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`interface KnowledgeBase {
  concepts: Record<string, ConceptInfo>
}

interface ConceptInfo {
  synonyms: string[]
  associations: string[]
  description: string
}`}
                  </pre>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Cada concepto en la base de conocimiento incluye:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Sinónimos:</strong> Términos alternativos que se refieren al mismo concepto.
                  </li>
                  <li>
                    <strong>Asociaciones:</strong> Conceptos relacionados semánticamente.
                  </li>
                  <li>
                    <strong>Descripción:</strong> Explicación detallada del concepto.
                  </li>
                </ul>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ejemplo de entrada en la base de conocimiento:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`"computadora": {
  synonyms: ["ordenador", "PC", "laptop", "computador"],
  associations: ["tecnología", "hardware", "software", "dispositivo"],
  description: "Dispositivo electrónico que procesa datos según instrucciones almacenadas."
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Procesamiento de Stopwords</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Las stopwords (palabras vacías) son palabras muy comunes que generalmente no aportan significado
                  relevante al análisis semántico. Ejemplos de stopwords en español incluyen artículos (el, la, los),
                  preposiciones (a, de, en), conjunciones (y, o, pero) y algunos pronombres.
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El proceso de eliminación de stopwords consiste en filtrar estas palabras del texto antes de realizar
                  el análisis semántico, lo que permite concentrarse en las palabras con mayor carga semántica
                  (sustantivos, verbos, adjetivos y adverbios significativos).
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Beneficios de la eliminación de stopwords:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Reducción del ruido en el análisis semántico</li>
                    <li>Mejora de la eficiencia del procesamiento</li>
                    <li>Enfoque en las palabras con mayor contenido semántico</li>
                    <li>Optimización de la identificación de conceptos relevantes</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Implementación de la función isStopword:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`export function isStopword(word: string): boolean {
  return stopwords.includes(word.toLowerCase());
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Algoritmo de Porter para Stemming</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El stemming es el proceso de reducir las palabras a su raíz o forma base. El algoritmo de Porter es
                  uno de los métodos más utilizados para realizar stemming, y en nuestro sistema hemos implementado una
                  adaptación para el español.
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El algoritmo de Porter para español sigue estos pasos principales:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Normalización:</strong> Convertir a minúsculas y eliminar acentos
                  </li>
                  <li>
                    <strong>Eliminación de sufijos plurales:</strong> -es, -s
                  </li>
                  <li>
                    <strong>Eliminación de diminutivos:</strong> -ito, -ita, -cito, -cita
                  </li>
                  <li>
                    <strong>Eliminación de sufijos de adverbios:</strong> -mente
                  </li>
                  <li>
                    <strong>Eliminación de sufijos verbales:</strong> -ando, -endo, -ar, -er, -ir, etc.
                  </li>
                  <li>
                    <strong>Eliminación de sufijos nominales:</strong> -anza, -ismo, -able, -ible, etc.
                  </li>
                </ol>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ejemplo de stemming:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`"computadoras" → "computador"
"rápidamente" → "rapid"
"programación" → "program"`}
                  </pre>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  El stemming facilita la identificación de palabras relacionadas semánticamente, ya que reduce
                  diferentes formas de una palabra a una raíz común.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Generación de Respuestas Semánticas</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  El proceso de generación de respuestas semánticas consiste en interpretar el significado de la oración
                  analizada y producir una respuesta coherente basada en la base de conocimiento. Este proceso sigue los
                  siguientes pasos:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Identificación de conceptos:</strong> Se identifican los conceptos presentes en la oración
                    mediante la comparación con la base de conocimiento.
                  </li>
                  <li>
                    <strong>Análisis de relaciones:</strong> Se analizan las relaciones entre los conceptos
                    identificados.
                  </li>
                  <li>
                    <strong>Extracción de estructura semántica:</strong> Se identifica la estructura semántica de la
                    oración (sujeto, acción, objeto, modificadores).
                  </li>
                  <li>
                    <strong>Generación de respuesta:</strong> Se genera una respuesta basada en la información extraída
                    y la base de conocimiento.
                  </li>
                </ol>
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ejemplo de generación de respuesta semántica:</h4>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`Entrada: "Cuanto vale una libra de café Aguila Roja?"
Conceptos identificados: ["café", "Aguila Roja", "libra"]
Estructura semántica: 
  - Consulta sobre precio
  - Producto: café Aguila Roja
  - Cantidad: una libra
Respuesta: "El precio de 1 libra de café Aguila Roja es $8000."`}
                  </pre>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  La calidad de la respuesta semántica depende en gran medida de la riqueza de la base de conocimiento y
                  de la precisión del análisis léxico y sintáctico previos.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Visualización de Relaciones Semánticas</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Nuestro sistema proporciona una visualización clara de las relaciones semánticas identificadas en la
                  oración, lo que facilita la comprensión del análisis semántico. Esta visualización incluye:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>Estructura semántica:</strong> Representación de la estructura sujeto-acción-objeto de la
                    oración.
                  </li>
                  <li>
                    <strong>Conceptos identificados:</strong> Lista de conceptos de la base de conocimiento presentes en
                    la oración.
                  </li>
                  <li>
                    <strong>Relaciones entre conceptos:</strong> Visualización de las relaciones semánticas entre los
                    conceptos identificados.
                  </li>
                  <li>
                    <strong>Interpretación:</strong> Explicación detallada del significado de la oración basada en el
                    análisis semántico.
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Esta visualización proporciona una comprensión profunda del significado de la oración y de cómo el
                  sistema lo interpreta, lo que es especialmente útil para fines educativos y de depuración.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagrams" className="documentation-section">
          <Card>
            <CardHeader>
              <CardTitle>Diagramas del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Diagramas Recomendados</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Para una mejor comprensión del sistema, se recomienda la creación y visualización de los siguientes
                  diagramas:
                </p>

                <div className="mt-4">
                  <h4 className="font-medium mb-1">Diagrama de Autómatas Finitos</h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Este diagrama representa gráficamente los autómatas finitos deterministas utilizados en el análisis
                    léxico. Muestra los estados, transiciones y estados de aceptación de cada autómata, facilitando la
                    comprensión del proceso de reconocimiento de tokens.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mt-2">
                    Un diagrama de autómata finito típicamente incluye:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Círculos que representan estados</li>
                    <li>Círculos dobles que representan estados de aceptación</li>
                    <li>Flechas etiquetadas que representan transiciones entre estados</li>
                    <li>Una flecha de entrada que indica el estado inicial</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-1">Diagrama de Árbol de Derivación</h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Este diagrama muestra la estructura jerárquica de una oración según las reglas de la gramática. Cada
                    nodo interno representa un símbolo no terminal, y cada hoja representa un símbolo terminal. El árbol
                    ilustra cómo se deriva la oración a partir del símbolo inicial de la gramática.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mt-2">
                    Un árbol de derivación para la oración "El gato come pescado" podría tener la siguiente estructura:
                  </p>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                    {`         S
        / \\
       SN  SV
      / \\  / \\
    Det  N V  SN
     |   |  |  |
    el gato come pescado`}
                  </pre>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-1">Diagrama de Flujo del Proceso</h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Este diagrama representa el flujo completo del procesamiento de lenguaje natural, desde la entrada
                    de texto hasta la generación de la respuesta semántica. Muestra las diferentes fases del proceso y
                    cómo se conectan entre sí.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mt-2">El flujo típico incluye:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Entrada de texto</li>
                    <li>Análisis léxico (tokenización)</li>
                    <li>Análisis sintáctico (parsing)</li>
                    <li>Análisis semántico</li>
                    <li>Generación de respuesta</li>
                  </ol>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-1">Diagrama de la Base de Conocimiento</h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Este diagrama ilustra la estructura de la base de conocimiento, mostrando los conceptos, sus
                    relaciones y propiedades. Puede representarse como un grafo donde los nodos son conceptos y las
                    aristas son relaciones entre ellos.
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-1">Diagrama de Clases del Sistema</h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Este diagrama muestra la estructura de clases del sistema, incluyendo las clases, interfaces,
                    atributos, métodos y relaciones entre ellos. Proporciona una visión general de la arquitectura del
                    software.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 mt-2">
                    Las principales clases e interfaces incluyen:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Token, SyntacticToken, SemanticToken</li>
                    <li>Automaton, State</li>
                    <li>Grammar, Rule</li>
                    <li>KnowledgeBase, ConceptInfo</li>
                    <li>NLPProcessor, LexicalAnalyzer, SyntacticAnalyzer, SemanticProcessor</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Diagramas Cargados</h3>
                <div className="relative">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Cargar Diagrama
                  </Button>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                    multiple
                  />
                </div>
              </div>

              {diagrams.length === 0 ? (
                <div className="text-center py-10 text-slate-500 border border-dashed rounded-md">
                  <FileText className="mx-auto h-10 w-10 mb-2" />
                  <p>No hay diagramas cargados. Haga clic en "Cargar Diagrama" para añadir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {diagrams.map((diagram, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">{diagram.name}</h4>
                      <div className="bg-white dark:bg-slate-800 rounded-md overflow-hidden">
                        <img
                          src={diagram.url || "/placeholder.svg"}
                          alt={diagram.name}
                          className="max-w-full h-auto mx-auto"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
