import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import {
    addDoc,
    collection,
    getFirestore,
    onSnapshot,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { FOREVER_CATALOG } from './forever-catalog.js';

const MAX_NAME_LENGTH = 24;
const MAX_ALTERS = 10;
const membersList = document.getElementById('forever-roster-members');
const loadingState = document.getElementById('forever-roster-loading');
const emptyState = document.getElementById('forever-roster-empty');
const errorState = document.getElementById('forever-roster-error');
const signupOpenButton = document.getElementById('forever-signup-open');
const signupForm = document.getElementById('forever-signup-form');
const signupProgress = document.getElementById('forever-signup-progress');
const signupMessage = document.getElementById('forever-signup-message');
const signupResult = document.getElementById('forever-signup-result');
const previousButton = document.getElementById('forever-signup-previous');
const nextButton = document.getElementById('forever-signup-next');
const submitButton = document.getElementById('forever-signup-submit');
const cancelButton = document.getElementById('forever-signup-cancel');
const addAlterButton = document.getElementById('forever-add-alter');
const altersContainer = document.getElementById('forever-alters');
const summary = document.getElementById('forever-signup-summary');
const mainName = document.getElementById('forever-main-name');
const mainClass = document.getElementById('forever-main-class');
const mainSpec = document.getElementById('forever-main-spec');
const mainRole = document.getElementById('forever-main-role');
const mainProfessions = document.getElementById('forever-main-professions');
const secondaryEnabled = document.getElementById('forever-secondary-enabled');
const secondaryFields = document.getElementById('forever-secondary-fields');
const secondarySpec = document.getElementById('forever-secondary-spec');
const secondaryRole = document.getElementById('forever-secondary-role');
const formSteps = Array.from(document.querySelectorAll('.forever-signup-form__step'));

let currentStep = 1;
let isSaving = false;

function showState(state) {
    loadingState.hidden = state !== 'loading';
    emptyState.hidden = state !== 'empty';
    errorState.hidden = state !== 'error';
    membersList.hidden = state !== 'members';
}

function labelFor(items, id) {
    const item = items.find((entry) => entry.id === id);
    return item ? item.label : id;
}

function classFor(classId) {
    return FOREVER_CATALOG.classes.find((entry) => entry.id === classId);
}

function specFor(classId, specId) {
    return classFor(classId)?.specializations.find((entry) => entry.id === specId);
}

function createOption(value, label, selected = false) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.selected = selected;
    return option;
}

function resetSelect(select, placeholder, disabled = false) {
    select.replaceChildren(createOption('', placeholder, true));
    select.disabled = disabled;
}

function populateClasses(select) {
    resetSelect(select, 'Selecciona una clase');
    FOREVER_CATALOG.classes.forEach((entry) => select.append(createOption(entry.id, entry.label)));
}

function populateSpecs(classId, select) {
    const characterClass = classFor(classId);
    resetSelect(select, 'Selecciona una especializaci\u00f3n', !characterClass);
    characterClass?.specializations.forEach((entry) => select.append(createOption(entry.id, entry.label)));
}

function populateRoles(classId, specId, select) {
    const specialization = specFor(classId, specId);
    resetSelect(select, 'Selecciona un rol', !specialization);
    specialization?.roles.forEach((roleId) => {
        select.append(createOption(roleId, labelFor(FOREVER_CATALOG.roles, roleId)));
    });
}

function createProfessionsPicker(idPrefix) {
    const picker = document.createElement('div');
    picker.className = 'forever-signup-form__checkboxes';
    picker.dataset.professions = 'true';

    FOREVER_CATALOG.primaryProfessions.forEach((profession) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = `${idPrefix}-profession`;
        input.value = profession.id;
        input.addEventListener('change', () => limitProfessionSelection(picker));
        label.append(input, document.createTextNode(profession.label));
        picker.append(label);
    });

    return picker;
}

function limitProfessionSelection(picker) {
    const selected = Array.from(picker.querySelectorAll('input:checked'));
    picker.querySelectorAll('input').forEach((input) => {
        input.disabled = selected.length >= 2 && !input.checked;
    });
}

function selectedProfessions(picker) {
    return Array.from(picker.querySelectorAll('input:checked')).map((input) => input.value);
}

function populateMainProfessions() {
    mainProfessions.replaceChildren(createProfessionsPicker('main'));
}

function showMessage(message, success = false) {
    signupMessage.textContent = message;
    signupMessage.classList.toggle('forever-signup-form__message--success', success);
    signupMessage.hidden = false;
}

function clearMessage() {
    signupMessage.hidden = true;
    signupMessage.textContent = '';
    signupMessage.classList.remove('forever-signup-form__message--success');
}

function clearResult() {
    signupResult.hidden = true;
    signupResult.textContent = '';
}

