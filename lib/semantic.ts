// Base de conocimiento semántico
export interface KnowledgeBase {
  concepts: Record<string, ConceptInfo>
}

export interface ConceptInfo {
  synonyms: string[]
  associations: string[]
  description: string
}

// Base de conocimiento de ejemplo
export const knowledgeBase: KnowledgeBase = {
  concepts: {
    computadora: {
      synonyms: ["ordenador", "PC", "laptop", "computador"],
      associations: ["tecnología", "hardware", "software", "dispositivo"],
      description: "Dispositivo electrónico que procesa datos según instrucciones almacenadas.",
    },
    programar: {
      synonyms: ["codificar", "desarrollar", "implementar"],
      associations: ["software", "código", "algoritmo", "lenguaje"],
      description: "Proceso de escribir, probar y mantener código fuente de programas informáticos.",
    },
    algoritmo: {
      synonyms: ["procedimiento", "método", "proceso"],
      associations: ["computación", "matemáticas", "lógica", "solución"],
      description: "Conjunto ordenado y finito de operaciones que permite hallar la solución a un problema.",
    },
    internet: {
      synonyms: ["red", "web", "ciberespacio"],
      associations: ["comunicación", "global", "información", "conectividad"],
      description: "Red informática mundial descentralizada que conecta dispositivos de todo el mundo.",
    },
    "base de datos": {
      synonyms: ["BD", "banco de datos", "almacén de datos"],
      associations: ["información", "almacenamiento", "consulta", "registro"],
      description: "Conjunto de datos organizados y relacionados entre sí, almacenados sistemáticamente.",
    },
    café: {
      synonyms: ["cafeto", "café en grano", "café molido"],
      associations: ["bebida", "cafeína", "energía", "desayuno"],
      description:
        "Bebida que se obtiene a partir de los granos tostados y molidos de los frutos de la planta del café.",
    },
    "Aguila Roja": {
      synonyms: ["café Aguila Roja", "marca de café"],
      associations: ["café", "Colombia", "marca", "producto"],
      description: "Marca de café colombiano reconocida por su calidad y tradición.",
    },
    libra: {
      synonyms: ["lb", "pound", "medida de peso"],
      associations: ["peso", "medida", "sistema imperial", "500 gramos"],
      description:
        "Unidad de masa utilizada principalmente en países anglosajones, equivalente a aproximadamente 453,59 gramos.",
    },
  },
}

