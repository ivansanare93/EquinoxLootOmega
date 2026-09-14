/**
 * wow-data.js — Datos centralizados de World of Warcraft
 * 
 * ACTUALIZACIÓN DE PARCHE: Solo edita este archivo para actualizar
 * clases, specs, razas o facciones con los cambios de Blizzard.
 * 
 * Versión datos: The War Within (parche 11.x) / Midnight (parche 12.x)
 */

const WOW_DATA = {
  version: "11.1",
  patchName: "The War Within",

  factions: [
    { id: "alliance", name: "Alianza", color: "#4db8ff", icon: "🔵" },
    { id: "horde", name: "Horda", color: "#cc2200", icon: "🔴" }
  ],

  races: [
    // Alliance
    { id: "human", name: "Humano", faction: "alliance", icon: "👤" },
    { id: "dwarf", name: "Enano", faction: "alliance", icon: "⛏️" },
    { id: "nightelf", name: "Elfo de la Noche", faction: "alliance", icon: "🌙" },
    { id: "gnome", name: "Gnomo", faction: "alliance", icon: "⚙️" },
    { id: "draenei", name: "Draenei", faction: "alliance", icon: "💠" },
    { id: "worgen", name: "Huargen", faction: "alliance", icon: "🐺" },
    { id: "pandaren_a", name: "Pandaren (Alianza)", faction: "alliance", icon: "🐼" },
    { id: "lightforged_draenei", name: "Draenei Forjado en Luz", faction: "alliance", icon: "✨" },
    { id: "void_elf", name: "Elfo del Vacío", faction: "alliance", icon: "🌌" },
    { id: "dark_iron_dwarf", name: "Enano Hierro Negro", faction: "alliance", icon: "🔥" },
    { id: "kul_tiran", name: "Kul Tirano", faction: "alliance", icon: "⚓" },
    { id: "mechagnome", name: "Mecagnomo", faction: "alliance", icon: "🤖" },
    { id: "earthen_a", name: "Terrígeno (Alianza)", faction: "alliance", icon: "🪨" },
    // Horde
    { id: "orc", name: "Orco", faction: "horde", icon: "💪" },
    { id: "undead", name: "No-muerto", faction: "horde", icon: "💀" },
    { id: "tauren", name: "Tauren", faction: "horde", icon: "🐂" },
    { id: "troll", name: "Trol", faction: "horde", icon: "🌿" },
    { id: "bloodelf", name: "Elfo de Sangre", faction: "horde", icon: "🌹" },
    { id: "goblin", name: "Goblin", faction: "horde", icon: "💰" },
    { id: "pandaren_h", name: "Pandaren (Horda)", faction: "horde", icon: "🐼" },
    { id: "nightborne", name: "Plenilunio", faction: "horde", icon: "🌠" },
    { id: "highmountain_tauren", name: "Tauren de las Cumbres", faction: "horde", icon: "🏔️" },
    { id: "mag_har_orc", name: "Orco Mag'har", faction: "horde", icon: "⚔️" },
    { id: "zandalari_troll", name: "Trol Zandalar", faction: "horde", icon: "🦕" },
    { id: "vulpera", name: "Vulpera", faction: "horde", icon: "🦊" },
    { id: "earthen_h", name: "Terrígeno (Horda)", faction: "horde", icon: "🪨" }
  ],

  classes: [
    {
      id: "warrior",
      name: "Guerrero",
      nameEs: "Guerrero",
      color: "#C69B3A",
      icon: "⚔️",
      description: "El maestro del combate cuerpo a cuerpo.",
      specs: [
        {
          id: "arms",
          name: "Armas",
          role: "dps",
          dpsType: "melee",
          icon: "🗡️",
          color: "#C69B3A",
          description: "Guerrero táctico que usa ataques poderosos con armas de dos manos."
        },
        {
          id: "fury",
          name: "Furia",
          role: "dps",
          dpsType: "melee",
          icon: "⚔️",
          color: "#C69B3A",
          description: "Guerrero salvaje que empuña dos armas y golpea sin descanso."
        },
        {
          id: "protection_warrior",
          name: "Protección",
          role: "tank",
          icon: "🛡️",
          color: "#C69B3A",
          description: "El baluarte inamovible que protege a sus aliados con escudo y armadura."
        }
      ]
    },
    {
      id: "paladin",
      name: "Paladín",
      nameEs: "Paladín",
      color: "#F48CBA",
      icon: "✨",
      description: "El campeón de la Luz que puede tanquear, sanar o infligir daño.",
      specs: [
        {
          id: "holy_paladin",
          name: "Sagrado",
          role: "healer",
          icon: "💛",
          color: "#F48CBA",
          description: "Sanador sagrado que canaliza la Luz para restaurar a sus aliados."
        },
        {
          id: "protection_paladin",
          name: "Protección",
          role: "tank",
          icon: "🛡️",
          color: "#F48CBA",
          description: "Tanque sagrado que usa la Luz para protegerse y castigar a sus enemigos."
        },
        {
          id: "retribution",
          name: "Reprensión",
          role: "dps",
          dpsType: "melee",
          icon: "⚖️",
          color: "#F48CBA",
          description: "Paladín vengador que imparte justicia con fuerza divina."
        }
      ]
    },
    {
      id: "hunter",
      name: "Cazador",
      nameEs: "Cazador",
      color: "#AAD372",
      icon: "🏹",
      description: "El maestro de la naturaleza y los animales.",
      specs: [
        {
          id: "beastmastery",
          name: "Maestría de Bestias",
          role: "dps",
          dpsType: "ranged",
          icon: "🐉",
          color: "#AAD372",
          description: "Cazador que domina bestias exóticas para combatir."
        },
        {
          id: "marksmanship",
          name: "Puntería",
          role: "dps",
          dpsType: "ranged",
          icon: "🎯",
          color: "#AAD372",
          description: "Tirador preciso que dispara flechas letales a gran distancia."
        },
        {
          id: "survival",
          name: "Supervivencia",
          role: "dps",
          dpsType: "melee",
          icon: "🔱",
          color: "#AAD372",
          description: "Cazador furtivo que usa trampas y lanzas en combate cuerpo a cuerpo."
        }
      ]
    },
    {
      id: "rogue",
      name: "Pícaro",
      nameEs: "Pícaro",
      color: "#FFF468",
      icon: "🗡️",
      description: "El asesino en las sombras, maestro de la furtividad.",
      specs: [
        {
          id: "assassination",
          name: "Asesinato",
          role: "dps",
          dpsType: "melee",
          icon: "☠️",
          color: "#FFF468",
          description: "Asesino experto en venenos que liquida a sus objetivos lentamente."
        },
        {
          id: "outlaw",
          name: "Forajido",
          role: "dps",
          dpsType: "melee",
          icon: "🏴‍☠️",
          color: "#FFF468",
          description: "Pícaro de estilo libre que usa pistolas y sables en combate caótico."
        },
        {
          id: "subtlety",
          name: "Sutileza",
          role: "dps",
          dpsType: "melee",
          icon: "🌑",
          color: "#FFF468",
          description: "Asesino de las sombras que golpea desde la oscuridad."
        }
      ]
    },
    {
      id: "priest",
      name: "Sacerdote",
      nameEs: "Sacerdote",
      color: "#FFFFFF",
      icon: "🌟",
      description: "El sanador por excelencia, con un lado oscuro y devastador.",
      specs: [
        {
          id: "discipline",
          name: "Disciplina",
          role: "healer",
          icon: "🌟",
          color: "#FFFFFF",
          description: "Sacerdote que sana a través de escudos y el castigo a los enemigos."
        },
        {
          id: "holy_priest",
          name: "Sagrado",
          role: "healer",
          icon: "✨",
          color: "#FFFFFF",
          description: "Sanador puro que usa la Luz para curar y proteger a todo el grupo."
        },
        {
          id: "shadow",
          name: "Sombras",
          role: "dps",
          dpsType: "ranged",
          icon: "🌑",
          color: "#FFFFFF",
          description: "Sacerdote oscuro que usa el Vacío y locura para destruir enemigos."
        }
      ]
    },
    {
      id: "deathknight",
      name: "Caballero de la Muerte",
      nameEs: "Caballero de la Muerte",
      color: "#C41E3A",
      icon: "💀",
      description: "El campeón del Arthas, amo de la muerte y las runas.",
      specs: [
        {
          id: "blood",
          name: "Sangre",
          role: "tank",
          icon: "🩸",
          color: "#C41E3A",
          description: "Tanque que drena la vida de sus enemigos para sobrevivir."
        },
        {
          id: "frost_dk",
          name: "Escarcha",
          role: "dps",
          dpsType: "melee",
          icon: "❄️",
          color: "#C41E3A",
          description: "Guerrero de la muerte que congela y destruye con poder rúnico."
        },
        {
          id: "unholy",
          name: "Profano",
          role: "dps",
          dpsType: "melee",
          icon: "☣️",
          color: "#C41E3A",
          description: "Maestro de enfermedades y no-muertos que corrompe todo a su paso."
        }
      ]
    },
    {
      id: "shaman",
      name: "Chamán",
      nameEs: "Chamán",
      color: "#0070DD",
      icon: "⚡",
      description: "El maestro de los elementos: tierra, fuego, viento y agua.",
      specs: [
        {
          id: "elemental",
          name: "Elemental",
          role: "dps",
          dpsType: "ranged",
          icon: "⚡",
          color: "#0070DD",
          description: "Chamán que canaliza el poder de los rayos y la lava a distancia."
        },
        {
          id: "enhancement",
          name: "Mejora",
          role: "dps",
          dpsType: "melee",
          icon: "🌪️",
          color: "#0070DD",
          description: "Chamán guerrero que lleva los elementos directamente al combate."
        },
        {
          id: "restoration_shaman",
          name: "Restauración",
          role: "healer",
          icon: "💧",
          color: "#0070DD",
          description: "Sanador que usa las cadenas de sanación y el poder del agua."
        }
      ]
    },
    {
      id: "mage",
      name: "Mago",
      nameEs: "Mago",
      color: "#3FC7EB",
      icon: "🔮",
      description: "El maestro de los arcanos, fuego y hielo.",
      specs: [
        {
          id: "arcane",
          name: "Arcano",
          role: "dps",
          dpsType: "ranged",
          icon: "🔮",
          color: "#3FC7EB",
          description: "Mago que manipula la magia pura y arcana para devastar enemigos."
        },
        {
          id: "fire",
          name: "Fuego",
          role: "dps",
          dpsType: "ranged",
          icon: "🔥",
          color: "#3FC7EB",
          description: "Mago que invoca llamas cataclísmicas sobre sus enemigos."
        },
        {
          id: "frost_mage",
          name: "Escarcha",
          role: "dps",
          dpsType: "ranged",
          icon: "❄️",
          color: "#3FC7EB",
          description: "Mago que congela el tiempo y el espacio alrededor de sus enemigos."
        }
      ]
    },
    {
      id: "warlock",
      name: "Brujo",
      nameEs: "Brujo",
      color: "#9482C9",
      icon: "👁️",
      description: "El maestro de la magia oscura, demonios y la corrupción.",
      specs: [
        {
          id: "affliction",
          name: "Aflicción",
          role: "dps",
          dpsType: "ranged",
          icon: "💜",
          color: "#9482C9",
          description: "Brujo que aplica múltiples maldiciones y pociones de dolor a sus enemigos."
        },
        {
          id: "demonology",
          name: "Demonología",
          role: "dps",
          dpsType: "ranged",
          icon: "👹",
          color: "#9482C9",
          description: "Brujo que invoca hordas de demonios para que luchen por él."
        },
        {
          id: "destruction",
          name: "Destrucción",
          role: "dps",
          dpsType: "ranged",
          icon: "🌋",
          color: "#9482C9",
          description: "Brujo que lanza Lluvias de Fuego y Caos para arrasar con todo."
        }
      ]
    },
    {
      id: "monk",
      name: "Monje",
      nameEs: "Monje",
      color: "#00FF98",
      icon: "🥋",
      description: "El maestro del Viento de Jade, ágil y versátil.",
      specs: [
        {
          id: "brewmaster",
          name: "Maestro Cervecero",
          role: "tank",
          icon: "🍺",
          color: "#00FF98",
          description: "Tanque que usa el Viento de Jade y el alcohol para esquivar golpes."
        },
        {
          id: "mistweaver",
          name: "Tejedor de Niebla",
          role: "healer",
          icon: "🌿",
          color: "#00FF98",
          description: "Sanador que usa el Chi y la niebla para curar a sus aliados."
        },
        {
          id: "windwalker",
          name: "Caminante del Viento",
          role: "dps",
          dpsType: "melee",
          icon: "💨",
          color: "#00FF98",
          description: "Luchador ágil que golpea con velocidad sobrehumana."
        }
      ]
    },
    {
      id: "druid",
      name: "Druida",
      nameEs: "Druida",
      color: "#FF7C0A",
      icon: "🐾",
      description: "El guardián de la naturaleza que puede adoptar cualquier rol.",
      specs: [
        {
          id: "balance",
          name: "Equilibrio",
          role: "dps",
          dpsType: "ranged",
          icon: "🌙",
          color: "#FF7C0A",
          description: "Druida que usa el poder estelar y lunar para arrasar a sus enemigos."
        },
        {
          id: "feral",
          name: "Feral",
          role: "dps",
          dpsType: "melee",
          icon: "🐆",
          color: "#FF7C0A",
          description: "Druida en forma de gato que ataca con garras venenosas."
        },
        {
          id: "guardian",
          name: "Guardián",
          role: "tank",
          icon: "🐻",
          color: "#FF7C0A",
          description: "Druida en forma de oso que absorbe todo el daño del mundo."
        },
        {
          id: "restoration_druid",
          name: "Restauración",
          role: "healer",
          icon: "🌳",
          color: "#FF7C0A",
          description: "Druida que usa la naturaleza para sanar con HOTs y el Árbol de la Vida."
        }
      ]
    },
    {
      id: "demonhunter",
      name: "Cazademonios",
      nameEs: "Cazademonios",
      color: "#A330C9",
      icon: "😈",
      description: "El exilado de Illidan que usa el poder demoníaco para luchar.",
      specs: [
        {
          id: "havoc",
          name: "Estragos",
          role: "dps",
          dpsType: "melee",
          icon: "😈",
          color: "#A330C9",
          description: "Cazademonios veloz que vuela y corta a sus enemigos en pedazos."
        },
        {
          id: "vengeance",
          name: "Venganza",
          role: "tank",
          icon: "🔥",
          color: "#A330C9",
          description: "Tanque que absorbe el dolor demoníaco y lo convierte en poder."
        },
        {
          id: "devorador",
          name: "Devorador",
          role: "dps",
          dpsType: "melee",
          icon: "🩸",
          color: "#A330C9",
          description: "Cazademonios que consume la esencia de sus enemigos para potenciar sus ataques."
        }
      ]
    },
    {
      id: "evoker",
      name: "Evocador",
      nameEs: "Evocador",
      color: "#33937F",
      icon: "🐲",
      description: "El dracthyr que canaliza el poder de los dragones.",
      specs: [
        {
          id: "devastation",
          name: "Devastación",
          role: "dps",
          dpsType: "ranged",
          icon: "🔥",
          color: "#33937F",
          description: "Evocador que lanza aliento de dragón y hechizos devastadores."
        },
        {
          id: "preservation",
          name: "Preservación",
          role: "healer",
          icon: "💚",
          color: "#33937F",
          description: "Evocador que manipula el tiempo para sanar y proteger aliados."
        },
        {
          id: "augmentation",
          name: "Potenciación",
          role: "dps",
          dpsType: "ranged",
          icon: "✨",
          color: "#33937F",
          description: "Evocador de soporte que amplifica el poder de sus aliados."
        }
      ]
    }
  ],

  // Mensajes de humor por rol
  messages: {
    tank: [
      "Enhorabuena. Ahora eres responsable de todo.",
      "El grupo entero te culpará si algo sale mal. ¡Bienvenido!",
      "Tu trabajo: caminar adelante y no morir. ¿Lo tendrás?",
      "Eres el escudo. La muralla. El chivo expiatorio.",
      "El camino lo marcas tú. Intenta no perderte.",
      "Spoiler: el grupo ya te está culpando mentalmente.",
      "La responsabilidad que buscabas. O no.",
      "Tanqueando: porque alguien tiene que aguantar los gritos."
    ],
    healer: [
      "Tu destino es mantener vivos a estos animales.",
      "DPS pisando mecánicas. Otra vez. Prepara los rezos.",
      "El tanque ha tanqueado con la cara. Otra vez. Cura.",
      "Tu trabajo: hacer milagros con maná infinito. Spoiler: no es infinito.",
      "Felicidades. Ahora depende de ti que nadie muera por su culpa.",
      "Cuando el grupo muera, será culpa tuya. Siempre.",
      "Preparado para ser el invisible hasta que alguien necesite curación.",
      "El healer llora, pero nadie lo ve porque todos están muertos."
    ],
    dps: [
      "Perfecto. Ahora toca hacer daño y morir por pisar una mecánica.",
      "Tu trabajo: números grandes. Tu realidad: pisar lava.",
      "Eres uno más entre los DPS. Que empiece la carrera de metros.",
      "El simulacro dice que deberías hacer más daño. Inténtalo.",
      "Tus únicos enemigos: el jefe y el suelo que pisarás sin querer.",
      "El healer ya te odia. El tanque también. Pero los números molan.",
      "DPS: porque el tanque y el healer ya tenían demasiada responsabilidad.",
      "Tu hora ha llegado. Intenta no aggro al jefe."
    ],
    melee: [
      "Cuerpo a cuerpo: donde la lava, el fuego y las mecánicas son tus mejores amigos.",
      "¡Al frente! Seguramente no hay nada mortal justo ahí.",
      "El jefe te aplastará. El suelo te quemará. Tú sonreirás.",
      "Melee: porque la distancia del boss es la más emocionante."
    ],
    ranged: [
      "Puedes hacer daño desde lejos. No lo desperdicies pisando mecánicas.",
      "El lujo de pegar desde seguridad... relativa.",
      "A distancia, tranquilo, sereno. Hasta que el jefe te alcanza igualmente.",
      "El rango es tu aliado. El suelo, tu traidor."
    ],
    favorite: [
      "EL UNIVERSO HA HABLADO.",
      "¡El destino te ha sonreído hoy!",
      "Era tu elección desde el principio. El cosmos lo sabía.",
      "Las estrellas se han alineado en tu favor.",
      "¡ESTO ERA LO QUE QUERÍAS!",
      "El RNG te ama. Hoy.",
      "¡Ganaste a la ruleta de la vida!"
    ],
    bad: [
      "No puedes escapar de tu destino.",
      "El universo tiene sentido del humor.",
      "Podrías haber dicho que no... pero aquí estamos.",
      "La ruleta no miente. Solo juzga.",
      "Acepta tu destino con dignidad.",
      "La vida es así. Gira de nuevo si tienes agallas.",
      "¿EN SERIO OTRA VEZ? El cosmos conspira contra ti.",
      "El destino a veces es cruel. Hoy es uno de esos días."
    ],
    streak_good: [
      "🔥 ¡ESTÁS EN RACHA! El RNG está de tu lado.",
      "🌟 ¡TODO LO QUE TOCAS SE CONVIERTE EN ORO!",
      "⚡ ¡IMPARABLE! La ruleta te adora.",
      "🎉 ¡Tres seguidas perfectas! ¿Quién te para ahora?"
    ],
    streak_bad: [
      "💀 ¿EN SERIO OTRA VEZ? El universo tiene fijación contigo.",
      "😱 La racha de mala suerte es REAL.",
      "🌑 El RNG oscuro te ha elegido.",
      "💀 En otro universo, te salía lo que querías."
    ],
    finalboss: [
      "⚡ ¡HA LLEGADO EL MOMENTO FINAL!",
      "🔱 ¡TIRADA DEL DESTINO ABSOLUTO!",
      "💥 ¡LA ÚLTIMA OPORTUNIDAD!",
      "🌟 ¡EL FINAL BOSS HA DESPERTADO!"
    ],
    chaos: [
      "🎲 ¡EL CAOS DECIDE!",
      "🌀 Cuando el azar manda, nadie está a salvo.",
      "🎭 Hoy el destino tiene mal día y quiere compartirlo.",
      "⚡ ¡El caos ha elegido por ti!"
    ]
  },

  // Frases de intro al girar
  spinPhrases: [
    "Las runas se activan...",
    "El destino está tomando forma...",
    "Los dioses de Azeroth deliberan...",
    "El hado teje su tela...",
    "La magia arcana decide...",
    "Los ancestros consultan...",
    "El cosmos está evaluando...",
    "Azeroth ha escuchado tu plegaria..."
  ],

  // Configuración por defecto de pesos
  defaultWeight: 1,

  // Colores de clase para la ruleta (uso rápido)
  classColors: {
    warrior: "#C69B3A",
    paladin: "#F48CBA",
    hunter: "#AAD372",
    rogue: "#FFF468",
    priest: "#FFFFFF",
    deathknight: "#C41E3A",
    shaman: "#0070DD",
    mage: "#3FC7EB",
    warlock: "#9482C9",
    monk: "#00FF98",
    druid: "#FF7C0A",
    demonhunter: "#A330C9",
    evoker: "#33937F"
  }
};

