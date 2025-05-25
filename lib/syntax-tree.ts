// Nueva librería para generar árboles sintácticos
export interface TreeNode {
  label: string
  children: TreeNode[]
  isTerminal: boolean
  level: number
  id: string
}

export interface SyntaxTree {
  root: TreeNode
  derivationSteps: string[]
}

// Función mejorada para generar árbol sintáctico a partir de los tokens
export function generateSyntaxTree(
  parsingSteps: Array<{ stack: string[]; input: string[]; action: string }>,
  tokens: string[] = [],
): SyntaxTree {
  // Si no hay pasos de parsing, crear un árbol básico basado en los tokens
  if (parsingSteps.length === 0 && tokens.length > 0) {
    return generateBasicSyntaxTree(tokens)
  }

  if (parsingSteps.length === 0) {
    return {
      root: { label: "S", children: [], isTerminal: false, level: 0, id: "root" },
      derivationSteps: [],
    }
  }

  // Crear el nodo raíz
  const root: TreeNode = {
    label: "S",
    children: [],
    isTerminal: false,
    level: 0,
    id: "root",
  }

  const derivationSteps: string[] = []
  const currentDerivation = "S"

  // Procesar los pasos de parsing para construir el árbol
  buildTreeFromSteps(root, parsingSteps, derivationSteps, currentDerivation)

  return {
    root,
    derivationSteps,
  }
}

// Función para generar un árbol básico cuando no hay pasos de parsing
function generateBasicSyntaxTree(tokens: string[]): SyntaxTree {
  const root: TreeNode = {
    label: "S",
    children: [],
    isTerminal: false,
    level: 0,
    id: "root",
  }

  // Crear estructura básica S → SN SV
  const sn: TreeNode = {
    label: "SN",
    children: [],
    isTerminal: false,
    level: 1,
    id: "sn",
  }

  const sv: TreeNode = {
    label: "SV",
    children: [],
    isTerminal: false,
    level: 1,
    id: "sv",
  }

  root.children.push(sn, sv)

  // Analizar tokens y asignar a SN o SV
  let currentNode = sn
  let nodeCounter = 0

  tokens.forEach((token, index) => {
    const tokenType = classifyToken(token)

    if (tokenType === "verbo" && currentNode === sn) {
      currentNode = sv
    }

    const terminalNode: TreeNode = {
      label: token,
      children: [],
      isTerminal: true,
      level: currentNode.level + 1,
      id: `terminal_${nodeCounter++}`,
    }

    // Crear nodo intermedio si es necesario
    if (tokenType !== "unknown") {
      const typeNode: TreeNode = {
        label: tokenType,
        children: [terminalNode],
        isTerminal: false,
        level: currentNode.level + 1,
        id: `type_${nodeCounter++}`,
      }
      currentNode.children.push(typeNode)
      terminalNode.level = typeNode.level + 1
    } else {
      currentNode.children.push(terminalNode)
    }
  })

  const derivationSteps = ["1. S", "2. SN SV", `3. ${tokens.join(" ")}`]

  return {
    root,
    derivationSteps,
  }
}

function classifyToken(token: string): string {
  const lowerToken = token.toLowerCase()

  if (/^(el|la|los|las|un|una|unos|unas)$/.test(lowerToken)) {
    return "Det"
  } else if (
    /^(tener|tienen|costar|cuesta|vender|comprar|entregar|hacer|ser|estar|haber|cuestan|tienen|hacen|ofrecen)$/.test(
      lowerToken,
    )
  ) {
    return "V"
  } else if (
    /^(a|ante|bajo|con|contra|de|desde|en|entre|hacia|hasta|para|por|según|sin|sobre|tras)$/.test(lowerToken)
  ) {
    return "Prep"
  } else if (/^(qué|cuál|cuánto|cuántos|cuánta|cuántas|dónde|cómo|quién|quiénes|cuándo)$/.test(lowerToken)) {
    return "Interr"
  } else if (/^[.,;:!?¿¡]$/.test(token)) {
    return "Punt"
  } else {
    return "N" // Por defecto, sustantivo
  }
}

function buildTreeFromSteps(
  root: TreeNode,
  parsingSteps: Array<{ stack: string[]; input: string[]; action: string }>,
  derivationSteps: string[],
  currentDerivation: string,
) {
  const nodeStack: TreeNode[] = [root]
  let nodeCounter = 0

  for (let i = 0; i < parsingSteps.length; i++) {
    const step = parsingSteps[i]

    if (step.action.includes("Expandir")) {
      const match = step.action.match(/Expandir (.+) → (.+)/)
      if (match) {
        const nonTerminal = match[1]
        const production = match[2].split(" ")

        const currentNode = nodeStack.find((node) => node.label === nonTerminal && node.children.length === 0)

        if (currentNode) {
          production.forEach((symbol) => {
            const childNode: TreeNode = {
              label: symbol,
              children: [],
              isTerminal: isTerminalSymbol(symbol),
              level: currentNode.level + 1,
              id: `node_${nodeCounter++}`,
            }
            currentNode.children.push(childNode)

            if (!childNode.isTerminal) {
              nodeStack.push(childNode)
            }
          })

          currentDerivation = currentDerivation.replace(nonTerminal, production.join(" "))
          derivationSteps.push(`${i + 1}. ${currentDerivation}`)
        }
      }
    }
  }
}

function isTerminalSymbol(symbol: string): boolean {
  const terminals = [
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
    "art",
    "sust",
    "verbo",
    "adj",
    "adv",
    "prep",
    "pronom",
    "det",
    "interr",
    "punt",
  ]

  return terminals.includes(symbol.toLowerCase()) || /^[.,;:!?¿¡]$/.test(symbol)
}

