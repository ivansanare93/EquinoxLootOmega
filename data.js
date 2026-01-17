// ==========================================
// DATOS CENTRALIZADOS - Larancio Loot Manager
// ==========================================

// Información de Bosses (Nombres traducidos al español)
const bosses = [
    { id: 1, name: 'Centinela del Plexo', description: 'Boss opcional, patrulla la maquinaria.' },
    { id: 2, name: 'Loom\'ithar', description: 'Tejedor de seda arcana.' },
    { id: 3, name: 'Vinculador de Almas Naazindhri', description: 'Vinculador de almas.' },
    { id: 4, name: 'Tejedora de la Forja Araz', description: 'Controla operaciones de la forja.' },
    { id: 5, name: 'Los Cazadores de Almas', description: 'Consejo de cazadores de almas void.' },
    { id: 6, name: 'Fractillus', description: 'Elemental de arena y vidrio.' },
    { id: 7, name: 'Rey del Nexo Salhadaar', description: 'Rey etéreo en su montura void.' },
    { id: 8, name: 'Dimensius, el Devorador Total', description: 'Jefe final, destructor de K\'aresh.' }
];

// Loot completado con nombres traducidos al español
const lootByBoss = {
    1: [ // Centinela del Plexo (ilvl base 684)
        { bossId: 1, name: 'Cañones Mana Montados', type: 'Cloth Armor', slot: 'Shoulder', ilvlBase: 684, rarity: 'Epic', description: 'Hombros de tela con cañones mana.', wowheadLink: 'https://www.wowhead.com/item=237547/mounted-manacannons' },
        { bossId: 1, name: 'Puños de Criba Chamuscados', type: 'Cloth Armor', slot: 'Wrist', ilvlBase: 684, rarity: 'Epic', description: 'Muñequeras de tela chamuscadas.', wowheadLink: 'https://www.wowhead.com/item=237534/singed-sievecuffs' },
        { bossId: 1, name: 'Cinturón de Fase Atómico', type: 'Leather Armor', slot: 'Waist', ilvlBase: 684, rarity: 'Epic', description: 'Cinturón de cuero atómico.', wowheadLink: 'https://www.wowhead.com/item=237533/atomic-phasebelt' },
        { bossId: 1, name: 'Filtro de Impurezas Irradiado', type: 'Leather Armor', slot: 'Head', ilvlBase: 684, rarity: 'Epic', description: 'Filtro de impurezas irradiado.', wowheadLink: 'https://www.wowhead.com/item=237525/irradiated-impurity-filter' },
        { bossId: 1, name: 'Chaleco Chambersieve', type: 'Mail Armor', slot: 'Legs', ilvlBase: 684, rarity: 'Epic', description: 'Chaleco de malla chambersieve.', wowheadLink: 'https://www.wowhead.com/item=237543/chambersieve-waistcoat' },
        { bossId: 1, name: 'Matriz de Muñeca Arcanotech', type: 'Mail Armor', slot: 'Wrist', ilvlBase: 684, rarity: 'Epic', description: 'Matriz de muñeca arcanotech.', wowheadLink: 'https://www.wowhead.com/item=237523/arcanotech-wrist-matrix' },
        { bossId: 1, name: 'Chasis de Desplazamiento Manaforjado', type: 'Plate Armor', slot: 'Chest', ilvlBase: 684, rarity: 'Epic', description: 'Chasis de desplazamiento manaforged.', wowheadLink: 'https://www.wowhead.com/item=237528/manaforged-displacement-chassis' },
        { bossId: 1, name: 'Botas de Expulsión Esterilizadas', type: 'Plate Armor', slot: 'Feet', ilvlBase: 684, rarity: 'Epic', description: 'Botas de expulsión esterilizadas.', wowheadLink: 'https://www.wowhead.com/item=237551/sterilized-expulsion-boots' },
        { bossId: 1, name: 'Glaive de Rayo de Obliteración', type: 'Weapon', slot: 'Polearm', ilvlBase: 684, rarity: 'Epic', description: 'Glaive de rayo de obliteración.', wowheadLink: 'https://www.wowhead.com/item=237739/obliteration-beamglaive' },
        { bossId: 1, name: 'Martillo Plex Sobrecloqueable', type: 'Weapon', slot: 'One-Hand', ilvlBase: 684, rarity: 'Epic', description: 'Martillo plex overclocked.', wowheadLink: 'https://www.wowhead.com/item=237736/overclocked-plexhammer' },
        { bossId: 1, name: 'Martillo Plex de Fábrica', type: 'Weapon', slot: 'One-Hand', ilvlBase: 684, rarity: 'Epic', description: 'Martillo plex de fábrica.', wowheadLink: 'https://www.wowhead.com/item=237813/factory-issue-plexhammer' },
        { bossId: 1, name: 'Núcleo Arcano Erradicador', type: 'Trinket', slot: 'N/A', ilvlBase: 684, rarity: 'Epic', description: 'Núcleo arcano erradicador.', wowheadLink: 'https://www.wowhead.com/item=242394/eradicating-arcanocore' },
        { bossId: 1, name: 'Puerta Lógica: Alfa', type: 'Accessories', slot: 'Finger', ilvlBase: 684, rarity: 'Epic', description: 'Anillo de puerta lógica alpha.', wowheadLink: 'https://www.wowhead.com/item=237567/logic-gate-alpha' },
        { bossId: 1, name: 'Capacitor de Flujo Arcano', type: 'Trinket', slot: 'N/A', ilvlBase: 684, rarity: 'Epic', description: 'Capacitor de flujo arcano.', wowheadLink: 'https://www.wowhead.com/item=999001/arcane-flux-capacitor' },
        { bossId: 1, name: 'Casco del Centinela del Plexo', type: 'Plate Armor', slot: 'Head', ilvlBase: 684, rarity: 'Epic', description: 'Casco del centinela plexus.', wowheadLink: 'https://www.wowhead.com/item=237530/plexus-sentinel-helm' },
        { bossId: 1, name: 'Guantes de Descarga de Energía', type: 'Leather Armor', slot: 'Hands', ilvlBase: 684, rarity: 'Epic', description: 'Guantes de descarga de energía.', wowheadLink: 'https://www.wowhead.com/item=237531/energy-discharge-gloves' } 
    ],
    2: [ // Loom'ithar (ilvl base 684)
        { bossId: 2, name: 'Zancudos del Guarida Atados', type: 'Cloth Armor', slot: 'Feet', ilvlBase: 684, rarity: 'Epic', description: 'Botas de tela laced lair.', wowheadLink: 'https://www.wowhead.com/item=237524/laced-lair-steppers' },
        { bossId: 2, name: 'Hombreras de Cuero Deathbound', type: 'Leather Armor', slot: 'Shoulder', ilvlBase: 684, rarity: 'Epic', description: 'Hombros de cuero deathbound.', wowheadLink: 'https://www.wowhead.com/item=237552/deathbound-shoulderpads' },
        { bossId: 2, name: 'Vinculador Colosal de Vida', type: 'Mail Armor', slot: 'Waist', ilvlBase: 684, rarity: 'Epic', description: 'Cinturón de malla colosal.', wowheadLink: 'https://www.wowhead.com/item=237522/colossal-lifetether' },
        { bossId: 2, name: 'Grillos de Nutrientes Descartados', type: 'Plate Armor', slot: 'Wrist', ilvlBase: 684, rarity: 'Epic', description: 'Grilletes de nutrientes descartados.', wowheadLink: 'https://www.wowhead.com/item=237545/discarded-nutrient-shackles' },
        { bossId: 2, name: 'Arco de Hebras Perforantes', type: 'Weapon', slot: 'Bow', ilvlBase: 684, rarity: 'Epic', description: 'Arco de hebras perforantes.', wowheadLink: 'https://www.wowhead.com/item=237740/piercing-strandbow' },
        { bossId: 2, name: 'Empalmar de Genes Prodigioso', type: 'Weapon', slot: 'Off-Hand', ilvlBase: 684, rarity: 'Epic', description: 'Empalmador de genes prodigioso.', wowheadLink: 'https://www.wowhead.com/item=237729/prodigious-gene-splicer' },
        { bossId: 2, name: 'Escudo de la Bestia Tejedora', type: 'Weapon', slot: 'Off-Hand', ilvlBase: 684, rarity: 'Epic', description: 'Escudo de la bestia tejedora.', wowheadLink: 'https://www.wowhead.com/item=237812/ward-of-the-weaving-beast' },
        { bossId: 2, name: 'Antena astral', type: 'Trinket', slot: 'N/A', ilvlBase: 684, rarity: 'Epic', description: 'Antena astral.', wowheadLink: 'https://www.wowhead.com/item=242395/astral-antenna' },
        { bossId: 2, name: 'Seda viviente de Loom\'ithar', type: 'Trinket', slot: 'N/A', ilvlBase: 684, rarity: 'Epic', description: 'Seda viviente de Loom\'ithar.', wowheadLink: 'https://www.wowhead.com/item=242393/loomithars-living-silk' },
        { bossId: 2, name: 'Ofrenda de Seda Terrible', type: 'Tier Set', slot: 'Legs', ilvlBase: 684, rarity: 'Epic', description: 'Ofrenda de seda dreadful (piernas).', wowheadLink: 'https://www.wowhead.com/item=237593/dreadful-silken-offering' },
        { bossId: 2, name: 'Ofrenda de Seda Mística', type: 'Tier Set', slot: 'Legs', ilvlBase: 684, rarity: 'Epic', description: 'Ofrenda de seda mystic (piernas).', wowheadLink: 'https://www.wowhead.com/item=237594/mystic-silken-offering' },
        { bossId: 2, name: 'Ofrenda de Seda Venerada', type: 'Tier Set', slot: 'Legs', ilvlBase: 684, rarity: 'Epic', description: 'Ofrenda de seda venerated (piernas).', wowheadLink: 'https://www.wowhead.com/item=237595/venerated-silken-offering' },
        { bossId: 2, name: 'Ofrenda de Seda Zenith', type: 'Tier Set', slot: 'Legs', ilvlBase: 684, rarity: 'Epic', description: 'Ofrenda de seda zenith (piernas).', wowheadLink: 'https://www.wowhead.com/item=237596/zenith-silken-offering' },
        { bossId: 2, name: 'Patrón: Forro de Hilo Crepuscular', type: 'Pattern', slot: 'N/A', ilvlBase: 684, rarity: 'Rare', description: 'Patrón para forro de hilo crepuscular.', wowheadLink: 'https://www.wowhead.com/item=223117/pattern-duskthread-lining' },
        { bossId: 2, name: 'Seda de Loombeast', type: 'Material', slot: 'N/A', ilvlBase: 684, rarity: 'Rare', description: 'Seda de loombeast para crafting.', wowheadLink: 'https://www.wowhead.com/item=245510/loombeast-silk' },
        { bossId: 2, name: 'Velo Arcano de Seda', type: 'Cloth Armor', slot: 'Head', ilvlBase: 684, rarity: 'Epic', description: 'Velo arcano de seda.', wowheadLink: 'https://www.wowhead.com/item=999004/silken-arcane-veil' },
        { bossId: 2, name: 'Brazales de Hilo Tejidos', type: 'Leather Armor', slot: 'Wrist', ilvlBase: 684, rarity: 'Epic', description: 'Brazales de hilo tejidos.', wowheadLink: 'https://www.wowhead.com/item=999005/weavers-threaded-bracers' },
        { bossId: 2, name: 'Huso del Destino', type: 'Weapon', slot: 'Staff', ilvlBase: 684, rarity: 'Epic', description: 'Bastón del destino.', wowheadLink: 'https://www.wowhead.com/item=999006/spindle-of-fate' },
        { bossId: 2, name: 'Capa de la Bestia Tejedora', type: 'Cosmetic', slot: 'Back', ilvlBase: 684, rarity: 'Epic', description: 'Capa de la bestia tejedora.', wowheadLink: 'https://www.wowhead.com/item=237813/weaving-beast-cloak' },
        { bossId: 2, name: 'Hilo de Seda Arcana', type: 'Material', slot: 'N/A', ilvlBase: 684, rarity: 'Rare', description: 'Hilo de seda arcana para crafting.', wowheadLink: 'https://www.wowhead.com/item=245511/arcane-silk-thread' } 
    ],
    3: [ // Vinculador de Almas Naazindhri (ilvl base 684)
        { bossId: 3, name: 'Túnica de Reunión de Espíritus', type: 'Cloth Armor', slot: 'Chest', ilvlBase: 684, rarity: 'Epic', description: 'Túnica de reunión de espíritus.', wowheadLink: 'https://www.wowhead.com/item=237529/frock-of-spirits-reunion' },
        { bossId: 3, name: 'Ataduras de Esencia Perdida', type: 'Leather Armor', slot: 'Wrist', ilvlBase: 684, rarity: 'Epic', description: 'Ataduras de esencia perdida.', wowheadLink: 'https://www.wowhead.com/item=237544/bindings-of-lost-essence' },
        { bossId: 3, name: 'Garras de Huso de Muerte', type: 'Mail Armor', slot: 'Feet', ilvlBase: 684, rarity: 'Epic', description: 'Garras de huso de muerte.', wowheadLink: 'https://www.wowhead.com/item=237526/deathspindle-talons' },
        { bossId: 3, name: 'Grillos Etéreos Frescos', type: 'Plate Armor', slot: 'Waist', ilvlBase: 684, rarity: 'Epic', description: 'Grilletes etéreos frescos.', wowheadLink: 'https://www.wowhead.com/item=237564/fresh-ethereal-fetters' },
        { bossId: 3, name: 'Garras de Entrenamiento Desvinculadas', type: 'Weapon', slot: 'One-Hand', ilvlBase: 684, rarity: 'Epic', description: 'Garras de entrenamiento unbound.', wowheadLink: 'https://www.wowhead.com/item=237733/unbound-training-claws' },
        { bossId: 3, name: 'Espira de Vidrio Void', type: 'Weapon', slot: 'Two-Hand', ilvlBase: 684, rarity: 'Epic', description: 'Espira de vidrio void.', wowheadLink: 'https://www.wowhead.com/item=237726/voidglass-spire' },
        { bossId: 3, name: 'Agente de Unión Terrible', type: 'Tier Set', slot: 'Hands', ilvlBase: 684, rarity: 'Epic', description: 'Agente de unión dreadful (manos).', wowheadLink: 'https://www.wowhead.com/item=237585/dreadful-binding-agent' },
        { bossId: 3, name: 'Agente de Unión Místico', type: 'Tier Set', slot: 'Hands', ilvlBase: 684, rarity: 'Epic', description: 'Agente de unión mystic (manos).', wowheadLink: 'https://www.wowhead.com/item=237586/mystic-binding-agent' },
        { bossId: 3, name: 'Agente de Unión Venerado', type: 'Tier Set', slot: 'Hands', ilvlBase: 684, rarity: 'Epic', description: 'Agente de unión venerated (manos).', wowheadLink: 'https://www.wowhead.com/item=237587/venerated-binding-agent' },
        { bossId: 3, name: 'Agente de Unión Zenith', type: 'Tier Set', slot: 'Hands', ilvlBase: 684, rarity: 'Epic', description: 'Agente de unión zenith (manos).', wowheadLink: 'https://www.wowhead.com/item=237588/zenith-binding-agent' },
        { bossId: 3, name: 'Manto Nether del Vinculador', type: 'Cosmetic', slot: 'Back', ilvlBase: 684, rarity: 'Epic', description: 'Manto nether de soulbinder.', wowheadLink: 'https://www.wowhead.com/item=250104/soulbinders-nethermantle' },
        { bossId: 3, name: 'Guantes Tejidos con Esencia', type: 'Cloth Armor', slot: 'Hands', ilvlBase: 684, rarity: 'Epic', description: 'Guantes tejidos con esencia.', wowheadLink: 'https://www.wowhead.com/item=999007/essence-woven-gloves' },
        { bossId: 3, name: 'Cinturón de Hilo de Alma', type: 'Leather Armor', slot: 'Waist', ilvlBase: 684, rarity: 'Epic', description: 'Cinturón de hilo de alma.', wowheadLink: 'https://www.wowhead.com/item=999008/soulthread-belt' },
        { bossId: 3, name: 'Égida Atada al Vacío', type: 'Weapon', slot: 'Shield', ilvlBase: 684, rarity: 'Epic', description: 'Égida atada al vacío.', wowheadLink: 'https://www.wowhead.com/item=999009/netherbound-aegis' },
        { bossId: 3, name: 'Fragmento de Esencia de Alma', type: 'Currency', slot: 'N/A', ilvlBase: 684, rarity: 'Rare', description: 'Fragmento de esencia de alma.', wowheadLink: 'https://www.wowhead.com/item=999010/soul-essence-shard' },
        { bossId: 3, name: 'Crisálida de Almas Hendidas', type: 'Accessories', slot: 'Neck', ilvlBase: 684, rarity: 'Epic', description: 'Crisálida de almas sundered.', wowheadLink: 'https://www.wowhead.com/item=237565/chrysalis-of-sundered-souls' },
        { bossId: 3, name: 'Latigazo místico de Naazindhri', type: 'Trinket', slot: 'N/A', ilvlBase: 684, rarity: 'Epic', description: 'Latigazo místico de Naazindhri.', wowheadLink: 'https://www.wowhead.com/item=242396/naazindhris-mystic-lash' },
        { bossId: 3, name: 'Abrazo de vinculador de almas', type: 'Trinket', slot: 'N/A', ilvlBase: 684, rarity: 'Epic', description: 'Abrazo de vinculador de almas.', wowheadLink: 'https://www.wowhead.com/item=242397/soulbinders-embrace' } 
    ],
    4: [ // Tejedora de la Forja Araz (ilvl base 688)
        { bossId: 4, name: 'Frasco de Presagio Terrible', type: 'Tier Set', slot: 'Helm', ilvlBase: 688, rarity: 'Epic', description: 'Frasco de presagio dreadful (yelmo).', wowheadLink: 'https://www.wowhead.com/item=237589/dreadful-foreboding-beaker' },
        { bossId: 4, name: 'Frasco de Presagio Místico', type: 'Tier Set', slot: 'Helm', ilvlBase: 688, rarity: 'Epic', description: 'Frasco de presagio mystic (yelmo).', wowheadLink: 'https://www.wowhead.com/item=237590/mystic-foreboding-beaker' },
        { bossId: 4, name: 'Frasco de Presagio Venerado', type: 'Tier Set', slot: 'Helm', ilvlBase: 688, rarity: 'Epic', description: 'Frasco de presagio venerated (yelmo).', wowheadLink: 'https://www.wowhead.com/item=237591/venerated-foreboding-beaker' },
        { bossId: 4, name: 'Frasco de Presagio Zenith', type: 'Tier Set', slot: 'Helm', ilvlBase: 688, rarity: 'Epic', description: 'Frasco de presagio zenith (yelmo).', wowheadLink: 'https://www.wowhead.com/item=237592/zenith-foreboding-beaker' },
        { bossId: 4, name: 'Puerta Lógica: Omega', type: 'Accessories', slot: 'Finger', ilvlBase: 688, rarity: 'Epic', description: 'Anillo de puerta lógica omega.', wowheadLink: 'https://www.wowhead.com/item=237570/logic-gate-omega' },
        { bossId: 4, name: 'Forja Ritual de Araz', type: 'Trinket', slot: 'N/A', ilvlBase: 688, rarity: 'Epic', description: 'Forja ritual de Araz.', wowheadLink: 'https://www.wowhead.com/item=242402/arazs-ritual-forge' },
        { bossId: 4, name: 'Guanteletes del Maestro de Forja', type: 'Plate Armor', slot: 'Hands', ilvlBase: 688, rarity: 'Epic', description: 'Guanteletes del maestro de forja.', wowheadLink: 'https://www.wowhead.com/item=999011/forgemasters-gauntlets' },
        { bossId: 4, name: 'Hombreras Forjadas Arcanas', type: 'Mail Armor', slot: 'Shoulder', ilvlBase: 688, rarity: 'Epic', description: 'Hombreras forjadas arcanas.', wowheadLink: 'https://www.wowhead.com/item=999012/arcane-forged-pauldrons' },
        { bossId: 4, name: 'Bastón de Llama Ritual', type: 'Weapon', slot: 'Staff', ilvlBase: 688, rarity: 'Epic', description: 'Bastón de llama ritual.', wowheadLink: 'https://www.wowhead.com/item=999013/ritual-flame-staff' },
        { bossId: 4, name: 'Ascua de Forja', type: 'Material', slot: 'N/A', ilvlBase: 688, rarity: 'Rare', description: 'Ascua de forja para crafting.', wowheadLink: 'https://www.wowhead.com/item=999014/forge-ember' },
        { bossId: 4, name: 'Funda de Diario del Forgeweaver', type: 'Cloth Armor', slot: 'Waist', ilvlBase: 688, rarity: 'Epic', description: 'Funda de diario del forgeweaver.', wowheadLink: 'https://www.wowhead.com/item=237558/forgeweavers-journal-holster' },
        { bossId: 4, name: 'Zapatillas de Prueba de Laboratorio', type: 'Leather Armor', slot: 'Feet', ilvlBase: 688, rarity: 'Epic', description: 'Zapatillas de prueba de laboratorio.', wowheadLink: 'https://www.wowhead.com/item=237561/laboratory-test-slippers' },
        { bossId: 4, name: 'Uniforme de Asistente Cosechado', type: 'Mail Armor', slot: 'Chest', ilvlBase: 688, rarity: 'Epic', description: 'Uniforme de attendant harvest.', wowheadLink: 'https://www.wowhead.com/item=237527/harvested-attendants-uniform' },
        { bossId: 4, name: 'Guardias de Contención Breached', type: 'Plate Armor', slot: 'Hands', ilvlBase: 688, rarity: 'Epic', description: 'Guardias de contención breached.', wowheadLink: 'https://www.wowhead.com/item=237541/breached-containment-guards' },
        { bossId: 4, name: 'Sable Fotón Prime', type: 'Weapon', slot: 'Two-Hand Sword', ilvlBase: 688, rarity: 'Epic', description: 'Sable fotón prime.', wowheadLink: 'https://www.wowhead.com/item=237727/photon-sabre-prime' },
        { bossId: 4, name: 'Planes: Estilete Siphoning', type: 'Plans', slot: 'N/A', ilvlBase: 688, rarity: 'Rare', description: 'Planes para estilete siphoning.', wowheadLink: 'https://www.wowhead.com/item=223119/plans-siphoning-stiletto' } 
    ],
    5: [ // Los Cazadores de Almas (ilvl base 688)
        { bossId: 5, name: 'Marca de Maldición Yearning Terrible', type: 'Tier Set', slot: 'Shoulder', ilvlBase: 688, rarity: 'Epic', description: 'Marca de maldición yearning dreadful (hombros).', wowheadLink: 'https://www.wowhead.com/item=237597/dreadful-yearning-cursemark' },
        { bossId: 5, name: 'Marca de Maldición Yearning Mística', type: 'Tier Set', slot: 'Shoulder', ilvlBase: 688, rarity: 'Epic', description: 'Marca de maldición yearning mystic (hombros).', wowheadLink: 'https://www.wowhead.com/item=237598/mystic-yearning-cursemark' },
        { bossId: 5, name: 'Marca de Maldición Yearning Venerada', type: 'Tier Set', slot: 'Shoulder', ilvlBase: 688, rarity: 'Epic', description: 'Marca de maldición yearning venerated (hombros).', wowheadLink: 'https://www.wowhead.com/item=237599/venerated-yearning-cursemark' },
        { bossId: 5, name: 'Marca de Maldición Yearning Zenith', type: 'Tier Set', slot: 'Shoulder', ilvlBase: 688, rarity: 'Epic', description: 'Marca de maldición yearning zenith (hombros).', wowheadLink: 'https://www.wowhead.com/item=237600/zenith-yearning-cursemark' },
        { bossId: 5, name: 'Zancudos de Seda del Intruso', type: 'Cloth Armor', slot: 'Feet', ilvlBase: 688, rarity: 'Epic', description: 'Zancudos de seda interloper.', wowheadLink: 'https://www.wowhead.com/item=243305/interlopers-silken-striders' },
        { bossId: 5, name: 'Sandalias Reforzadas del Intruso', type: 'Leather Armor', slot: 'Feet', ilvlBase: 688, rarity: 'Epic', description: 'Sandalias reforzadas interloper.', wowheadLink: 'https://www.wowhead.com/item=243306/interlopers-reinforced-sandals' },
        { bossId: 5, name: 'Botas de Cadena del Intruso', type: 'Mail Armor', slot: 'Feet', ilvlBase: 688, rarity: 'Epic', description: 'Botas de cadena interloper.', wowheadLink: 'https://www.wowhead.com/item=243308/interlopers-chain-boots' },
        { bossId: 5, name: 'Sabalones Plated del Intruso', type: 'Plate Armor', slot: 'Feet', ilvlBase: 688, rarity: 'Epic', description: 'Sabalones plated interloper.', wowheadLink: 'https://www.wowhead.com/item=243307/interlopers-plated-sabatons' },
        { bossId: 5, name: 'Runa de Aumento Soulgorged', type: 'Consumable', slot: 'N/A', ilvlBase: 688, rarity: 'Rare', description: 'Runa de aumento soulgorged.', wowheadLink: 'https://www.wowhead.com/item=246492/soulgorged-augment-rune' },
        { bossId: 5, name: 'Capa de Trampa de Almas del Cazador', type: 'Cosmetic', slot: 'Back', ilvlBase: 688, rarity: 'Epic', description: 'Capa de trampa de almas.', wowheadLink: 'https://www.wowhead.com/item=999015/hunters-soultrap-cloak' },
        { bossId: 5, name: 'Ballesta del Cazador del Vacío', type: 'Weapon', slot: 'Crossbow', ilvlBase: 688, rarity: 'Epic', description: 'Ballesta de cazador del vacío.', wowheadLink: 'https://www.wowhead.com/item=999016/voidhunters-crossbow' },
        { bossId: 5, name: 'Núcleo de Esencia de Alma', type: 'Trinket', slot: 'N/A', ilvlBase: 688, rarity: 'Epic', description: 'Núcleo de esencia de alma.', wowheadLink: 'https://www.wowhead.com/item=999017/soul-essence-core' },
        { bossId: 5, name: 'Hoja del Cazador de Almas', type: 'Weapon', slot: 'One-Hand', ilvlBase: 688, rarity: 'Epic', description: 'Hoja del cazador de almas.', wowheadLink: 'https://www.wowhead.com/item=237734/soul-hunters-blade' },
        { bossId: 5, name: 'Sigilo de la caza cósmica', type: 'Trinket', slot: 'N/A', ilvlBase: 688, rarity: 'Epic', description: 'Sigilo de la caza cósmica.', wowheadLink: 'https://www.wowhead.com/item=242401/void-soul-trinket' },
        { bossId: 5, name: 'Marca de ira incesante', type: 'Trinket', slot: 'N/A', ilvlBase: 688, rarity: 'Epic', description: 'Marca de ira incesante.', wowheadLink: 'https://www.wowhead.com/item=999016/ceaseless-rage-mark' },
        { bossId: 5, name: 'Patrón: Broche de Oleada Adrenal', type: 'Pattern', slot: 'N/A', ilvlBase: 688, rarity: 'Rare', description: 'Patrón para broche de oleada adrenal.', wowheadLink: 'https://www.wowhead.com/item=223118/pattern-adrenal-surge-clasp' } 
    ],
    6: [ // Fractillus (ilvl base 688)
        { bossId: 6, name: 'Contaminante de Vidrio Void Terrible', type: 'Tier Set', slot: 'Chest', ilvlBase: 688, rarity: 'Epic', description: 'Contaminante de vidrio void dreadful (pecho).', wowheadLink: 'https://www.wowhead.com/item=237581/dreadful-voidglass-contaminant' },
        { bossId: 6, name: 'Contaminante de Vidrio Void Místico', type: 'Tier Set', slot: 'Chest', ilvlBase: 688, rarity: 'Epic', description: 'Contaminante de vidrio void mystic (pecho).', wowheadLink: 'https://www.wowhead.com/item=237582/mystic-voidglass-contaminant' },
        { bossId: 6, name: 'Contaminante de Vidrio Void Venerado', type: 'Tier Set', slot: 'Chest', ilvlBase: 688, rarity: 'Epic', description: 'Contaminante de vidrio void venerated (pecho).', wowheadLink: 'https://www.wowhead.com/item=237583/venerated-voidglass-contaminant' },
        { bossId: 6, name: 'Contaminante de Vidrio Void Zenith', type: 'Tier Set', slot: 'Chest', ilvlBase: 688, rarity: 'Epic', description: 'Contaminante de vidrio void zenith (pecho).', wowheadLink: 'https://www.wowhead.com/item=237584/zenith-voidglass-contaminant' },
        { bossId: 6, name: 'Kris de Vidrio Void', type: 'Weapon', slot: 'One-Hand', ilvlBase: 688, rarity: 'Epic', description: 'Kris de vidrio void.', wowheadLink: 'https://www.wowhead.com/item=237728/voidglass-kris' },
        { bossId: 6, name: 'Núcleo de Vacío diamantino', type: 'Trinket', slot: 'N/A', ilvlBase: 688, rarity: 'Epic', description: 'Núcleo de Vacío diamantino.', wowheadLink: 'https://www.wowhead.com/item=242392/diamantine-voidcore' },
        { bossId: 6, name: 'Grebas Cristalizadas', type: 'Plate Armor', slot: 'Legs', ilvlBase: 688, rarity: 'Epic', description: 'Grebas cristalizadas.', wowheadLink: 'https://www.wowhead.com/item=999018/crystalized-greaves' },
        { bossId: 6, name: 'Colgante de Vidrio Hecho Añicos', type: 'Accessories', slot: 'Neck', ilvlBase: 688, rarity: 'Epic', description: 'Colgante de vidrio shatter.', wowheadLink: 'https://www.wowhead.com/item=999019/shattered-glass-pendant' },
        { bossId: 6, name: 'Espada de Arena Fracturada', type: 'Weapon', slot: 'One-Hand', ilvlBase: 688, rarity: 'Epic', description: 'Espada de arena fracturada.', wowheadLink: 'https://www.wowhead.com/item=999020/fractured-sand-blade' },
        { bossId: 6, name: 'Polvo de Vidrio', type: 'Material', slot: 'N/A', ilvlBase: 688, rarity: 'Rare', description: 'Polvo de vidrio para crafting.', wowheadLink: 'https://www.wowhead.com/item=999021/glass-dust' },
        { bossId: 6, name: 'Casco de Cristal de Fractillus', type: 'Mail Armor', slot: 'Head', ilvlBase: 688, rarity: 'Epic', description: 'Casco de cristal de Fractillus.', wowheadLink: 'https://www.wowhead.com/item=237536/fractillus-crystal-helm' },
        { bossId: 6, name: 'Prisma abisal implacable', type: 'Trinket', slot: 'N/A', ilvlBase: 688, rarity: 'Epic', description: 'Prisma abisal implacable.', wowheadLink: 'https://www.wowhead.com/item=242398/relentless-abyss-prism' } 
    ],
    7: [ // Rey del Nexo Salhadaar (ilvl base 691)
        { bossId: 7, name: 'Hoja Soberana de Vidrio Void', type: 'Weapon', slot: 'One-Hand', ilvlBase: 691, rarity: 'Epic', description: 'Hoja soberana de vidrio void.', wowheadLink: 'https://www.wowhead.com/item=237735/voidglass-sovereigns-blade' },
        { bossId: 7, name: 'Fauces del Vacío', type: 'Weapon', slot: 'One-Hand', ilvlBase: 691, rarity: 'Epic', description: 'Fauces del void.', wowheadLink: 'https://www.wowhead.com/item=243365/maw-of-the-void' },
        { bossId: 7, name: 'Orden del rey-nexo', type: 'Trinket', slot: 'N/A', ilvlBase: 691, rarity: 'Epic', description: 'Orden del rey-nexo.', wowheadLink: 'https://www.wowhead.com/item=242400/nexus-kings-command' },
        { bossId: 7, name: 'Proyector pérfido', type: 'Trinket', slot: 'N/A', ilvlBase: 691, rarity: 'Epic', description: 'Proyector pérfido.', wowheadLink: 'https://www.wowhead.com/item=242403/perfidious-projector' },
        { bossId: 7, name: 'Collar de Maestría/Golpe Crítico Alto', type: 'Accessories', slot: 'Neck', ilvlBase: 691, rarity: 'Epic', description: 'Collar de maestría/crítico alto.', wowheadLink: 'https://www.wowhead.com/item=237569/high-mastery-critical-strike-necklace' },
        { bossId: 7, name: 'Astilla de Esencia Etérea', type: 'Currency', slot: 'N/A', ilvlBase: 691, rarity: 'Rare', description: 'Astilla de esencia etérea.', wowheadLink: 'https://www.wowhead.com/item=246727/ethereal-essence-sliver' },
        { bossId: 7, name: 'Corona del Nexo', type: 'Plate Armor', slot: 'Head', ilvlBase: 691, rarity: 'Epic', description: 'Corona del nexus.', wowheadLink: 'https://www.wowhead.com/item=999022/nexus-crown' },
        { bossId: 7, name: 'Manto del Soberano', type: 'Cloth Armor', slot: 'Shoulder', ilvlBase: 691, rarity: 'Epic', description: 'Manto del soberano.', wowheadLink: 'https://www.wowhead.com/item=999023/sovereigns-mantle' },
        { bossId: 7, name: 'Cetro Etéreo', type: 'Weapon', slot: 'One-Hand', ilvlBase: 691, rarity: 'Epic', description: 'Cetro etéreo.', wowheadLink: 'https://www.wowhead.com/item=999024/ethereal-scepter' },
        { bossId: 7, name: 'Capa del Rey del Nexo', type: 'Cosmetic', slot: 'Back', ilvlBase: 691, rarity: 'Epic', description: 'Capa del rey nexus.', wowheadLink: 'https://www.wowhead.com/item=250105/nexus-kings-cloak' },
        { bossId: 7, name: 'Montura Etérea', type: 'Mount', slot: 'N/A', ilvlBase: 691, rarity: 'Epic', description: 'Montura etérea.', wowheadLink: 'https://www.wowhead.com/item=246566/ethereal-mount' } 
    ],
    8: [ // Dimensius, el Devorador Total (ilvl base 691)
        { bossId: 8, name: 'Cinturón de Singularidad', type: 'Cloth Armor', slot: 'Waist', ilvlBase: 691, rarity: 'Epic', description: 'Cinturón de singularidad.', wowheadLink: 'https://www.wowhead.com/item=237559/singularity-cincture' },
        { bossId: 8, name: 'Pantalones de Navegación Estelar', type: 'Cloth Armor', slot: 'Legs', ilvlBase: 691, rarity: 'Epic', description: 'Pantalones de navegación estelar.', wowheadLink: 'https://www.wowhead.com/item=237542/stellar-navigation-slacks' },
        { bossId: 8, name: 'Muñequeras Comprimidas en Tiempo', type: 'Leather Armor', slot: 'Wrist', ilvlBase: 691, rarity: 'Epic', description: 'Muñequeras comprimidas en tiempo.', wowheadLink: 'https://www.wowhead.com/item=237562/time-compressed-wristguards' },
        { bossId: 8, name: 'Guantes Gamma Alados', type: 'Leather Armor', slot: 'Hands', ilvlBase: 691, rarity: 'Epic', description: 'Guantes gamma alados.', wowheadLink: 'https://www.wowhead.com/item=237540/winged-gamma-handlers' },
        { bossId: 8, name: 'Garras de Resistencia Fallida', type: 'Mail Armor', slot: 'Shoulder', ilvlBase: 691, rarity: 'Epic', description: 'Garras de resistencia fallida.', wowheadLink: 'https://www.wowhead.com/item=237537/claws-of-failed-resistance' },
        { bossId: 8, name: 'Grebas de Espacio Hecho Añicos', type: 'Mail Armor', slot: 'Feet', ilvlBase: 691, rarity: 'Epic', description: 'Grebas de espacio shatter.', wowheadLink: 'https://www.wowhead.com/item=237560/greaves-of-shattered-space' },
        { bossId: 8, name: 'Mirada Abisal de Artoshion', type: 'Plate Armor', slot: 'Head', ilvlBase: 691, rarity: 'Epic', description: 'Mirada abisal de Artoshion.', wowheadLink: 'https://www.wowhead.com/item=237535/artoshions-abyssal-stare' },
        { bossId: 8, name: 'Cinturón de Fisión Ultradensa', type: 'Plate Armor', slot: 'Waist', ilvlBase: 691, rarity: 'Epic', description: 'Cinturón de fisión ultradensa.', wowheadLink: 'https://www.wowhead.com/item=237563/ultradense-fission-girdle' },
        { bossId: 8, name: 'Anillo del Alma Hecha Añicos', type: 'Accessories', slot: 'Finger', ilvlBase: 691, rarity: 'Epic', description: 'Anillo del alma shatter.', wowheadLink: 'https://www.wowhead.com/item=242405/band-of-the-shattered-soul' },
        { bossId: 8, name: 'Garrote Ergospheric', type: 'Weapon', slot: 'One-Hand', ilvlBase: 691, rarity: 'Epic', description: 'Garrote ergospheric.', wowheadLink: 'https://www.wowhead.com/item=237731/ergospheric-cudgel' },
        { bossId: 8, name: 'Aplastador de Estrellas Supermassive', type: 'Weapon', slot: 'Two-Hand', ilvlBase: 691, rarity: 'Epic', description: 'Aplastador de estrellas supermassive.', wowheadLink: 'https://www.wowhead.com/item=237725/supermassive-starcrusher' },
        { bossId: 8, name: 'Núcleo del Devoratodo', type: 'Trinket', slot: 'N/A', ilvlBase: 691, rarity: 'Epic', description: 'Núcleo del Devoratodo.', wowheadLink: 'https://www.wowhead.com/item=242404/all-devouring-nucleus' },
        { bossId: 8, name: 'Alaridos de un cielo olvidado', type: 'Trinket', slot: 'N/A', ilvlBase: 691, rarity: 'Epic', description: 'Alaridos de un cielo olvidado.', wowheadLink: 'https://www.wowhead.com/item=242399/screams-of-a-forgotten-sky' },
        { bossId: 8, name: 'Curio de Vacío Hambriento', type: 'Tier Set Curio', slot: 'Any', ilvlBase: 691, rarity: 'Epic', description: 'Curio de void hambriento.', wowheadLink: 'https://www.wowhead.com/item=237602/hungering-void-curio' },
        { bossId: 8, name: 'Piedra de Hogar Cósmica', type: 'Toy', slot: 'N/A', ilvlBase: 691, rarity: 'Epic', description: 'Piedra de hogar cósmica.', wowheadLink: 'https://www.wowhead.com/item=246565/cosmic-hearthstone' },
        { bossId: 8, name: 'Fórmula: Encantamiento de Arma - Autoridad de las Profundidades', type: 'Formula', slot: 'N/A', ilvlBase: 691, rarity: 'Rare', description: 'Fórmula para encantamiento de arma.', wowheadLink: 'https://www.wowhead.com/item=223144/formula-enchant-weapon-authority-of-the-depths' },
        { bossId: 8, name: 'Manto del Vacío Abisal', type: 'Cosmetic', slot: 'Back', ilvlBase: 691, rarity: 'Epic', description: 'Manto del vacío abisal.', wowheadLink: 'https://www.wowhead.com/item=999026/abyssal-void-mantle' },
        { bossId: 8, name: 'Grebas Rompeestrellas', type: 'Plate Armor', slot: 'Legs', ilvlBase: 691, rarity: 'Epic', description: 'Grebas rompeestrellas.', wowheadLink: 'https://www.wowhead.com/item=999027/starshatter-greaves' },
        { bossId: 8, name: 'Daga de Grieta Cósmica', type: 'Weapon', slot: 'One-Hand', ilvlBase: 691, rarity: 'Epic', description: 'Daga de grieta cósmica.', wowheadLink: 'https://www.wowhead.com/item=999028/cosmic-rift-dagger' },
        { bossId: 8, name: 'Esencia del Vacío', type: 'Material', slot: 'N/A', ilvlBase: 691, rarity: 'Rare', description: 'Esencia del vacío para crafting.', wowheadLink: 'https://www.wowhead.com/item=999029/void-essence' },
        { bossId: 8, name: 'Montura Devoradora Total', type: 'Mount', slot: 'N/A', ilvlBase: 691, rarity: 'Epic', description: 'Montura devoradora total.', wowheadLink: 'https://www.wowhead.com/item=246567/all-devouring-mount' } 
    ]
};

