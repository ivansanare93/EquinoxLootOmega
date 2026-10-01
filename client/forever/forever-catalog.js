const FOREVER_CATALOG = Object.freeze({
    version: 1,
    roles: Object.freeze([
        Object.freeze({ id: 'tank', label: 'Tank' }),
        Object.freeze({ id: 'healer', label: 'Healer' }),
        Object.freeze({ id: 'dps', label: 'DPS' })
    ]),
    ranks: Object.freeze([
        Object.freeze({ id: 'eclipse', label: 'Eclipse' }),
        Object.freeze({ id: 'alba', label: 'Alba' }),
        Object.freeze({ id: 'centinela', label: 'Centinela' }),
        Object.freeze({ id: 'nova', label: 'Nova' }),
        Object.freeze({ id: 'naciente', label: 'Naciente' })
    ]),
    // The definitive Forever class, specialization, and profession data is not in this repository.
    classes: Object.freeze([]),
    specializations: Object.freeze([]),
    professions: Object.freeze([])
});

export { FOREVER_CATALOG };
