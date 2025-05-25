// Base de conocimiento específica para tienda deportiva
export interface SportsProduct {
  name: string
  category: string
  price: number
  stock: number
  brand: string
  description: string
  features: string[]
}

export interface SportsKnowledgeBase {
  products: SportsProduct[]
  categories: string[]
  brands: string[]
  services: string[]
  locations: string[]
}

// Base de conocimiento de la tienda deportiva
export const sportsStoreKB: SportsKnowledgeBase = {
  products: [
    {
      name: "zapatillas running",
      category: "calzado",
      price: 120000,
      stock: 15,
      brand: "Nike",
      description: "Zapatillas para correr con tecnología de amortiguación",
      features: ["amortiguación", "transpirable", "ligeras"],
    },
    {
      name: "balón fútbol",
      category: "deportes",
      price: 45000,
      stock: 8,
      brand: "Adidas",
      description: "Balón oficial de fútbol profesional",
      features: ["cuero sintético", "oficial", "resistente"],
    },
    {
      name: "raqueta tenis",
      category: "deportes",
      price: 180000,
      stock: 5,
      brand: "Wilson",
      description: "Raqueta profesional de tenis",
      features: ["fibra de carbono", "profesional", "ligera"],
    },
    {
      name: "camiseta deportiva",
      category: "ropa",
      price: 35000,
      stock: 25,
      brand: "Puma",
      description: "Camiseta deportiva transpirable",
      features: ["transpirable", "secado rápido", "cómoda"],
    },
    {
      name: "bicicleta montaña",
      category: "ciclismo",
      price: 850000,
      stock: 3,
      brand: "Trek",
      description: "Bicicleta de montaña profesional",
      features: ["suspensión", "21 velocidades", "todo terreno"],
    },
    {
      name: "guantes boxeo",
      category: "deportes",
      price: 65000,
      stock: 12,
      brand: "Everlast",
      description: "Guantes profesionales de boxeo",
      features: ["cuero genuino", "acolchado", "profesional"],
    },
    {
      name: "pelota básquet",
      category: "deportes",
      price: 55000,
      stock: 10,
      brand: "Spalding",
      description: "Pelota oficial de básquetbol",
      features: ["cuero sintético", "oficial", "grip superior"],
    },
    {
      name: "short deportivo",
      category: "ropa",
      price: 28000,
      stock: 20,
      brand: "Under Armour",
      description: "Short deportivo para entrenamiento",
      features: ["elástico", "transpirable", "cómodo"],
    },
  ],
  categories: ["calzado", "ropa", "deportes", "ciclismo", "accesorios"],
  brands: ["Nike", "Adidas", "Puma", "Wilson", "Trek", "Everlast", "Spalding", "Under Armour"],
  services: ["entrega domicilio", "garantía", "cambios", "devoluciones", "asesoría deportiva"],
  locations: ["centro comercial", "sucursal norte", "sucursal sur", "tienda online"],
}

// 10 preguntas predefinidas para la tienda deportiva
export const sportsStoreQuestions = [
  "¿Cuánto cuestan las zapatillas de running?",
  "¿Qué productos de Nike tienen disponibles?",
  "¿Tienen balones de fútbol en stock?",
  "¿Cuál es el precio de la raqueta de tenis?",
  "¿Qué marcas de ropa deportiva manejan?",
  "¿Cuántas bicicletas de montaña tienen disponibles?",
  "¿Los guantes de boxeo son de cuero genuino?",
  "¿Hacen entregas a domicilio?",
  "¿Qué garantía ofrecen en los productos?",
  "¿Dónde están ubicadas las sucursales?",
]

// Preposiciones para almacenar en archivo .txt
export const prepositions = [
  "a",
  "ante",
  "bajo",
  "con",
  "contra",
  "de",
  "desde",
  "durante",
  "en",
  "entre",
  "hacia",
  "hasta",
  "mediante",
  "para",
  "por",
  "según",
  "sin",
  "sobre",
  "tras",
]

