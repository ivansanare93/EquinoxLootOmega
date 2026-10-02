const FOREVER_CATALOG = Object.freeze({
    version: 1,
    roles: Object.freeze([
        Object.freeze({ id: 'tank', label: 'Tanque' }),
        Object.freeze({ id: 'healer', label: 'Sanador' }),
        Object.freeze({ id: 'dps', label: 'DPS' })
    ]),
    ranks: Object.freeze([
        Object.freeze({ id: 'eclipse', label: 'Eclipse' }),
        Object.freeze({ id: 'alba', label: 'Alba' }),
        Object.freeze({ id: 'centinela', label: 'Centinela' }),
        Object.freeze({ id: 'nova', label: 'Nova' }),
        Object.freeze({ id: 'naciente', label: 'Naciente' })
    ]),
    classes: Object.freeze([
        Object.freeze({
            id: 'druid',
            label: 'Druida',
            specializations: Object.freeze([
                Object.freeze({ id: 'balance', label: 'Equilibrio', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'feral', label: 'Feral', roles: Object.freeze(['dps', 'tank']) }),
                Object.freeze({ id: 'restoration', label: 'Restauraci\u00f3n', roles: Object.freeze(['healer']) })
            ])
        }),
        Object.freeze({
            id: 'hunter',
            label: 'Cazador',
            specializations: Object.freeze([
                Object.freeze({ id: 'beast-mastery', label: 'Bestias', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'marksmanship', label: 'Punter\u00eda', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'survival', label: 'Supervivencia', roles: Object.freeze(['dps']) })
            ])
        }),
        Object.freeze({
            id: 'mage',
            label: 'Mago',
            specializations: Object.freeze([
                Object.freeze({ id: 'arcane', label: 'Arcano', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'fire', label: 'Fuego', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'frost', label: 'Escarcha', roles: Object.freeze(['dps']) })
            ])
        }),
        Object.freeze({
            id: 'paladin',
            label: 'Palad\u00edn',
            specializations: Object.freeze([
                Object.freeze({ id: 'holy', label: 'Sagrado', roles: Object.freeze(['healer']) }),
                Object.freeze({ id: 'protection', label: 'Protecci\u00f3n', roles: Object.freeze(['tank']) }),
                Object.freeze({ id: 'retribution', label: 'Reprensi\u00f3n', roles: Object.freeze(['dps']) })
            ])
        }),
        Object.freeze({
            id: 'priest',
            label: 'Sacerdote',
            specializations: Object.freeze([
                Object.freeze({ id: 'discipline', label: 'Disciplina', roles: Object.freeze(['healer']) }),
                Object.freeze({ id: 'holy', label: 'Sagrado', roles: Object.freeze(['healer']) }),
                Object.freeze({ id: 'shadow', label: 'Sombra', roles: Object.freeze(['dps']) })
            ])
        }),
        Object.freeze({
            id: 'rogue',
            label: 'P\u00edcaro',
            specializations: Object.freeze([
                Object.freeze({ id: 'assassination', label: 'Asesinato', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'combat', label: 'Combate', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'subtlety', label: 'Sutileza', roles: Object.freeze(['dps']) })
            ])
        }),
        Object.freeze({
            id: 'shaman',
            label: 'Cham\u00e1n',
            specializations: Object.freeze([
                Object.freeze({ id: 'elemental', label: 'Elemental', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'enhancement', label: 'Mejora', roles: Object.freeze(['dps', 'tank']) }),
                Object.freeze({ id: 'restoration', label: 'Restauraci\u00f3n', roles: Object.freeze(['healer']) })
            ])
        }),
        Object.freeze({
            id: 'warlock',
            label: 'Brujo',
            specializations: Object.freeze([
                Object.freeze({ id: 'affliction', label: 'Aflicci\u00f3n', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'demonology', label: 'Demonolog\u00eda', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'destruction', label: 'Destrucci\u00f3n', roles: Object.freeze(['dps']) })
            ])
        }),
        Object.freeze({
            id: 'warrior',
            label: 'Guerrero',
            specializations: Object.freeze([
                Object.freeze({ id: 'arms', label: 'Armas', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'fury', label: 'Furia', roles: Object.freeze(['dps']) }),
                Object.freeze({ id: 'protection', label: 'Protecci\u00f3n', roles: Object.freeze(['tank']) })
            ])
        })
    ]),
    primaryProfessions: Object.freeze([
        Object.freeze({ id: 'alchemy', label: 'Alquimia' }),
        Object.freeze({ id: 'blacksmithing', label: 'Herrer\u00eda' }),
        Object.freeze({ id: 'enchanting', label: 'Encantamiento' }),
        Object.freeze({ id: 'engineering', label: 'Ingenier\u00eda' }),
        Object.freeze({ id: 'herbalism', label: 'Herborister\u00eda' }),
        Object.freeze({ id: 'leatherworking', label: 'Peleter\u00eda' }),
        Object.freeze({ id: 'mining', label: 'Miner\u00eda' }),
        Object.freeze({ id: 'skinning', label: 'Desuello' }),
        Object.freeze({ id: 'tailoring', label: 'Sastrer\u00eda' })
    ])
});

export { FOREVER_CATALOG };
