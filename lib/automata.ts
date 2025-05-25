// Definición mejorada de un Autómata Finito Determinista (AFD)
export interface State {
  id: string
  isAccepting: boolean
  transitions: Record<string, string>
}

export interface Automaton {
  states: Record<string, State>
  initialState: string
  alphabet: string[]
  name: string
  description: string
}

// Función para verificar si una cadena es aceptada por un autómata
export function isAccepted(automaton: Automaton, input: string): boolean {
  let currentState = automaton.initialState

  for (const char of input) {
    // Verificar si el carácter está en el alfabeto
    if (!automaton.alphabet.includes(char)) {
      return false
    }
    // Obtener el siguiente estado
    const nextState = automaton.states[currentState].transitions[char]

    // Si no hay transición para este carácter, la cadena no es aceptada
    if (!nextState) {
      return false
    }

    currentState = nextState
  }

  // Verificar si el estado final es de aceptación
  return automaton.states[currentState].isAccepting
}

// Función para encontrar el primer carácter que causa error en un autómata
export function findFirstErrorChar(
  automaton: Automaton,
  input: string,
): { errorChar: string | null; position: number } {
  let currentState = automaton.initialState

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    // Verificar si el carácter está en el alfabeto
    if (!automaton.alphabet.includes(char)) {
      return { errorChar: char, position: i }
    }

    // Obtener el siguiente estado
    const nextState = automaton.states[currentState].transitions[char]

    // Si no hay transición para este carácter, es un error
    if (!nextState) {
      return { errorChar: char, position: i }
    }

    currentState = nextState
  }

  // Si llegamos al final sin errores pero el estado no es de aceptación
  if (!automaton.states[currentState].isAccepting) {
    return { errorChar: "EOF", position: input.length } // End of file - la cadena está incompleta
  }

  return { errorChar: null, position: -1 } // No hay errores
}

// Función para simular la ejecución de un autómata paso a paso
export function simulateAutomaton(
  automaton: Automaton,
  input: string,
): {
  steps: { state: string; char: string; nextState: string }[]
  accepted: boolean
  errorInfo: { errorChar: string | null; position: number } | null
} {
  let currentState = automaton.initialState
  const steps: { state: string; char: string; nextState: string }[] = []
  let errorInfo: { errorChar: string | null; position: number } | null = null

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    // Verificar si el carácter está en el alfabeto
    if (!automaton.alphabet.includes(char)) {
      errorInfo = { errorChar: char, position: i }
      break
    }

    // Obtener el siguiente estado
    const nextState = automaton.states[currentState].transitions[char]

    // Si no hay transición para este carácter, es un error
    if (!nextState) {
      errorInfo = { errorChar: char, position: i }
      break
    }

    steps.push({ state: currentState, char, nextState })
    currentState = nextState
  }

  // Verificar si el estado final es de aceptación
  const accepted = errorInfo === null && automaton.states[currentState].isAccepting

  // Si no hay errores específicos pero el estado final no es de aceptación
  if (errorInfo === null && !accepted) {
    errorInfo = { errorChar: "EOF", position: input.length }
  }

  return { steps, accepted, errorInfo }
}

// Autómata mejorado para identificadores
export const identifierAutomaton: Automaton = {
  name: "Identificador",
  description: "Reconoce identificadores que comienzan con letra o _ y continúan con letras, dígitos o _",
  states: {
    q0: {
      id: "q0",
      isAccepting: false,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q1",
        p: "q1",
        q: "q1",
        r: "q1",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
        A: "q1",
        B: "q1",
        C: "q1",
        D: "q1",
        E: "q1",
        F: "q1",
        G: "q1",
        H: "q1",
        I: "q1",
        J: "q1",
        K: "q1",
        L: "q1",
        M: "q1",
        N: "q1",
        O: "q1",
        P: "q1",
        Q: "q1",
        R: "q1",
        S: "q1",
        T: "q1",
        U: "q1",
        V: "q1",
        W: "q1",
        X: "q1",
        Y: "q1",
        Z: "q1",
        á: "q1",
        é: "q1",
        í: "q1",
        ó: "q1",
        ú: "q1",
        ü: "q1",
        ñ: "q1",
        Á: "q1",
        É: "q1",
        Í: "q1",
        Ó: "q1",
        Ú: "q1",
        Ü: "q1",
        Ñ: "q1",
        _: "q1",
      },
    },
    q1: {
      id: "q1",
      isAccepting: true,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q1",
        p: "q1",
        q: "q1",
        r: "q1",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
        A: "q1",
        B: "q1",
        C: "q1",
        D: "q1",
        E: "q1",
        F: "q1",
        G: "q1",
        H: "q1",
        I: "q1",
        J: "q1",
        K: "q1",
        L: "q1",
        M: "q1",
        N: "q1",
        O: "q1",
        P: "q1",
        Q: "q1",
        R: "q1",
        S: "q1",
        T: "q1",
        U: "q1",
        V: "q1",
        W: "q1",
        X: "q1",
        Y: "q1",
        Z: "q1",
        á: "q1",
        é: "q1",
        í: "q1",
        ó: "q1",
        ú: "q1",
        ü: "q1",
        ñ: "q1",
        Á: "q1",
        É: "q1",
        Í: "q1",
        Ó: "q1",
        Ú: "q1",
        Ü: "q1",
        Ñ: "q1",
        _: "q1",
        "0": "q1",
        "1": "q1",
        "2": "q1",
        "3": "q1",
        "4": "q1",
        "5": "q1",
        "6": "q1",
        "7": "q1",
        "8": "q1",
        "9": "q1",
      },
    },
  },
  initialState: "q0",
  alphabet: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "á",
    "é",
    "í",
    "ó",
    "ú",
    "ü",
    "ñ",
    "Á",
    "É",
    "Í",
    "Ó",
    "Ú",
    "Ü",
    "Ñ",
    "_",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ],
}

// Autómata simplificado para verbos
export const verbAutomaton: Automaton = {
  name: "Verbo",
  description: "Reconoce verbos en español",
  states: {
    q0: {
      id: "q0",
      isAccepting: false,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q1",
        p: "q1",
        q: "q1",
        r: "q1",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
      },
    },
    q1: {
      id: "q1",
      isAccepting: false,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q1",
        p: "q1",
        q: "q1",
        r: "q2",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
      },
    },
    q2: {
      id: "q2",
      isAccepting: true,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q1",
        p: "q1",
        q: "q1",
        r: "q1",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
      },
    },
  },
  initialState: "q0",
  alphabet: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
}

// Autómata simplificado para sustantivos
export const nounAutomaton: Automaton = {
  name: "Sustantivo",
  description: "Reconoce sustantivos en español",
  states: {
    q0: {
      id: "q0",
      isAccepting: false,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q1",
        p: "q1",
        q: "q1",
        r: "q1",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
      },
    },
    q1: {
      id: "q1",
      isAccepting: false,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q2",
        p: "q1",
        q: "q1",
        r: "q1",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
      },
    },
    q2: {
      id: "q2",
      isAccepting: true,
      transitions: {
        a: "q1",
        b: "q1",
        c: "q1",
        d: "q1",
        e: "q1",
        f: "q1",
        g: "q1",
        h: "q1",
        i: "q1",
        j: "q1",
        k: "q1",
        l: "q1",
        m: "q1",
        n: "q1",
        o: "q1",
        p: "q1",
        q: "q1",
        r: "q1",
        s: "q1",
        t: "q1",
        u: "q1",
        v: "q1",
        w: "q1",
        x: "q1",
        y: "q1",
        z: "q1",
      },
    },
  },
  initialState: "q0",
  alphabet: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
}