// Tabla de símbolos para almacenar en archivo .txt
export const symbolTable = {
  categorias_lexicas: {
    sustantivo: ["producto", "precio", "marca", "tienda", "cliente"],
    verbo: ["tener", "costar", "vender", "comprar", "entregar"],
    adjetivo: ["deportivo", "profesional", "cómodo", "resistente"],
    adverbio: ["rápidamente", "cómodamente", "profesionalmente"],
    determinante: ["el", "la", "los", "las", "un", "una"],
    preposicion: prepositions,
    pronombre: ["qué", "cuál", "cuánto", "dónde", "cómo"],
  },
  funciones_gramaticales: {
    sujeto: "entidad que realiza la acción",
    predicado: "acción o estado del sujeto",
    objeto_directo: "entidad que recibe la acción",
    complemento_circunstancial: "información adicional sobre la acción",
  },
}

// Función mejorada para generar respuesta automática más humana y coherente
export function generateAutomaticResponse(question: string, kb: SportsKnowledgeBase): string {
  const cleanQuestion = preprocessQuestion(question)
  const tokens = cleanQuestion.split(" ")

  // Análisis más sofisticado de la intención de la pregunta
  const questionAnalysis = analyzeQuestionIntent(tokens, question)

  // Generar respuesta basada en el análisis semántico con alta variabilidad
  return generateHumanLikeResponse(questionAnalysis, kb, question)
}

// Nueva función para analizar la intención de la pregunta
function analyzeQuestionIntent(tokens: string[], originalQuestion: string) {
  const analysis = {
    type: "unknown",
    products: [] as string[],
    brands: [] as string[],
    attributes: [] as string[],
    priceQuery: false,
    stockQuery: false,
    locationQuery: false,
    serviceQuery: false,
    deliveryQuery: false,
    comparisonQuery: false,
    recommendationQuery: false,
    originalQuestion: originalQuestion.toLowerCase(),
  }

  // Detectar tipo de pregunta
  if (tokens.includes("cuanto") || tokens.includes("precio") || tokens.includes("cuesta") || tokens.includes("vale")) {
    analysis.type = "price"
    analysis.priceQuery = true
  } else if (
    tokens.includes("tienen") ||
    tokens.includes("stock") ||
    tokens.includes("disponible") ||
    tokens.includes("hay")
  ) {
    analysis.type = "stock"
    analysis.stockQuery = true
  } else if (
    tokens.includes("donde") ||
    tokens.includes("ubicacion") ||
    tokens.includes("sucursal") ||
    tokens.includes("tienda")
  ) {
    analysis.type = "location"
    analysis.locationQuery = true
  } else if (
    tokens.includes("garantia") ||
    tokens.includes("servicio") ||
    tokens.includes("cambio") ||
    tokens.includes("devolucion")
  ) {
    analysis.type = "service"
    analysis.serviceQuery = true
  } else if (tokens.includes("entrega") || tokens.includes("domicilio") || tokens.includes("envio")) {
    analysis.type = "delivery"
    analysis.deliveryQuery = true
  } else if (
    tokens.includes("mejor") ||
    tokens.includes("recomienda") ||
    tokens.includes("cual") ||
    tokens.includes("que")
  ) {
    analysis.type = "recommendation"
    analysis.recommendationQuery = true
  } else if (tokens.includes("diferencia") || tokens.includes("comparar") || tokens.includes("versus")) {
    analysis.type = "comparison"
    analysis.comparisonQuery = true
  }

  // Identificar productos mencionados
  const productKeywords = [
    "zapatillas",
    "zapatos",
    "tenis",
    "running",
    "correr",
    "balon",
    "pelota",
    "futbol",
    "soccer",
    "raqueta",
    "tenis",
    "camiseta",
    "playera",
    "jersey",
    "bicicleta",
    "bike",
    "ciclismo",
    "guantes",
    "boxeo",
    "basquet",
    "basketball",
    "short",
    "pantalon",
  ]

  productKeywords.forEach((keyword) => {
    if (tokens.includes(keyword) || originalQuestion.toLowerCase().includes(keyword)) {
      analysis.products.push(keyword)
    }
  })

  // Identificar marcas mencionadas
  const brands = ["nike", "adidas", "puma", "wilson", "trek", "everlast", "spalding", "under", "armour"]
  brands.forEach((brand) => {
    if (tokens.includes(brand) || originalQuestion.toLowerCase().includes(brand)) {
      analysis.brands.push(brand)
    }
  })

  // Identificar atributos
  const attributes = ["profesional", "calidad", "resistente", "comodo", "ligero", "transpirable", "oficial"]
  attributes.forEach((attr) => {
    if (tokens.includes(attr) || originalQuestion.toLowerCase().includes(attr)) {
      analysis.attributes.push(attr)
    }
  })

  return analysis
}