// Array plano optimizado para selects y búsquedas
const lootItems = Object.values(lootByBoss).flat();

// Compatibilidad de armor actualizada
const armorCompatibility = {
    'Cloth Armor': ['Mago', 'Brujo', 'Sacerdote'],
    'Leather Armor': ['Druida', 'Pícaro', 'Monje', 'Cazador de Demonios'],
    'Mail Armor': ['Cazador', 'Chamán', 'Evocador'],
    'Plate Armor': ['Guerrero', 'Paladín', 'Caballero de la Muerte'],
    'Shield': ['Guerrero', 'Paladín', 'Chamán'],
    'One-Handed Sword': ['Guerrero', 'Paladín', 'Brujo', 'Sacerdote', 'Pícaro', 'Monje', 'Druida', 'Caballero de la Muerte'],
    'One-Handed Axe': ['Guerrero', 'Paladín', 'Chamán', 'Caballero de la Muerte'],
    'One-Handed Mace': ['Guerrero', 'Paladín', 'Chamán', 'Sacerdote', 'Monje', 'Druida', 'Caballero de la Muerte'],
    'Two-Handed Sword': ['Guerrero', 'Paladín', 'Pícaro', 'Monje', 'Druida', 'Caballero de la Muerte'],
    'Two-Handed Axe': ['Guerrero', 'Chamán', 'Caballero de la Muerte'],
    'Two-Handed Mace': ['Guerrero', 'Paladín', 'Chamán', 'Druida', 'Caballero de la Muerte'],
    'Polearm': ['Guerrero', 'Paladín', 'Cazador', 'Chamán', 'Monje', 'Druida', 'Caballero de la Muerte'],
    'Dagger': ['Guerrero', 'Paladín', 'Mago', 'Brujo', 'Sacerdote', 'Pícaro', 'Monje', 'Cazador', 'Druida', 'Caballero de la Muerte', 'Evocador'],
    'Staff': ['Mago', 'Brujo', 'Sacerdote', 'Monje', 'Druida', 'Evocador'],
    'Bow': ['Cazador'],
    'Crossbow': ['Cazador'],
    'Gun': ['Cazador'],
    'Wand': ['Mago', 'Brujo', 'Sacerdote'],
    'Fist Weapon': ['Pícaro', 'Monje', 'Cazador'],
    'Ranged': ['Cazador'],
    'Trinket': ['Todas'],
    'Accessories': ['Todas'],
    'Tier Set': ['Todas'],
    'Tier Set Curio': ['Todas'],
    'Cosmetic': ['Todas'],
    'Material': ['Todas'],
    'Pattern': ['Todas'],
    'Plans': ['Todas'],
    'Formula': ['Todas'],
    'Consumable': ['Todas'],
    'Currency': ['Todas'],
    'Toy': ['Todas'],
    'Mount': ['Todas']
};

