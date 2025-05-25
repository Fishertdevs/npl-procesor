// Definición de una gramática formal basada en el modelo de Chomsky
export interface Rule {
  nonTerminal: string
  productions: string[][]
}

export interface Grammar {
  nonTerminals: string[]
  terminals: string[]
  rules: Rule[]
  startSymbol: string
}

// Gramática simplificada para oraciones en español
export const spanishGrammar: Grammar = {
  nonTerminals: ["S", "SN", "SV", "Det", "N", "V", "Adj", "Adv", "Prep", "SP"],
  terminals: [
    "el",
    "la",
    "los",
    "las",
    "un",
    "una",
    "unos",
    "unas",
    "sustantivo",
    "verbo",
    "adjetivo",
    "adverbio",
    "a",
    "ante",
    "bajo",
    "con",
    "contra",
    "de",
    "desde",
    "en",
    "entre",
    "hacia",
    "hasta",
    "para",
    "por",
    "según",
    "sin",
    "sobre",
    "tras",
  ],
  rules: [
    {
      nonTerminal: "S",
      productions: [
        ["SN", "SV"],
        ["SN", "SV", "SP"],
      ],
    },
    {
      nonTerminal: "SN",
      productions: [["Det", "N"], ["Det", "N", "Adj"], ["N"], ["N", "Adj"]],
    },
    {
      nonTerminal: "SV",
      productions: [["V"], ["V", "SN"], ["V", "Adv"], ["V", "Adv", "SN"]],
    },
    {
      nonTerminal: "SP",
      productions: [["Prep", "SN"]],
    },
    {
      nonTerminal: "Det",
      productions: [["el"], ["la"], ["los"], ["las"], ["un"], ["una"], ["unos"], ["unas"]],
    },
    {
      nonTerminal: "N",
      productions: [["sustantivo"]],
    },
    {
      nonTerminal: "V",
      productions: [["verbo"]],
    },
    {
      nonTerminal: "Adj",
      productions: [["adjetivo"]],
    },
    {
      nonTerminal: "Adv",
      productions: [["adverbio"]],
    },
    {
      nonTerminal: "Prep",
      productions: [
        ["a"],
        ["ante"],
        ["bajo"],
        ["con"],
        ["contra"],
        ["de"],
        ["desde"],
        ["en"],
        ["entre"],
        ["hacia"],
        ["hasta"],
        ["para"],
        ["por"],
        ["según"],
        ["sin"],
        ["sobre"],
        ["tras"],
      ],
    },
  ],
  startSymbol: "S",
}

// Función para verificar si una secuencia de tokens es válida según la gramática
// Implementación mejorada de un parser LL(1)
export function isValidSentence(
  grammar: Grammar,
  tokens: string[],
): { valid: boolean; error?: string; position?: number } {
  if (tokens.length === 0) {
    return { valid: false, error: "La oración está vacía" }
  }

  // Implementación del parser LL(1)
  const parseTable = generateLL1Table(grammar)
  const stack: string[] = [grammar.startSymbol]
  let position = 0

  while (stack.length > 0 && position < tokens.length) {
    const top = stack.pop()!
    const currentToken = tokens[position]

    // Si el top es un terminal
    if (grammar.terminals.includes(top)) {
      if (top === currentToken) {
        position++
      } else {
        return {
          valid: false,
          error: `Se esperaba '${top}' pero se encontró '${currentToken}'`,
          position,
        }
      }
    }
    // Si el top es un no terminal
    else if (grammar.nonTerminals.includes(top)) {
      if (parseTable[top] && parseTable[top][currentToken] && parseTable[top][currentToken].length > 0) {
        // Obtener la producción y añadirla al stack en orden inverso
        const production = parseTable[top][currentToken][0]
        for (let i = production.length - 1; i >= 0; i--) {
          stack.push(production[i])
        }
      } else {
        return {
          valid: false,
          error: `No hay producción para ${top} con el token '${currentToken}'`,
          position,
        }
      }
    } else {
      return {
        valid: false,
        error: `Símbolo desconocido en la pila: ${top}`,
        position,
      }
    }
  }

  // Verificar si se procesaron todos los tokens y la pila está vacía
  if (position === tokens.length && stack.length === 0) {
    return { valid: true }
  } else if (position < tokens.length) {
    return {
      valid: false,
      error: `Tokens no procesados a partir de la posición ${position}`,
      position,
    }
  } else {
    return {
      valid: false,
      error: `Se esperaban más tokens para completar la derivación`,
      position: tokens.length - 1,
    }
  }
}