// Nueva función para generar respuestas más humanas
function generateHumanLikeResponse(analysis: any, kb: SportsKnowledgeBase, originalQuestion: string): string {
  const greetings = [
    "¡Hola! Me da mucho gusto ayudarte.",
    "¡Excelente pregunta!",
    "Con mucho gusto te ayudo con esa información.",
    "¡Perfecto! Te puedo ayudar con eso.",
    "¡Qué bueno que preguntes!",
    "¡Claro que sí! Te asisto con eso.",
    "¡Genial! Déjame ayudarte.",
    "¡Por supuesto! Es un placer atenderte.",
    "¡Fantástica consulta!",
    "¡Me encanta poder ayudarte!",
  ]

  const closings = [
    "¿Te puedo ayudar con algo más?",
    "¡Espero que esta información te sea útil!",
    "Si necesitas más detalles, no dudes en preguntar.",
    "¿Hay algo más en lo que te pueda asistir?",
    "¿Tienes alguna otra duda?",
    "¡Cualquier cosa más que necesites, aquí estoy!",
    "¿Te gustaría saber algo adicional?",
    "¡Espero haberte ayudado!",
    "¿Necesitas información sobre algún otro producto?",
    "¡Que tengas un excelente día deportivo!",
  ]

  // Agregar timestamp para mayor variabilidad
  const timestamp = Date.now()
  const randomSeed = timestamp % 1000

  let response = greetings[randomSeed % greetings.length] + " "

  switch (analysis.type) {
    case "price":
      response += handleAdvancedPriceQuery(analysis, kb, randomSeed)
      break
    case "stock":
      response += handleAdvancedStockQuery(analysis, kb, randomSeed)
      break
    case "location":
      response += handleAdvancedLocationQuery(analysis, kb, randomSeed)
      break
    case "service":
      response += handleAdvancedServiceQuery(analysis, kb, randomSeed)
      break
    case "delivery":
      response += handleAdvancedDeliveryQuery(analysis, kb, randomSeed)
      break
    case "recommendation":
      response += handleRecommendationQuery(analysis, kb, randomSeed)
      break
    case "comparison":
      response += handleComparisonQuery(analysis, kb, randomSeed)
      break
    default:
      response += handleGeneralQuery(analysis, kb, originalQuestion, randomSeed)
  }

  response += " " + closings[randomSeed % closings.length]
  return response
}

// Actualizar todas las funciones para incluir variabilidad con randomSeed
function handleAdvancedPriceQuery(analysis: any, kb: SportsKnowledgeBase, randomSeed: number): string {
  const priceVariations = [
    "El precio actual de",
    "En este momento, el costo de",
    "Te puedo confirmar que el valor de",
    "El precio de venta de",
    "Actualmente manejamos",
  ]

  const promotionPhrases = [
    "¡Tenemos una promoción especial!",
    "¡Hay una oferta increíble!",
    "¡Aprovecha nuestro descuento!",
    "¡Oferta limitada!",
    "¡Precio especial por tiempo limitado!",
  ]

  // Buscar productos específicos mencionados
  for (const product of kb.products) {
    const productMatches = analysis.products.some(
      (p: string) => product.name.toLowerCase().includes(p) || p.includes(product.name.toLowerCase()),
    )

    if (productMatches) {
      const discount = randomSeed % 3 === 0 ? Math.floor(Math.random() * 25) + 10 : 0
      const finalPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price

      let response = `${priceVariations[randomSeed % priceVariations.length]} ${product.name} de la marca ${product.brand} es de $${product.price.toLocaleString()}.`

      if (discount > 0) {
        response += ` ${promotionPhrases[randomSeed % promotionPhrases.length]} Con un ${discount}% de descuento, te queda en $${Math.floor(finalPrice).toLocaleString()}.`
      }

      // Agregar información variable
      const additionalInfo = [
        ` Es ${product.description} y cuenta con características como: ${product.features.join(", ")}.`,
        ` Este producto se destaca por ${product.features[randomSeed % product.features.length]} y es ideal para deportistas.`,
        ` Una excelente opción que incluye ${product.features.slice(0, 2).join(" y ")}.`,
      ]

      response += additionalInfo[randomSeed % additionalInfo.length]

      if (product.stock < 5) {
        const urgencyPhrases = [
          ` Te recomiendo que no lo pienses mucho, solo nos quedan ${product.stock} unidades disponibles.`,
          ` ¡Últimas ${product.stock} unidades! Es muy popular.`,
          ` Stock limitado: solo ${product.stock} unidades restantes.`,
        ]
        response += urgencyPhrases[randomSeed % urgencyPhrases.length]
      }

      return response
    }
  }

  // Si no encuentra producto específico, dar información general con variabilidad
  const avgPrice = Math.floor(kb.products.reduce((sum, p) => sum + p.price, 0) / kb.products.length)
  const generalResponses = [
    `Nuestros precios varían dependiendo del producto y la marca. En promedio, nuestros productos deportivos van desde $25,000 hasta $850,000, con un precio promedio de $${avgPrice.toLocaleString()}. ¿Hay algún producto específico que te interese?`,
    `Manejamos una amplia gama de precios para todos los presupuestos. Desde productos básicos de $25,000 hasta equipos profesionales de $850,000. El precio promedio es $${avgPrice.toLocaleString()}. ¿Qué tipo de producto buscas?`,
    `Tenemos opciones para todos los bolsillos. Nuestro rango va de $25,000 a $850,000, siendo $${avgPrice.toLocaleString()} el precio típico. ¿Te interesa alguna categoría en particular?`,
  ]

  return generalResponses[randomSeed % generalResponses.length]
}