// Utilidades de datos
const WOWDataUtils = {
  /** Devuelve todas las specs de todas las clases en un array plano */
  getAllSpecs() {
    return WOW_DATA.classes.flatMap(cls =>
      cls.specs.map(spec => ({ ...spec, classId: cls.id, className: cls.name, classColor: cls.color, classIcon: cls.icon }))
    );
  },

  /** Filtra specs por rol */
  getSpecsByRole(role) {
    return this.getAllSpecs().filter(s => s.role === role);
  },

  /** Filtra specs por tipo de DPS */
  getSpecsByDpsType(dpsType) {
    return this.getAllSpecs().filter(s => s.dpsType === dpsType);
  },

  /** Devuelve una clase por su ID */
  getClassById(id) {
    return WOW_DATA.classes.find(c => c.id === id);
  },

  /** Devuelve una spec por su ID */
  getSpecById(specId) {
    for (const cls of WOW_DATA.classes) {
      const spec = cls.specs.find(s => s.id === specId);
      if (spec) return { ...spec, classId: cls.id, className: cls.name, classColor: cls.color, classIcon: cls.icon };
    }
    return null;
  },

  /** Devuelve un mensaje aleatorio por categoría */
  getRandomMessage(category) {
    const msgs = WOW_DATA.messages[category];
    if (!msgs || msgs.length === 0) return "";
    return msgs[Math.floor(Math.random() * msgs.length)];
  },

  /** Devuelve una frase de spin aleatoria */
  getRandomSpinPhrase() {
    const phrases = WOW_DATA.spinPhrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  /** Devuelve mensaje de resultado según rol y si es favorito/malo */
  getResultMessage(spec, isFavorite = false, isBad = false) {
    if (isFavorite) return this.getRandomMessage("favorite");
    if (isBad) return this.getRandomMessage("bad");
    if (spec.role === "tank") return this.getRandomMessage("tank");
    if (spec.role === "healer") return this.getRandomMessage("healer");
    if (spec.dpsType === "melee") return this.getRandomMessage("melee");
    if (spec.dpsType === "ranged") return this.getRandomMessage("ranged");
    return this.getRandomMessage("dps");
  }
};

// Exportar: siempre exponer como global para browser
if (typeof window !== "undefined") {
  window.WOW_DATA = WOW_DATA;
  window.WOWDataUtils = WOWDataUtils;
}
// También como módulo CommonJS si aplica
if (typeof module !== "undefined" && module.exports) {
  module.exports = { WOW_DATA, WOWDataUtils };
}