// Función para generar la tabla de análisis sintáctico LL(1)
export function generateLL1Table(grammar: Grammar): Record<string, Record<string, string[][]>> {
  // En un sistema real, se implementaría el algoritmo completo para generar la tabla LL(1)
  // Esta es una implementación simplificada para demostración

  const table: Record<string, Record<string, string[][]>> = {}

  // Inicializar la tabla
  for (const nonTerminal of grammar.nonTerminals) {
    table[nonTerminal] = {}
    for (const terminal of grammar.terminals) {
      table[nonTerminal][terminal] = []
    }
  }

  // Llenar la tabla con reglas para la gramática española
  // S → SN SV | SN SV SP
  table["S"]["el"] = [["SN", "SV"]]
  table["S"]["la"] = [["SN", "SV"]]
  table["S"]["los"] = [["SN", "SV"]]
  table["S"]["las"] = [["SN", "SV"]]
  table["S"]["un"] = [["SN", "SV"]]
  table["S"]["una"] = [["SN", "SV"]]
  table["S"]["unos"] = [["SN", "SV"]]
  table["S"]["unas"] = [["SN", "SV"]]
  table["S"]["sustantivo"] = [["SN", "SV"]]

  // SN → Det N | Det N Adj | N | N Adj
  table["SN"]["el"] = [["Det", "N"]]
  table["SN"]["la"] = [["Det", "N"]]
  table["SN"]["los"] = [["Det", "N"]]
  table["SN"]["las"] = [["Det", "N"]]
  table["SN"]["un"] = [["Det", "N"]]
  table["SN"]["una"] = [["Det", "N"]]
  table["SN"]["unos"] = [["Det", "N"]]
  table["SN"]["unas"] = [["Det", "N"]]
  table["SN"]["sustantivo"] = [["N"]]

  // SV → V | V SN | V Adv | V Adv SN
  table["SV"]["verbo"] = [["V"], ["V", "SN"], ["V", "Adv"], ["V", "Adv", "SN"]]

  // SP → Prep SN
  table["SP"]["a"] = [["Prep", "SN"]]
  table["SP"]["ante"] = [["Prep", "SN"]]
  table["SP"]["bajo"] = [["Prep", "SN"]]
  table["SP"]["con"] = [["Prep", "SN"]]
  table["SP"]["contra"] = [["Prep", "SN"]]
  table["SP"]["de"] = [["Prep", "SN"]]
  table["SP"]["desde"] = [["Prep", "SN"]]
  table["SP"]["en"] = [["Prep", "SN"]]
  table["SP"]["entre"] = [["Prep", "SN"]]
  table["SP"]["hacia"] = [["Prep", "SN"]]
  table["SP"]["hasta"] = [["Prep", "SN"]]
  table["SP"]["para"] = [["Prep", "SN"]]
  table["SP"]["por"] = [["Prep", "SN"]]
  table["SP"]["según"] = [["Prep", "SN"]]
  table["SP"]["sin"] = [["Prep", "SN"]]
  table["SP"]["sobre"] = [["Prep", "SN"]]
  table["SP"]["tras"] = [["Prep", "SN"]]

  // Det → el | la | los | las | un | una | unos | unas
  table["Det"]["el"] = [["el"]]
  table["Det"]["la"] = [["la"]]
  table["Det"]["los"] = [["los"]]
  table["Det"]["las"] = [["las"]]
  table["Det"]["un"] = [["un"]]
  table["Det"]["una"] = [["una"]]
  table["Det"]["unos"] = [["unos"]]
  table["Det"]["unas"] = [["unas"]]

  // N → sustantivo
  table["N"]["sustantivo"] = [["sustantivo"]]

  // V → verbo
  table["V"]["verbo"] = [["verbo"]]

  // Adj → adjetivo
  table["Adj"]["adjetivo"] = [["adjetivo"]]

  // Adv → adverbio
  table["Adv"]["adverbio"] = [["adverbio"]]

  // Prep → a | ante | bajo | con | contra | de | desde | en | entre | hacia | hasta | para | por | según | sin | sobre | tras
  table["Prep"]["a"] = [["a"]]
  table["Prep"]["ante"] = [["ante"]]
  table["Prep"]["bajo"] = [["bajo"]]
  table["Prep"]["con"] = [["con"]]
  table["Prep"]["contra"] = [["contra"]]
  table["Prep"]["de"] = [["de"]]
  table["Prep"]["desde"] = [["desde"]]
  table["Prep"]["en"] = [["en"]]
  table["Prep"]["entre"] = [["entre"]]
  table["Prep"]["hacia"] = [["hacia"]]
  table["Prep"]["hasta"] = [["hasta"]]
  table["Prep"]["para"] = [["para"]]
  table["Prep"]["por"] = [["por"]]
  table["Prep"]["según"] = [["según"]]
  table["Prep"]["sin"] = [["sin"]]
  table["Prep"]["sobre"] = [["sobre"]]
  table["Prep"]["tras"] = [["tras"]]

  return table
}