function handleAdvancedStockQuery(analysis: any, kb: SportsKnowledgeBase, randomSeed: number): string {
  const stockPhrases = {
    high: [
      "¡Excelente noticia! Tenemos muy buen stock de",
      "¡Perfecto! Contamos con buena disponibilidad de",
      "¡Genial! Tenemos suficiente inventario de",
    ],
    low: [
      "Sí tenemos disponible, pero te recomiendo que te decidas pronto porque solo nos quedan",
      "Está disponible, aunque el stock es limitado con solo",
      "Lo tenemos, pero es popular y solo quedan",
    ],
    out: [
      "Lamentablemente se nos agotó",
      "Lo siento mucho, pero está temporalmente agotado",
      "Desafortunadamente no tenemos stock de",
    ],
  }

  for (const product of kb.products) {
    const productMatches = analysis.products.some(
      (p: string) => product.name.toLowerCase().includes(p) || p.includes(product.name.toLowerCase()),
    )

    if (productMatches) {
      if (product.stock > 10) {
        return `${stockPhrases.high[randomSeed % stockPhrases.high.length]} ${product.name} ${product.brand}. Contamos con ${product.stock} unidades disponibles, así que puedes elegir tranquilamente tu talla o modelo preferido.`
      } else if (product.stock > 0) {
        return `${stockPhrases.low[randomSeed % stockPhrases.low.length]} ${product.stock} unidades de ${product.name} ${product.brand}. Es un producto muy popular y se agota rápido.`
      } else {
        const similarProduct = kb.products.find((p) => p.category === product.category && p.stock > 0)
        if (similarProduct) {
          return `${stockPhrases.out[randomSeed % stockPhrases.out.length]} ${product.name} ${product.brand}, pero tengo una excelente alternativa: ${similarProduct.name} ${similarProduct.brand} por $${similarProduct.price.toLocaleString()}. Tiene características similares y está disponible.`
        }
        return `${stockPhrases.out[randomSeed % stockPhrases.out.length]} ${product.name} ${product.brand}. Te puedo avisar cuando llegue nuevo stock o puedo recomendarte productos similares.`
      }
    }
  }

  const generalStockResponses = [
    "Tenemos excelente disponibilidad en la mayoría de nuestros productos deportivos. ¿Podrías decirme específicamente qué producto te interesa para darte información exacta del stock?",
    "Nuestro inventario está bien surtido. ¿Qué producto específico necesitas? Así te doy información precisa de disponibilidad.",
    "Mantenemos buen stock en general. ¿Cuál es el producto que buscas? Te confirmo disponibilidad inmediatamente.",
  ]

  return generalStockResponses[randomSeed % generalStockResponses.length]
}