// Lista de stopwords en español
export const stopwords: string[] = [
  "a",
  "al",
  "algo",
  "algunas",
  "algunos",
  "ante",
  "antes",
  "como",
  "con",
  "contra",
  "cual",
  "cuando",
  "de",
  "del",
  "desde",
  "donde",
  "durante",
  "e",
  "el",
  "ella",
  "ellas",
  "ellos",
  "en",
  "entre",
  "era",
  "erais",
  "eran",
  "eras",
  "eres",
  "es",
  "esa",
  "esas",
  "ese",
  "eso",
  "esos",
  "esta",
  "estaba",
  "estabais",
  "estaban",
  "estabas",
  "estad",
  "estada",
  "estadas",
  "estado",
  "estados",
  "estamos",
  "estando",
  "estar",
  "estaremos",
  "estará",
  "estarán",
  "estarás",
  "estaré",
  "estaréis",
  "estaría",
  "estaríais",
  "estaríamos",
  "estarían",
  "estarías",
  "estas",
  "este",
  "estemos",
  "esto",
  "estos",
  "estoy",
  "estuve",
  "estuviera",
  "estuvierais",
  "estuvieran",
  "estuvieras",
  "estuvieron",
  "estuviese",
  "estuvieseis",
  "estuviesen",
  "estuvieses",
  "estuvimos",
  "estuviste",
  "estuvisteis",
  "estuviéramos",
  "estuviésemos",
  "estuvo",
  "está",
  "estábamos",
  "estáis",
  "están",
  "estás",
  "esté",
  "estéis",
  "estén",
  "estés",
  "fue",
  "fuera",
  "fuerais",
  "fueran",
  "fueras",
  "fueron",
  "fuese",
  "fueseis",
  "fuesen",
  "fueses",
  "fui",
  "fuimos",
  "fuiste",
  "fuisteis",
  "fuéramos",
  "fuésemos",
  "ha",
  "habida",
  "habidas",
  "habido",
  "habidos",
  "habiendo",
  "habremos",
  "habrá",
  "habrán",
  "habrás",
  "habré",
  "habréis",
  "habría",
  "habríais",
  "habríamos",
  "habrían",
  "habrías",
  "habéis",
  "había",
  "habíais",
  "habíamos",
  "habían",
  "habías",
  "han",
  "has",
  "hasta",
  "hay",
  "haya",
  "hayamos",
  "hayan",
  "hayas",
  "hayáis",
  "he",
  "hemos",
  "hube",
  "hubiera",
  "hubierais",
  "hubieran",
  "hubieras",
  "hubieron",
  "hubiese",
  "hubieseis",
  "hubiesen",
  "hubieses",
  "hubimos",
  "hubiste",
  "hubisteis",
  "hubiéramos",
  "hubiésemos",
  "hubo",
  "la",
  "las",
  "le",
  "les",
  "lo",
  "los",
  "me",
  "mi",
  "mis",
  "mucho",
  "muchos",
  "muy",
  "más",
  "mí",
  "mía",
  "mías",
  "mío",
  "míos",
  "nada",
  "ni",
  "no",
  "nos",
  "nosotras",
  "nosotros",
  "nuestra",
  "nuestras",
  "nuestro",
  "nuestros",
  "o",
  "os",
  "otra",
  "otras",
  "otro",
  "otros",
  "para",
  "pero",
  "poco",
  "por",
  "porque",
  "que",
  "quien",
  "quienes",
  "qué",
  "se",
  "sea",
  "seamos",
  "sean",
  "seas",
  "seremos",
  "será",
  "serán",
  "serás",
  "seré",
  "seréis",
  "sería",
  "seríais",
  "seríamos",
  "serían",
  "serías",
  "seáis",
  "si",
  "sido",
  "siendo",
  "sin",
  "sobre",
  "sois",
  "somos",
  "son",
  "soy",
  "su",
  "sus",
  "suya",
  "suyas",
  "suyo",
  "suyos",
  "sí",
  "también",
  "tanto",
  "te",
  "tendremos",
  "tendrá",
  "tendrán",
  "tendrás",
  "tendré",
  "tendréis",
  "tendría",
  "tendríais",
  "tendríamos",
  "tendrían",
  "tendrías",
  "tened",
  "tenemos",
  "tenga",
  "tengamos",
  "tengan",
  "tengas",
  "tengo",
  "tengáis",
  "tenida",
  "tenidas",
  "tenido",
  "tenidos",
  "teniendo",
  "tenéis",
  "tenía",
  "teníais",
  "teníamos",
  "tenían",
  "tenías",
  "ti",
  "tiene",
  "tienen",
  "tienes",
  "todo",
  "todos",
  "tu",
  "tus",
  "tuve",
  "tuviera",
  "tuvierais",
  "tuvieran",
  "tuvieras",
  "tuvieron",
  "tuviese",
  "tuvieseis",
  "tuviesen",
  "tuvieses",
  "tuvimos",
  "tuviste",
  "tuvisteis",
  "tuviéramos",
  "tuviésemos",
  "tuvo",
  "tuya",
  "tuyas",
  "tuyo",
  "tuyos",
  "tú",
  "un",
  "una",
  "uno",
  "unos",
  "vosotras",
  "vosotros",
  "vuestra",
  "vuestras",
  "vuestro",
  "vuestros",
  "y",
  "ya",
  "yo",
  "él",
  "éramos",
]

// Función para verificar si una palabra es un stopword
export function isStopword(word: string): boolean {
  return stopwords.includes(word.toLowerCase())
}