function updateStep() {
    formSteps.forEach((step) => {
        step.hidden = Number(step.dataset.step) !== currentStep;
    });
    previousButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === formSteps.length;
    submitButton.hidden = currentStep !== formSteps.length;
    signupProgress.textContent = `Paso ${currentStep} de ${formSteps.length}: ${['Personaje principal', 'Configuraci\u00f3n', 'Alters', 'Revisar'][currentStep - 1]}`;

    if (currentStep === formSteps.length) {
        renderSummary();
    }

    const focusTarget = formSteps[currentStep - 1].querySelector('input, select, button');
    focusTarget?.focus();
}

function handleMainClassChange() {
    populateSpecs(mainClass.value, mainSpec);
    populateRoles('', '', mainRole);
    populateSecondarySpecs();
}

function handleMainSpecChange() {
    populateRoles(mainClass.value, mainSpec.value, mainRole);
}

function populateSecondarySpecs() {
    populateSpecs(mainClass.value, secondarySpec);
    populateRoles('', '', secondaryRole);
}

function toggleSecondary() {
    secondaryFields.hidden = !secondaryEnabled.checked;
    if (secondaryEnabled.checked) {
        populateSecondarySpecs();
        secondarySpec.focus();
    } else {
        secondarySpec.value = '';
        populateRoles('', '', secondaryRole);
    }
}

function createTechnicalId() {
    return crypto.randomUUID();
}

function createAlterCard() {
    const alterId = createTechnicalId();
    const card = document.createElement('article');
    card.className = 'forever-signup-form__alter';
    card.dataset.alterId = alterId;

    const heading = document.createElement('div');
    heading.className = 'forever-signup-form__alter-heading';
    const title = document.createElement('h3');
    title.textContent = `Alter ${altersContainer.children.length + 1}`;
    const removeButton = document.createElement('button');
    removeButton.className = 'forever-roster__button forever-roster__button--secondary';
    removeButton.type = 'button';
    removeButton.textContent = 'Eliminar';
    removeButton.addEventListener('click', () => {
        card.remove();
        updateAlterControls();
    });
    heading.append(title, removeButton);

    const grid = document.createElement('div');
    grid.className = 'forever-signup-form__grid';
    const nameField = createTextField(`${alterId}-name`, 'Nombre del personaje');
    const classField = createSelectField(`${alterId}-class`, 'Clase');
    const specField = createSelectField(`${alterId}-spec`, 'Especializaci\u00f3n');
    const roleField = createSelectField(`${alterId}-role`, 'Rol');
    const classSelect = classField.querySelector('select');
    const specSelect = specField.querySelector('select');
    const roleSelect = roleField.querySelector('select');
    populateClasses(classSelect);
    resetSelect(specSelect, 'Selecciona una especializaci\u00f3n', true);
    resetSelect(roleSelect, 'Selecciona un rol', true);
    classSelect.addEventListener('change', () => {
        populateSpecs(classSelect.value, specSelect);
        populateRoles('', '', roleSelect);
    });
    specSelect.addEventListener('change', () => populateRoles(classSelect.value, specSelect.value, roleSelect));

    const professionsField = document.createElement('div');
    professionsField.className = 'forever-signup-form__field';
    const professionsLabel = document.createElement('span');
    professionsLabel.className = 'forever-signup-form__label';
    professionsLabel.textContent = 'Profesiones primarias';
    const professionsHint = document.createElement('p');
    professionsHint.className = 'forever-signup-form__hint';
    professionsHint.textContent = 'Opcionales. Hasta dos.';
    professionsField.append(professionsLabel, professionsHint, createProfessionsPicker(alterId));

    grid.append(nameField, classField, specField, roleField, professionsField);
    card.append(heading, grid);
    return card;
}

function createTextField(id, labelText) {
    const field = document.createElement('div');
    field.className = 'forever-signup-form__field';
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;
    const input = document.createElement('input');
    input.id = id;
    input.type = 'text';
    input.maxLength = MAX_NAME_LENGTH;
    input.autocomplete = 'off';
    field.append(label, input);
    return field;
}

function createSelectField(id, labelText) {
    const field = document.createElement('div');
    field.className = 'forever-signup-form__field';
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;
    const select = document.createElement('select');
    select.id = id;
    field.append(label, select);
    return field;
}

function updateAlterControls() {
    addAlterButton.disabled = altersContainer.children.length >= MAX_ALTERS;
    Array.from(altersContainer.children).forEach((card, index) => {
        card.querySelector('h3').textContent = `Alter ${index + 1}`;
    });
}