// Continuar con las demás funciones agregando el parámetro randomSeed para variabilidad...
function handleAdvancedLocationQuery(analysis: any, kb: SportsKnowledgeBase, randomSeed: number): string {
  const locationIntros = [
    "Tenemos dos sucursales físicas para atenderte mejor:",
    "Contamos con dos puntos de venta estratégicamente ubicados:",
    "Puedes visitarnos en nuestras dos sucursales:",
  ]

  const locations = [
    {
      name: "Sucursal Norte - Centro Comercial Plaza Mayor",
      address: "Carrera 15 #123-45, Piso 2, Local 201",
      hours: "Lunes a Sábado: 10:00 AM - 9:00 PM, Domingos: 11:00 AM - 7:00 PM",
      phone: "(601) 234-5678",
      specialties: "Especializada en calzado deportivo y ropa fitness",
    },
    {
      name: "Sucursal Sur - Centro Comercial Sur Plaza",
      address: "Avenida 68 #45-67, Piso 1, Local 105",
      hours: "Lunes a Sábado: 9:00 AM - 8:00 PM, Domingos: 10:00 AM - 6:00 PM",
      phone: "(601) 345-6789",
      specialties: "Especializada en equipos deportivos y accesorios",
    },
  ]

  let response = locationIntros[randomSeed % locationIntros.length] + "\n\n"

  locations.forEach((location, index) => {
    response += `${index + 1}. **${location.name}**\n`
    response += `   📍 ${location.address}\n`
    response += `   🕒 ${location.hours}\n`
    response += `   📞 ${location.phone}\n`
    response += `   ⭐ ${location.specialties}\n\n`
  })

  const closingOptions = [
    "También puedes comprar en nuestra tienda online con entrega a domicilio en toda la ciudad. Ambas sucursales cuentan con parqueadero gratuito y fácil acceso en transporte público.",
    "Adicionalmente, ofrecemos compras online con delivery. Las dos sucursales tienen parqueadero sin costo y están bien conectadas por transporte público.",
    "También manejamos ventas virtuales con envío a domicilio. Ambas ubicaciones tienen estacionamiento gratuito y excelente acceso en transporte masivo.",
  ]

  response += closingOptions[randomSeed % closingOptions.length]
  return response
}

function handleAdvancedServiceQuery(analysis: any, kb: SportsKnowledgeBase, randomSeed: number): string {
  const serviceIntros = [
    "Nos enorgullecemos de ofrecer un servicio integral:",
    "Brindamos un servicio completo y de calidad:",
    "Nuestro compromiso incluye servicios excepcionales:",
  ]

  const services = {
    warranty: [
      "6 meses de garantía en todos nuestros productos",
      "Garantía completa de 6 meses",
      "6 meses de respaldo total",
    ],
    returns: [
      "30 días para cambios y devoluciones sin preguntas",
      "Política de 30 días para cambios",
      "30 días de garantía de satisfacción",
    ],
    advice: [
      "Asesoría deportiva especializada gratuita",
      "Consultoría deportiva sin costo",
      "Asesoramiento profesional incluido",
    ],
  }

  let response = serviceIntros[randomSeed % serviceIntros.length] + "\n\n"

  response += `🛡️ **Garantía:** ${services.warranty[randomSeed % services.warranty.length]}. Si algo sale mal, nosotros respondemos.\n\n`
  response += `🔄 **Cambios y Devoluciones:** ${services.returns[randomSeed % services.returns.length]}. Tu satisfacción es nuestra prioridad.\n\n`
  response += `👨‍💼 **Asesoría Especializada:** ${services.advice[randomSeed % services.advice.length]}. Nuestro equipo te ayuda a elegir el mejor equipo según tu deporte y nivel.\n\n`

  const additionalServices = [
    "Además, si compras por más de $100,000, te regalamos una consulta personalizada con nuestro especialista deportivo.",
    "Como valor agregado, compras superiores a $100,000 incluyen asesoría personalizada gratuita.",
    "Beneficio especial: consulta individual con experto deportivo en compras mayores a $100,000.",
  ]

  response += additionalServices[randomSeed % additionalServices.length]
  return response
}