// Función para buscar conceptos relacionados en la base de conocimiento
export function findRelatedConcepts(word: string, kb: KnowledgeBase): string[] {
  const relatedConcepts: string[] = []
  const normalizedWord = word.toLowerCase()

  // Buscar coincidencias directas o en sinónimos
  for (const [concept, info] of Object.entries(kb.concepts)) {
    if (
      concept.includes(normalizedWord) ||
      normalizedWord.includes(concept) ||
      info.synonyms.some((syn) => syn.includes(normalizedWord) || normalizedWord.includes(syn))
    ) {
      relatedConcepts.push(concept)
    }
  }

  return relatedConcepts
}

// Función para generar una respuesta semántica basada en conceptos identificados
export function generateSemanticResponse(concepts: string[], kb: KnowledgeBase): string {
  if (concepts.length === 0) {
    return "No se han identificado conceptos relevantes en esta oración. Intente con una oración más específica o relacionada con los dominios conocidos."
  }

  // Identificar el concepto principal (el primero o el que tenga más información)
  let primaryConcept = concepts[0]
  let mostInfoConcept = primaryConcept
  let mostInfoLength = 0

  for (const concept of concepts) {
    if (kb.concepts[concept]) {
      const infoLength =
        kb.concepts[concept].description.length +
        kb.concepts[concept].synonyms.length +
        kb.concepts[concept].associations.length
      if (infoLength > mostInfoLength) {
        mostInfoLength = infoLength
        mostInfoConcept = concept
      }
    }
  }

  primaryConcept = mostInfoConcept

  // Construir una respuesta más elaborada
  let response = `He identificado ${concepts.length} conceptos clave en su oración: ${concepts.join(", ")}. `

  // Información detallada sobre el concepto principal
  if (kb.concepts[primaryConcept]) {
    response += `\n\nEl concepto principal parece ser "${primaryConcept}": ${kb.concepts[primaryConcept].description} `

    if (kb.concepts[primaryConcept].synonyms.length > 0) {
      response += `\nSinónimos: ${kb.concepts[primaryConcept].synonyms.join(", ")}. `
    }
  }

  // Información sobre relaciones entre conceptos
  if (concepts.length > 1) {
    response += `\n\nRelaciones entre conceptos: `

    // Buscar relaciones directas entre los conceptos identificados
    let relationsFound = false
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const concept1 = concepts[i]
        const concept2 = concepts[j]

        if (kb.concepts[concept1] && kb.concepts[concept2]) {
          // Verificar si hay asociaciones mutuas
          if (
            kb.concepts[concept1].associations.includes(concept2) ||
            kb.concepts[concept2].associations.includes(concept1)
          ) {
            response += `\n- "${concept1}" está relacionado con "${concept2}"`
            relationsFound = true
          }
        }
      }
    }

    if (!relationsFound) {
      response += "No se encontraron relaciones directas entre los conceptos identificados."
    }
  }

  // Sugerir conceptos relacionados que no están en la oración
  const relatedConcepts = new Set<string>()
  for (const concept of concepts) {
    if (kb.concepts[concept]) {
      kb.concepts[concept].associations.forEach((assoc) => {
        if (!concepts.includes(assoc)) {
          relatedConcepts.add(assoc)
        }
      })
    }
  }

  if (relatedConcepts.size > 0) {
    response += `\n\nConceptos relacionados que podrían ser de interés: ${Array.from(relatedConcepts).join(", ")}.`
  }

  return response
}