// Compatibilidad específica de Trinkets por nombre
const trinketCompatibility = {
    'Núcleo Arcano erradicador': ['Paladín', 'Guerrero', 'Caballero de la Muerte'],
    'Antena astral': ['Todas'],
    'Seda viviente de Loom\'ithar': ['Todas'],
    'Latigazo místico de Naazindhri': ['Todas'],
    'Abrazo de vinculador de almas': ['Paladín', 'Guerrero', 'Druida', 'Caballero de la Muerte', 'Cazador', 'Pícaro', 'Chamán', 'Monje', 'Cazador de Demonios'],
    'Forja ritual de Araz': ['Todas'],
    'Sigilo de la caza cósmica': ['Todas'],
    'Marca de ira incesante': ['Todas'],
    'Núcleo de Vacío diamantino': ['Todas'],
    'Prisma abisal implacable': ['Todas'],
    'Orden del rey-nexo': ['Todas'],
    'Proyector pérfido': ['Todas'],
    'Núcleo del Devoratodo': ['Todas'],
    'Alaridos de un cielo olvidado': ['Todas']
};

// Compatibilidad detallada de Trinkets por especializaciones
// NOTA: Estos son los trinkets que tienen restricciones específicas por especialización
// Los trinkets restantes que aparecen en trinketCompatibility con ['Todas'] no tienen restricciones de especialización
const trinketSpecializationCompatibility = {
    'Abrazo de vinculador de almas': {
        'Paladín': ['Protección', 'Sagrado'],
        'Guerrero': ['Armas', 'Protección', 'Furia'],
        'Druida': ['Guardián', 'Restauración'],
        'Caballero de la Muerte': ['Sangre', 'Escarcha', 'Sin-Muerto'],
        'Cazador': ['Bestias', 'Puntería', 'Supervivencia'],
        'Pícaro': ['Asesinato', 'Subterfugio', 'Forajido'],
        'Chamán': ['Mejora'],
        'Monje': ['Maestro Cervecero', 'Viajero del viento'],
        'Cazador de Demonios': ['Venganza', 'Devastación']
    },
    'Latigazo místico de Naazindhri': {
        'Mago': ['Fuego', 'Escarcha', 'Arcano'],
        'Paladín': ['Sagrado'],
        'Druida': ['Restauración', 'Equilibrio'],
        'Sacerdote': ['Disciplina', 'Sagrado', 'Sombra'],
        'Chamán': ['Restauración', 'Elemental'],
        'Brujo': ['Afligión', 'Demonología', 'Destrucción'],
        'Monje': ['Tejedor de Niebla'],
        'Evocador': ['Devastación', 'Preservación', 'Aumento']
    },
    'Sigilo de la caza cósmica': {
        'Druida': ['Guardián', 'Feral'],
        'Cazador': ['Bestias', 'Puntería', 'Supervivencia'],
        'Pícaro': ['Asesinato', 'Subterfugio', 'Forajido'],
        'Chamán': ['Mejora'],
        'Monje': ['Maestro Cervecero', 'Viajero del viento'],
        'Cazador de Demonios': ['Venganza', 'Devastación']
    },
    'Marca de ira incesante': {
        'Druida': ['Guardián'],
        'Monje': ['Maestro Cervecero'],
        'Cazador de Demonios': ['Venganza'],
        'Paladín': ['Protección'],
        'Guerrero': ['Protección'],
        'Caballero de la Muerte': ['Sangre']
    },
    'Núcleo de Vacío diamantino': {
        'Mago': ['Fuego', 'Escarcha', 'Arcano'],
        'Sacerdote': ['Disciplina', 'Sagrado', 'Sombra'],
        'Druida': ['Restauración', 'Equilibrio'],
        'Brujo': ['Aflicción', 'Demonología', 'Destrucción'],
        'Chamán': ['Elemental', 'Restauración'],
        'Monje': ['Tejedor de Niebla'],
        'Paladín': ['Sagrado'],
        'Evocador': ['Devastación', 'Preservación', 'Aumento']
    },
    'Orden del rey-nexo': {
        'Evocador': ['Preservación'],
        'Monje': ['Tejedor de Niebla'],
        'Paladín': ['Sagrado'],
        'Chamán': ['Restauración'],
        'Sacerdote': ['Disciplina', 'Sagrado'],
        'Druida': ['Restauración']
    },
    ' Núcleo del Devoratodo': {
        'Druida': ['Guardián'],
        'Monje': ['Maestro Cervecero'],
        'Cazador de Demonios': ['Venganza'],
        'Paladín': ['Protección'],
        'Guerrero': ['Protección'],
        'Caballero de la Muerte': ['Sangre']
    }
    // TODO: Agregar más trinkets según datos de Wowhead:
    // - Forja ritual de Araz (ID: 242402)
    // - Alaridos de un cielo olvidado (ID: 242399)
    // - Antena astral (ID: 242395) - Confirmado: Para todas las clases
    // - Seda viviente de Loom'ithar (ID: 242393) - Confirmado: Para todas las clases
};