// Función para renderizar el árbol como texto ASCII
export function renderTreeAsText(tree: SyntaxTree): string {
  if (!tree.root) return "No hay árbol sintáctico disponible"

  let result = "Árbol Sintáctico:\n\n"
  result += renderNodeAsText(tree.root, "", true, true)

  result += "\n\nPasos de Derivación:\n"
  tree.derivationSteps.forEach((step) => {
    result += `${step}\n`
  })

  return result
}

function renderNodeAsText(node: TreeNode, prefix: string, isLast: boolean, isRoot: boolean): string {
  let result = ""

  if (isRoot) {
    result += `${node.label}\n`
  } else {
    const connector = isLast ? "└── " : "├── "
    result += `${prefix}${connector}${node.label}\n`
  }

  const newPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ")

  node.children.forEach((child, index) => {
    const isLastChild = index === node.children.length - 1
    result += renderNodeAsText(child, newPrefix, isLastChild, false)
  })

  return result
}

// Función mejorada para generar SVG visual del árbol sintáctico
export function generateTreeSVG(tree: SyntaxTree): string {
  if (!tree.root) return ""

  const nodePositions = calculateNodePositions(tree.root)
  const svgWidth = Math.max(800, Math.max(...nodePositions.map((p) => p.x)) + 100)
  const svgHeight = Math.max(400, Math.max(...nodePositions.map((p) => p.y)) + 80)

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" class="syntax-tree-svg">
    <defs>
      <style>
        .node-circle { fill: #3b82f6; stroke: #1e40af; stroke-width: 2; }
        .terminal-circle { fill: #10b981; stroke: #059669; stroke-width: 2; }
        .node-text { fill: white; font-family: monospace; font-size: 11px; text-anchor: middle; dominant-baseline: central; font-weight: bold; }
        .edge-line { stroke: #6b7280; stroke-width: 2; }
      </style>
    </defs>`

  // Dibujar las líneas primero (para que estén detrás de los nodos)
  svg += drawEdges(tree.root, nodePositions)

  // Dibujar los nodos
  svg += drawNodes(nodePositions)

  svg += "</svg>"
  return svg
}

interface NodePosition {
  node: TreeNode
  x: number
  y: number
}

function calculateNodePositions(root: TreeNode): NodePosition[] {
  const positions: NodePosition[] = []
  const levelNodes: TreeNode[][] = []

  // Agrupar nodos por nivel
  function groupByLevel(node: TreeNode, level: number) {
    if (!levelNodes[level]) levelNodes[level] = []
    levelNodes[level].push(node)

    node.children.forEach((child) => {
      groupByLevel(child, level + 1)
    })
  }

  groupByLevel(root, 0)

  // Posicionar nodos
  const levelSpacing = 80
  const baseNodeSpacing = 120

  levelNodes.forEach((nodes, level) => {
    const nodeSpacing = Math.max(baseNodeSpacing, 800 / Math.max(nodes.length, 1))
    const totalWidth = (nodes.length - 1) * nodeSpacing
    const startX = (800 - totalWidth) / 2

    nodes.forEach((node, index) => {
      const x = nodes.length === 1 ? 400 : startX + index * nodeSpacing
      const y = level * levelSpacing + 50

      positions.push({ node, x, y })
    })
  })

  return positions
}

function drawEdges(root: TreeNode, positions: NodePosition[]): string {
  let edges = ""

  function getNodePosition(node: TreeNode): NodePosition | undefined {
    return positions.find((p) => p.node.id === node.id)
  }

  function drawNodeEdges(node: TreeNode) {
    const parentPos = getNodePosition(node)
    if (!parentPos) return

    node.children.forEach((child) => {
      const childPos = getNodePosition(child)
      if (childPos) {
        edges += `<line x1="${parentPos.x}" y1="${parentPos.y + 20}" x2="${childPos.x}" y2="${childPos.y - 20}" class="edge-line" />\n`
      }
      drawNodeEdges(child)
    })
  }

  drawNodeEdges(root)
  return edges
}

function drawNodes(positions: NodePosition[]): string {
  let nodes = ""

  positions.forEach((pos) => {
    const radius = 20
    const circleClass = pos.node.isTerminal ? "terminal-circle" : "node-circle"

    // Truncar texto si es muy largo
    const displayText = pos.node.label.length > 8 ? pos.node.label.substring(0, 8) + "..." : pos.node.label

    nodes += `<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" class="${circleClass}" />\n`
    nodes += `<text x="${pos.x}" y="${pos.y}" class="node-text">${displayText}</text>\n`
  })

  return nodes
}

// Función para generar componente React del árbol
export function generateTreeComponent(tree: SyntaxTree): string {
  if (!tree.root) return "<p>No hay árbol sintáctico disponible</p>"

  const svg = generateTreeSVG(tree)

  return `
    <div class="syntax-tree-container">
      <h4 class="font-medium mb-3 text-teal-700 dark:text-teal-300">Árbol Sintáctico Visual:</h4>
      <div class="tree-visual bg-white dark:bg-slate-800 p-4 rounded border overflow-x-auto">
        ${svg}
      </div>
      <h4 class="font-medium mt-4 mb-2 text-teal-700 dark:text-teal-300">Derivación paso a paso:</h4>
      <ol class="list-decimal pl-5 space-y-1">
        ${tree.derivationSteps
          .map((step) => `<li class="text-sm font-mono">${step.substring(step.indexOf(".") + 2)}</li>`)
          .join("")}
      </ol>
    </div>
  `
}