function readCharacter(classId, specId, role, name, professions, id) {
    const characterClass = classFor(classId);
    const specialization = specFor(classId, specId);
    const validName = typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= MAX_NAME_LENGTH;
    const validProfessions = professions.length <= 2
        && new Set(professions).size === professions.length
        && professions.every((profession) => FOREVER_CATALOG.primaryProfessions.some((entry) => entry.id === profession));
    const validSelection = Boolean(characterClass)
        && Boolean(specialization)
        && specialization.roles.includes(role);

    if (!validName || !validProfessions || !validSelection) {
        return null;
    }

    return {
        ...(id ? { id } : {}),
        characterName: name.trim(),
        classId,
        specId,
        role,
        primaryProfessions: professions
    };
}

function readMain() {
    const main = readCharacter(
        mainClass.value,
        mainSpec.value,
        mainRole.value,
        mainName.value,
        selectedProfessions(mainProfessions),
        null
    );
    if (!main) {
        return null;
    }

    const secondary = secondaryEnabled.checked
        ? readCharacter(mainClass.value, secondarySpec.value, secondaryRole.value, 'secondary', [], null)
        : null;
    if (secondaryEnabled.checked && !secondary) {
        return null;
    }

    return {
        characterName: main.characterName,
        classId: main.classId,
        primarySpecId: main.specId,
        primaryRole: main.role,
        secondary: secondary ? { specId: secondary.specId, role: secondary.role } : null,
        primaryProfessions: main.primaryProfessions
    };
}

function readAlters() {
    if (altersContainer.children.length > MAX_ALTERS) {
        return null;
    }
    const alters = [];
    for (const card of altersContainer.children) {
        const inputs = card.querySelectorAll('input, select');
        const alter = readCharacter(
            inputs[1].value,
            inputs[2].value,
            inputs[3].value,
            inputs[0].value,
            selectedProfessions(card.querySelector('[data-professions]')),
            card.dataset.alterId
        );
        if (!alter) {
            return null;
        }
        alters.push(alter);
    }
    return alters;
}

function readSignup() {
    const main = readMain();
    const alts = readAlters();
    return main && alts ? { main, alts } : null;
}

function validateCurrentStep() {
    if ((currentStep === 1 || currentStep === 2) && !readMain()) {
        showMessage(currentStep === 1
            ? 'Completa un personaje principal v\u00e1lido antes de continuar.'
            : 'Revisa la especializaci\u00f3n secundaria antes de continuar.');
        (currentStep === 1 ? mainName : secondarySpec).focus();
        return false;
    }
    if (currentStep === 3 && !readAlters()) {
        showMessage('Completa los datos de cada alter con una configuraci\u00f3n v\u00e1lida.');
        altersContainer.querySelector('input, select')?.focus();
        return false;
    }
    return true;
}

function renderSummary() {
    const signup = readSignup();
    summary.replaceChildren();
    if (!signup) {
        return;
    }
    const mainClassLabel = labelFor(FOREVER_CATALOG.classes, signup.main.classId);
    const mainSpecLabel = labelFor(classFor(signup.main.classId).specializations, signup.main.primarySpecId);
    const mainRoleLabel = labelFor(FOREVER_CATALOG.roles, signup.main.primaryRole);
    const mainLine = document.createElement('p');
    mainLine.textContent = `Principal: ${signup.main.characterName} - ${mainClassLabel} - ${mainSpecLabel} - ${mainRoleLabel}`;
    summary.append(mainLine);

    if (signup.main.secondary) {
        const specLabel = labelFor(classFor(signup.main.classId).specializations, signup.main.secondary.specId);
        const roleLabel = labelFor(FOREVER_CATALOG.roles, signup.main.secondary.role);
        const secondaryLine = document.createElement('p');
        secondaryLine.textContent = `Secundaria: ${specLabel} - ${roleLabel}`;
        summary.append(secondaryLine);
    }

    const professionsLine = document.createElement('p');
    const professions = signup.main.primaryProfessions.map((id) => labelFor(FOREVER_CATALOG.primaryProfessions, id));
    professionsLine.textContent = `Profesiones: ${professions.length ? professions.join(', ') : 'Ninguna'}`;
    summary.append(professionsLine);
    const altersLine = document.createElement('p');
    altersLine.textContent = `Alters: ${signup.alts.length || 'Ninguno'}`;
    summary.append(altersLine);
}

function resetSignup() {
    signupForm.reset();
    populateClasses(mainClass);
    resetSelect(mainSpec, 'Selecciona una especializaci\u00f3n', true);
    resetSelect(mainRole, 'Selecciona un rol', true);
    populateMainProfessions();
    secondaryFields.hidden = true;
    resetSelect(secondarySpec, 'Selecciona una especializaci\u00f3n', true);
    resetSelect(secondaryRole, 'Selecciona un rol', true);
    altersContainer.replaceChildren();
    updateAlterControls();
    currentStep = 1;
    isSaving = false;
    submitButton.disabled = false;
    submitButton.textContent = 'Confirmar inscripci\u00f3n';
    clearMessage();
    updateStep();
}

