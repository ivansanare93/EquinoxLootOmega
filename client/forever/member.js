import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { doc, getDoc, getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { FOREVER_CATALOG } from './forever-catalog.js';

const memberStatus = document.getElementById('forever-member-status');
const memberProfile = document.getElementById('forever-member-profile');
const memberId = new URLSearchParams(window.location.search).get('id');

function labelFor(items, id, fallback) {
    return items.find((entry) => entry.id === id)?.label || fallback;
}

function classFor(classId) {
    return FOREVER_CATALOG.classes.find((entry) => entry.id === classId);
}

function specLabel(classId, specId) {
    return labelFor(classFor(classId)?.specializations || [], specId, 'Especializaci\u00f3n desconocida');
}

function isValidMemberId(id) {
    return typeof id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(id);
}

function createText(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
}

function createDetail(label, value) {
    const detail = document.createElement('div');
    detail.className = 'forever-member__detail';
    detail.append(
        createText('dt', 'forever-member__detail-label', label),
        createText('dd', 'forever-member__detail-value', value)
    );
    return detail;
}

function professionLabels(professions) {
    if (!Array.isArray(professions) || !professions.length) return [];
    return professions.map((profession) => labelFor(
        FOREVER_CATALOG.primaryProfessions,
        profession,
        'Profesi\u00f3n desconocida'
    ));
}

function applyClassAccent(element, classId) {
    if (classFor(classId)) element.classList.add(`forever-member__profile--${classId}`);
}

function renderMain(main) {
    const mainSection = document.createElement('section');
    mainSection.className = 'forever-member__section';
    mainSection.append(createText('h2', 'forever-member__section-title', 'Personaje principal'));

    const details = document.createElement('dl');
    details.className = 'forever-member__details';
    details.append(
        createDetail('Clase', labelFor(FOREVER_CATALOG.classes, main?.classId, 'Clase desconocida')),
        createDetail('Especializaci\u00f3n principal', specLabel(main?.classId, main?.primarySpecId)),
        createDetail('Rol principal', labelFor(FOREVER_CATALOG.roles, main?.primaryRole, 'Rol desconocido'))
    );
    if (main?.secondary) {
        details.append(
            createDetail('Especializaci\u00f3n secundaria', specLabel(main.classId, main.secondary.specId)),
            createDetail('Rol secundario', labelFor(FOREVER_CATALOG.roles, main.secondary.role, 'Rol desconocido'))
        );
    } else {
        details.append(createDetail('Especializaci\u00f3n secundaria', 'Sin especializaci\u00f3n secundaria'));
    }
    mainSection.append(details);
    return mainSection;
}

function renderProfessions(professions) {
    const section = document.createElement('section');
    section.className = 'forever-member__section';
    section.append(createText('h2', 'forever-member__section-title', 'Profesiones'));
    const labels = professionLabels(professions);
    section.append(createText(
        'p',
        'forever-member__empty-detail',
        labels.length ? labels.join(' - ') : 'Sin profesiones registradas'
    ));
    return section;
}

function renderAlter(alter) {
    const card = document.createElement('article');
    card.className = 'forever-member__alter';
    const characterClass = classFor(alter?.classId);
    if (characterClass) card.classList.add(`forever-member__alter--${characterClass.id}`);
    card.append(
        createText('h3', 'forever-member__alter-name', alter?.characterName || 'Alter sin nombre'),
        createText(
            'p',
            'forever-member__alter-class-spec',
            `${labelFor(FOREVER_CATALOG.classes, alter?.classId, 'Clase desconocida')} - ${specLabel(alter?.classId, alter?.specId)}`
        ),
        createText('p', 'forever-member__alter-role', `Rol: ${labelFor(FOREVER_CATALOG.roles, alter?.role, 'Rol desconocido')}`)
    );
    const professions = professionLabels(alter?.primaryProfessions);
    card.append(createText(
        'p',
        'forever-member__alter-professions',
        professions.length ? professions.join(' - ') : 'Sin profesiones registradas'
    ));
    return card;
}

function renderAlters(alters) {
    const section = document.createElement('section');
    section.className = 'forever-member__section';
    section.append(createText('h2', 'forever-member__section-title', 'Alters'));
    if (!Array.isArray(alters) || !alters.length) {
        section.append(createText('p', 'forever-member__empty-detail', 'Este miembro no tiene alters registrados.'));
        return section;
    }
    const grid = document.createElement('div');
    grid.className = 'forever-member__alters';
    alters.forEach((alter) => grid.append(renderAlter(alter)));
    section.append(grid);
    return section;
}

function renderProfile(member) {
    const main = member.main || {};
    applyClassAccent(memberProfile, main.classId);
    const header = document.createElement('header');
    header.className = 'forever-member__header';
    const heading = document.createElement('div');
    heading.append(
        createText('h1', 'forever-member__name', main.characterName || 'Personaje sin nombre'),
        createText(
            'p',
            'forever-member__class-spec',
            `${labelFor(FOREVER_CATALOG.classes, main.classId, 'Clase desconocida')} - ${specLabel(main.classId, main.primarySpecId)} - ${labelFor(FOREVER_CATALOG.roles, main.primaryRole, 'Rol desconocido')}`
        )
    );
    header.append(
        heading,
        createText('span', 'forever-member__rank', labelFor(FOREVER_CATALOG.ranks, member.rank, 'Rango desconocido'))
    );

    memberProfile.replaceChildren(header, renderMain(main), renderProfessions(main.primaryProfessions), renderAlters(member.alts));
    memberProfile.hidden = false;
    memberStatus.hidden = true;
}

function showStatus(message) {
    memberProfile.hidden = true;
    memberStatus.textContent = message;
    memberStatus.hidden = false;
}

async function loadMember() {
    if (!isValidMemberId(memberId)) {
        showStatus('No se ha indicado un miembro v\u00e1lido.');
        return;
    }

    try {
        const { firebaseConfig } = await import('../firebase-config.js');
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const memberRef = doc(db, 'gameVersions', 'forever', 'members', memberId);
        const memberSnapshot = await getDoc(memberRef);
        if (!memberSnapshot.exists()) {
            showStatus('Este miembro no existe o ya no forma parte del roster.');
            return;
        }
        renderProfile(memberSnapshot.data());
    } catch (error) {
        console.error('Unable to load the Forever member profile:', error);
        showStatus('No se ha podido cargar el perfil.');
    }
}

loadMember();