// Función para simular el proceso de análisis sintáctico y devolver la pila en cada paso
export function simulateParsingSteps(
  grammar: Grammar,
  tokens: string[],
): {
  steps: Array<{ stack: string[]; input: string[]; action: string }>
  valid: boolean
  error?: string
} {
  if (tokens.length === 0) {
    return {
      steps: [],
      valid: false,
      error: "La oración está vacía",
    }
  }

  const parseTable = generateLL1Table(grammar)
  const stack: string[] = [grammar.startSymbol]
  let position = 0
  const steps: Array<{ stack: string[]; input: string[]; action: string }> = []

  // Añadir estado inicial
  steps.push({
    stack: [...stack],
    input: tokens.slice(position),
    action: "Inicio",
  })

  while (stack.length > 0 && position < tokens.length) {
    const top = stack.pop()!
    const currentToken = tokens[position]
    let action = ""

    // Si el top es un terminal
    if (grammar.terminals.includes(top)) {
      if (top === currentToken) {
        action = `Coincide '${top}', avanzar`
        position++
      } else {
        action = `Error: Se esperaba '${top}' pero se encontró '${currentToken}'`
        steps.push({
          stack: [...stack],
          input: tokens.slice(position),
          action,
        })
        return {
          steps,
          valid: false,
          error: `Se esperaba '${top}' pero se encontró '${currentToken}'`,
        }
      }
    }
    // Si el top es un no terminal
    else if (grammar.nonTerminals.includes(top)) {
      if (parseTable[top] && parseTable[top][currentToken] && parseTable[top][currentToken].length > 0) {
        const production = parseTable[top][currentToken][0]
        action = `Expandir ${top} → ${production.join(" ")}`

        // Añadir producción al stack en orden inverso
        for (let i = production.length - 1; i >= 0; i--) {
          stack.push(production[i])
        }
      } else {
        action = `Error: No hay producción para ${top} con el token '${currentToken}'`
        steps.push({
          stack: [...stack],
          input: tokens.slice(position),
          action,
        })
        return {
          steps,
          valid: false,
          error: `No hay producción para ${top} con el token '${currentToken}'`,
        }
      }
    } else {
      action = `Error: Símbolo desconocido en la pila: ${top}`
      steps.push({
        stack: [...stack],
        input: tokens.slice(position),
        action,
      })
      return {
        steps,
        valid: false,
        error: `Símbolo desconocido en la pila: ${top}`,
      }
    }

    // Añadir el estado actual después de la acción
    steps.push({
      stack: [...stack],
      input: tokens.slice(position),
      action,
    })
  }

  // Verificar si se procesaron todos los tokens y la pila está vacía
  if (position === tokens.length && stack.length === 0) {
    steps.push({
      stack: [],
      input: [],
      action: "Aceptar: Análisis completado con éxito",
    })
    return { steps, valid: true }
  } else if (position < tokens.length) {
    steps.push({
      stack: [...stack],
      input: tokens.slice(position),
      action: `Error: Tokens no procesados a partir de la posición ${position}`,
    })
    return {
      steps,
      valid: false,
      error: `Tokens no procesados a partir de la posición ${position}`,
    }
  } else {
    steps.push({
      stack: [...stack],
      input: [],
      action: "Error: Se esperaban más tokens para completar la derivación",
    })
    return {
      steps,
      valid: false,
      error: "Se esperaban más tokens para completar la derivación",
    }
  }
}