// Implementación del algoritmo de Porter para stemming en español
export function porterStemmer(word: string): string {
  // Convertir a minúsculas
  word = word.toLowerCase()

  // Eliminar acentos
  word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  // Si la palabra es muy corta, no aplicar stemming
  if (word.length <= 2) {
    return word
  }

  // Paso 1: Eliminar sufijos plurales
  if (word.endsWith("es") && word.length > 4) {
    word = word.slice(0, -2)
  } else if (word.endsWith("s") && !word.endsWith("us") && !word.endsWith("is") && word.length > 3) {
    word = word.slice(0, -1)
  }

  // Paso 2: Eliminar diminutivos
  if (word.endsWith("ito") || word.endsWith("ita") || word.endsWith("itos") || word.endsWith("itas")) {
    word = word.slice(0, -3)
  } else if (word.endsWith("cito") || word.endsWith("cita") || word.endsWith("citos") || word.endsWith("citas")) {
    word = word.slice(0, -4)
  }

  // Paso 3: Eliminar sufijos de adverbios
  if (word.endsWith("mente") && word.length > 5) {
    word = word.slice(0, -5)
  }

  // Paso 4: Eliminar sufijos verbales
  const verbSuffixes = [
    "ando",
    "endo",
    "ado",
    "ido",
    "ando",
    "iendo",
    "ar",
    "er",
    "ir",
    "as",
    "abas",
    "adas",
    "idas",
    "aras",
    "ases",
    "ieses",
    "aste",
    "iste",
    "an",
    "aban",
    "ian",
    "aran",
    "ieran",
    "asen",
    "iesen",
    "aron",
    "ieron",
    "ado",
    "ido",
    "ando",
    "iendo",
    "io",
  ]

  for (const suffix of verbSuffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
      word = word.slice(0, -suffix.length)
      break
    }
  }

  // Paso 5: Eliminar sufijos nominales
  const nominalSuffixes = [
    "anza",
    "anzas",
    "ico",
    "ica",
    "icos",
    "icas",
    "ismo",
    "ismos",
    "able",
    "ables",
    "ible",
    "ibles",
    "ista",
    "istas",
    "oso",
    "osa",
    "osos",
    "osas",
    "amiento",
    "amientos",
    "imiento",
    "imientos",
    "acion",
    "aciones",
    "cion",
    "ciones",
    "dad",
    "dades",
    "idad",
    "idades",
  ]

  for (const suffix of nominalSuffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
      word = word.slice(0, -suffix.length)
      break
    }
  }

  return word
}

// Función para analizar semánticamente una oración
export function analyzeSemantics(
  tokens: string[],
  kb: KnowledgeBase,
): {
  concepts: string[]
  response: string
  relevantTokens: string[]
} {
  // Filtrar stopwords
  const relevantTokens = tokens.filter((token) => !isStopword(token))

  // Aplicar stemming a los tokens relevantes
  const stems = relevantTokens.map((token) => porterStemmer(token))

  // Buscar conceptos relacionados
  const concepts: string[] = []
  const conceptScores: Record<string, number> = {}

  // Primera pasada: buscar coincidencias exactas
  for (const token of relevantTokens) {
    const normalizedToken = token.toLowerCase()

    // Buscar coincidencias directas en conceptos
    for (const [concept, info] of Object.entries(kb.concepts)) {
      if (concept === normalizedToken) {
        concepts.push(concept)
        conceptScores[concept] = (conceptScores[concept] || 0) + 3 // Mayor peso para coincidencias exactas
      } else if (info.synonyms.includes(normalizedToken)) {
        concepts.push(concept)
        conceptScores[concept] = (conceptScores[concept] || 0) + 2 // Peso medio para sinónimos exactos
      }
    }
  }

  // Segunda pasada: buscar coincidencias parciales usando stems
  for (const stem of stems) {
    for (const [concept, info] of Object.entries(kb.concepts)) {
      // Verificar si el stem está contenido en el concepto o viceversa
      if (concept.includes(stem) || stem.includes(concept)) {
        concepts.push(concept)
        conceptScores[concept] = (conceptScores[concept] || 0) + 1 // Menor peso para coincidencias parciales
      }

      // Verificar en sinónimos
      for (const synonym of info.synonyms) {
        if (synonym.includes(stem) || stem.includes(synonym)) {
          concepts.push(concept)
          conceptScores[concept] = (conceptScores[concept] || 0) + 0.5 // Peso mínimo para coincidencias parciales en sinónimos
        }
      }
    }
  }

  // Eliminar duplicados y ordenar por relevancia
  const uniqueConcepts = Array.from(new Set(concepts))
  uniqueConcepts.sort((a, b) => (conceptScores[b] || 0) - (conceptScores[a] || 0))

  // Generar respuesta
  const response = generateSemanticResponse(uniqueConcepts, kb)

  return {
    concepts: uniqueConcepts,
    response,
    relevantTokens,
  }
}