function openSignup() {
    resetSignup();
    clearResult();
    signupOpenButton.hidden = true;
    signupForm.hidden = false;
    mainName.focus();
}

function closeSignup() {
    if (isSaving) {
        return;
    }
    signupForm.hidden = true;
    signupOpenButton.hidden = false;
    clearMessage();
    signupOpenButton.focus();
}

function renderMembers(memberSnapshots) {
    membersList.replaceChildren();
    memberSnapshots
        .map((memberSnapshot) => memberSnapshot.data())
        .sort((a, b) => (a.main?.characterName || '').localeCompare(b.main?.characterName || '', 'es'))
        .forEach((member) => {
            const item = document.createElement('li');
            item.className = 'forever-roster__member';
            const name = document.createElement('div');
            name.className = 'forever-roster__member-name';
            name.textContent = member.main?.characterName || 'Personaje sin nombre';
            const meta = document.createElement('div');
            meta.className = 'forever-roster__member-meta';
            const rank = labelFor(FOREVER_CATALOG.ranks, member.rank || '');
            const role = labelFor(FOREVER_CATALOG.roles, member.main?.primaryRole || '');
            meta.textContent = [rank, member.main?.classId, member.main?.primarySpecId, role].filter(Boolean).join(' \u00b7 ');
            item.append(name, meta);
            membersList.append(item);
        });
}

async function loadRoster() {
    showState('loading');
    try {
        const { firebaseConfig } = await import('../firebase-config.js');
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const members = collection(db, 'gameVersions', 'forever', 'members');
        onSnapshot(members, (snapshot) => {
            if (snapshot.empty) {
                showState('empty');
                return;
            }
            renderMembers(snapshot.docs);
            showState('members');
        }, (error) => {
            console.error('Unable to load the Forever roster:', error);
            showState('error');
        });

        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (currentStep !== formSteps.length) {
                clearMessage();
                if (validateCurrentStep()) {
                    currentStep += 1;
                    updateStep();
                }
                return;
            }
            const signup = readSignup();
            if (!signup) {
                showMessage('Revisa los datos antes de confirmar la inscripci\u00f3n.');
                return;
            }
            if (isSaving) {
                return;
            }
            isSaving = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Guardando...';
            clearMessage();
            try {
                await addDoc(members, {
                    schemaVersion: 1,
                    rank: 'naciente',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    ownerUid: null,
                    main: signup.main,
                    alts: signup.alts
                });
                resetSignup();
                signupForm.hidden = true;
                signupOpenButton.hidden = false;
                signupResult.textContent = '\u2705 Bienvenido al roster de Equinox. Tu personaje ha sido registrado como Naciente.';
                signupResult.hidden = false;
                signupOpenButton.focus();
            } catch (error) {
                console.error('Unable to create Forever roster signup:', error);
                isSaving = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Confirmar inscripci\u00f3n';
                showMessage('No se ha podido registrar tu ficha. Revisa los datos e int\u00e9ntalo de nuevo.');
            }
        });
    } catch (error) {
        console.error('Unable to initialize the Forever roster:', error);
        showState('error');
        signupOpenButton.disabled = true;
    }
}

populateClasses(mainClass);
resetSelect(mainSpec, 'Selecciona una especializaci\u00f3n', true);
resetSelect(mainRole, 'Selecciona un rol', true);
populateMainProfessions();
resetSelect(secondarySpec, 'Selecciona una especializaci\u00f3n', true);
resetSelect(secondaryRole, 'Selecciona un rol', true);
mainClass.addEventListener('change', handleMainClassChange);
mainSpec.addEventListener('change', handleMainSpecChange);
secondaryEnabled.addEventListener('change', toggleSecondary);
secondarySpec.addEventListener('change', () => populateRoles(mainClass.value, secondarySpec.value, secondaryRole));
signupOpenButton.addEventListener('click', openSignup);
cancelButton.addEventListener('click', closeSignup);
previousButton.addEventListener('click', () => {
    clearMessage();
    currentStep -= 1;
    updateStep();
});
nextButton.addEventListener('click', () => {
    clearMessage();
    if (!validateCurrentStep()) {
        return;
    }
    currentStep += 1;
    updateStep();
});
addAlterButton.addEventListener('click', () => {
    if (altersContainer.children.length >= MAX_ALTERS) {
        return;
    }
    const alter = createAlterCard();
    altersContainer.append(alter);
    updateAlterControls();
    alter.querySelector('input').focus();
});
updateAlterControls();
loadRoster();