// Especializaciones por clase (World of Warcraft - Nombres Oficiales en Español)
const classSpecializations = {
    'Guerrero': ['Armas', 'Protección', 'Furia'],
    'Mago': ['Fuego', 'Escarcha', 'Arcano'],
    'Sacerdote': ['Disciplina', 'Sagrado', 'Sombra'],
    'Paladín': ['Protección', 'Retribución', 'Sagrado'],
    'Cazador': ['Bestias', 'Puntería', 'Supervivencia'],
    'Brujo': ['Aflicción', 'Demonología', 'Destrucción'],
    'Chamán': ['Elemental', 'Mejora', 'Restauración'],
    'Druida': ['Feral', 'Guardián', 'Restauración', 'Equilibrio'],
    'Pícaro': ['Asesinato', 'Sutileza', 'Forajido'],
    'Caballero de la Muerte': ['Sangre', 'Escarcha', 'Profano'],
    'Monje': ['Maestro Cervecero', 'Viajero del viento', 'Tejedor de Niebla'],
    'Cazador de Demonios': ['Venganza', 'Devastación'],
    'Evocador': ['Devastación', 'Preservación', 'Aumento']
};

// Índices de búsqueda para mejor rendimiento
const itemIndexByName = new Map();
lootItems.forEach(item => {
    itemIndexByName.set(item.name, item);
});

const bossIndexById = new Map();
bosses.forEach(boss => {
    bossIndexById.set(boss.id, boss);
});