function handleAdvancedDeliveryQuery(analysis: any, kb: SportsKnowledgeBase, randomSeed: number): string {
  const deliveryIntros = [
    "¡Por supuesto! Tenemos varias opciones de entrega para que elijas la que mejor te convenga:",
    "¡Claro que sí! Ofrecemos múltiples alternativas de envío:",
    "¡Absolutamente! Contamos con diferentes modalidades de entrega:",
  ]

  let response = deliveryIntros[randomSeed % deliveryIntros.length] + "\n\n"

  const deliveryOptions = [
    {
      type: "Entrega Estándar",
      time: "2-3 días hábiles",
      cost: "$8,000",
      condition: "Compras menores a $100,000",
    },
    {
      type: "Entrega Gratis",
      time: "2-3 días hábiles",
      cost: "Gratis",
      condition: "Compras mayores a $100,000",
    },
    {
      type: "Entrega Express",
      time: "24 horas",
      cost: "$15,000",
      condition: "Disponible en Bogotá y área metropolitana",
    },
  ]

  deliveryOptions.forEach((option, index) => {
    response += `${index + 1}. **${option.type}**\n`
    response += `   ⏰ Tiempo: ${option.time}\n`
    response += `   💰 Costo: ${option.cost}\n`
    response += `   📋 ${option.condition}\n\n`
  })

  const includedServices = [
    "📦 Todos nuestros envíos incluyen empaque especializado, seguro contra daños y seguimiento en tiempo real.",
    "📦 Cada envío cuenta con protección especial, cobertura de seguro y rastreo completo.",
    "📦 Incluimos empaque profesional, seguro total y monitoreo constante del envío.",
  ]

  response += includedServices[randomSeed % includedServices.length]
  return response
}

function handleRecommendationQuery(analysis: any, kb: SportsKnowledgeBase, randomSeed: number): string {
  const recommendationIntros = [
    "Basándome en tu consulta, estas son mis recomendaciones:",
    "Según tu pregunta, te sugiero estos productos:",
    "Considerando tu necesidad, estas son mis mejores opciones:",
  ]

  const recommendations = []

  if (analysis.products.length > 0) {
    for (const product of kb.products) {
      const matches = analysis.products.some(
        (p: string) =>
          product.name.toLowerCase().includes(p) ||
          product.category.toLowerCase().includes(p) ||
          product.features.some((f) => f.toLowerCase().includes(p)),
      )
      if (matches) {
        recommendations.push(product)
      }
    }
  } else {
    recommendations.push(...kb.products.slice(randomSeed % 3, (randomSeed % 3) + 3))
  }

  if (recommendations.length === 0) {
    const personalizedQuestions = [
      "Para darte la mejor recomendación, me gustaría conocer más sobre ti. ¿Qué deporte practicas o qué tipo de actividad física realizas?",
      "Para personalizar mi sugerencia, ¿podrías contarme qué actividad deportiva te interesa más?",
      "Para hacer una recomendación precisa, ¿qué tipo de deporte o ejercicio planeas realizar?",
    ]
    return personalizedQuestions[randomSeed % personalizedQuestions.length]
  }

  let response = recommendationIntros[randomSeed % recommendationIntros.length] + "\n\n"

  recommendations.slice(0, 3).forEach((product, index) => {
    const rating = (4.0 + Math.random() * 1.0).toFixed(1)
    response += `${index + 1}. **${product.name} ${product.brand}** - $${product.price.toLocaleString()}\n`
    response += `   ⭐ Calificación: ${rating}/5.0\n`
    response += `   📝 ${product.description}\n`
    response += `   ✨ Características: ${product.features.join(", ")}\n`
    response += `   📦 Stock: ${product.stock} unidades disponibles\n\n`
  })

  const closingRecommendations = [
    "Estas recomendaciones están basadas en la calidad, durabilidad y satisfacción de nuestros clientes.",
    "Estas sugerencias se fundamentan en las mejores valoraciones y experiencias de usuarios.",
    "Estas opciones han sido seleccionadas por su excelente relación calidad-precio y comentarios positivos.",
  ]

  response += closingRecommendations[randomSeed % closingRecommendations.length]
  return response
}

function handleComparisonQuery(analysis: any, kb: SportsKnowledgeBase, randomSeed: number): string {
  const products = kb.products
    .filter((p) =>
      analysis.products.some(
        (ap: string) => p.name.toLowerCase().includes(ap) || p.category.toLowerCase().includes(ap),
      ),
    )
    .slice(0, 2)

  if (products.length < 2) {
    const comparisonHelp = [
      "Para hacer una comparación efectiva, necesito que me especifiques qué productos quieres comparar.",
      "Para una comparación precisa, ¿podrías indicarme exactamente qué productos te interesan?",
      "Para ayudarte con la comparación, necesito saber qué productos específicos quieres evaluar.",
    ]
    return comparisonHelp[randomSeed % comparisonHelp.length]
  }

  const comparisonIntros = [
    `Excelente pregunta. Te ayudo a comparar ${products[0].name} ${products[0].brand} vs ${products[1].name} ${products[1].brand}:`,
    `Perfecto. Analicemos las diferencias entre ${products[0].name} ${products[0].brand} y ${products[1].name} ${products[1].brand}:`,
    `Muy buena consulta. Comparemos ${products[0].name} ${products[0].brand} contra ${products[1].name} ${products[1].brand}:`,
  ]

  let response = comparisonIntros[randomSeed % comparisonIntros.length] + "\n\n"

  response += `**${products[0].name} ${products[0].brand}:**\n`
  response += `💰 Precio: $${products[0].price.toLocaleString()}\n`
  response += `📝 ${products[0].description}\n`
  response += `✨ Características: ${products[0].features.join(", ")}\n`
  response += `📦 Stock: ${products[0].stock} unidades\n\n`

  response += `**${products[1].name} ${products[1].brand}:**\n`
  response += `💰 Precio: $${products[1].price.toLocaleString()}\n`
  response += `📝 ${products[1].description}\n`
  response += `✨ Características: ${products[1].features.join(", ")}\n`
  response += `📦 Stock: ${products[1].stock} unidades\n\n`

  const recommendations = [
    "**Mi recomendación:**\nSi buscas mejor relación calidad-precio, te recomiendo el más económico. Si buscas la máxima calidad, el premium es excelente.",
    "**Mi sugerencia:**\nPara presupuesto ajustado, la opción más accesible es ideal. Para máximo rendimiento, la opción premium vale la inversión.",
    "**Mi consejo:**\nLa opción económica ofrece gran valor. La premium brinda características superiores para uso intensivo.",
  ]

  response += recommendations[randomSeed % recommendations.length]
  return response
}

function handleGeneralQuery(
  analysis: any,
  kb: SportsKnowledgeBase,
  originalQuestion: string,
  randomSeed: number,
): string {
  const generalResponses = [
    `Entiendo tu consulta sobre "${originalQuestion}". En nuestra tienda deportiva manejamos una amplia gama de productos de las mejores marcas.`,
    `Gracias por tu pregunta sobre "${originalQuestion}". Como especialistas en deportes, tenemos todo lo que necesitas.`,
    `Me da gusto que preguntes sobre "${originalQuestion}". Somos expertos en equipamiento deportivo y podemos ayudarte.`,
  ]

  let response = generalResponses[randomSeed % generalResponses.length] + " "

  if (originalQuestion.includes("deporte") || originalQuestion.includes("ejercicio")) {
    const sportInfo = [
      "Contamos con equipos para todos los deportes: fútbol, tenis, básquet, ciclismo, running, boxeo y más.",
      "Tenemos equipamiento completo para múltiples disciplinas deportivas.",
      "Manejamos productos para toda clase de actividades físicas y deportivas.",
    ]
    response += sportInfo[randomSeed % sportInfo.length] + " "
  }

  if (originalQuestion.includes("marca") || originalQuestion.includes("calidad")) {
    response += `Trabajamos con las mejores marcas: ${kb.brands.slice(0, 4).join(", ")} y más. Todos nuestros productos tienen garantía de calidad. `
  }

  const helpOffers = [
    "¿Podrías ser más específico sobre qué producto o información necesitas?",
    "¿Te interesa algún producto en particular?",
    "¿Hay algo específico en lo que te pueda ayudar?",
  ]

  response += helpOffers[randomSeed % helpOffers.length]
  return response
}

function preprocessQuestion(question: string): string {
  // Eliminar signos de puntuación
  const cleaned = question.toLowerCase().replace(/[¿?¡!.,;:]/g, "")

  // Eliminar stopwords específicas
  const stopwords = ["es", "son", "está", "están", "hay", "tiene", "tengo", "me", "se", "le", "lo", "la"]
  const words = cleaned.split(" ")
  const filteredWords = words.filter((word) => !stopwords.includes(word))

  return filteredWords.join(" ")
}
