import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { FOREVER_CATALOG } from './forever-catalog.js';

const ADMIN_UID = 'be0rjT0v6dPllWpjKNPcgqsxfTS2';
const MAX_NAME_LENGTH = 24;
const MAX_ALTERS = 10;
const FORM_MODES = Object.freeze({ PUBLIC_CREATE: 'public-create', ADMIN_CREATE: 'admin-create', ADMIN_EDIT: 'admin-edit' });
const STEP_TITLES = ['Personaje principal', 'Configuracion', 'Alters', 'Revisar'];

const membersList = document.getElementById('forever-roster-members');
const loadingState = document.getElementById('forever-roster-loading');
const emptyState = document.getElementById('forever-roster-empty');
const errorState = document.getElementById('forever-roster-error');
const signupOpenButton = document.getElementById('forever-signup-open');
const adminAddButton = document.getElementById('forever-admin-add');
const signupForm = document.getElementById('forever-signup-form');
const signupTitle = document.getElementById('forever-signup-title');
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
const rankField = document.getElementById('forever-admin-rank-field');
const rankSelect = document.getElementById('forever-member-rank');
const formSteps = Array.from(document.querySelectorAll('.forever-signup-form__step'));
const adminAccessButton = document.getElementById('forever-admin-access');
const adminStatus = document.getElementById('forever-admin-status');
const adminLogoutButton = document.getElementById('forever-admin-logout');
const adminLoginPanel = document.getElementById('forever-admin-login');
const adminLoginForm = document.getElementById('forever-admin-login-form');
const adminEmail = document.getElementById('forever-admin-email');
const adminPassword = document.getElementById('forever-admin-password');
const adminLoginMessage = document.getElementById('forever-admin-login-message');
const adminLoginCancel = document.getElementById('forever-admin-login-cancel');
const adminLoginSubmit = document.getElementById('forever-admin-login-submit');
const deleteConfirmation = document.getElementById('forever-delete-confirmation');
const deleteMemberName = document.getElementById('forever-delete-member-name');
const deleteMessage = document.getElementById('forever-delete-message');
const deleteCancelButton = document.getElementById('forever-delete-cancel');
const deleteConfirmButton = document.getElementById('forever-delete-confirm');

let db;
let auth;
let membersCollection;
let rosterMembers = [];
let isAdmin = false;
let currentStep = 1;
let formMode = FORM_MODES.PUBLIC_CREATE;
let editingMemberId = null;
let deletingMemberId = null;
let isSaving = false;
let isDeleting = false;

function showState(state) {
    loadingState.hidden = state !== 'loading';
    emptyState.hidden = state !== 'empty';
    errorState.hidden = state !== 'error';
    membersList.hidden = state !== 'members';
}

function labelFor(items, id) {
    return items.find((entry) => entry.id === id)?.label || id;
}

function classFor(classId) {
    return FOREVER_CATALOG.classes.find((entry) => entry.id === classId);
}

function specFor(classId, specId) {
    return classFor(classId)?.specializations.find((entry) => entry.id === specId);
}

function normalizeName(name) {
    return typeof name === 'string' ? name.trim().toLocaleLowerCase('es') : '';
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
    resetSelect(select, 'Selecciona una especializacion', !characterClass);
    characterClass?.specializations.forEach((entry) => select.append(createOption(entry.id, entry.label)));
}

function populateRoles(classId, specId, select) {
    const specialization = specFor(classId, specId);
    resetSelect(select, 'Selecciona un rol', !specialization);
    specialization?.roles.forEach((roleId) => select.append(createOption(roleId, labelFor(FOREVER_CATALOG.roles, roleId))));
}

function populateRanks() {
    resetSelect(rankSelect, 'Selecciona un rango');
    FOREVER_CATALOG.ranks.forEach((rank) => rankSelect.append(createOption(rank.id, rank.label)));
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

function selectedProfessions(picker) {
    return Array.from(picker.querySelectorAll('input:checked')).map((input) => input.value);
}

function setSelectedProfessions(picker, professions = []) {
    picker.querySelectorAll('input').forEach((input) => {
        input.checked = professions.includes(input.value);
    });
    limitProfessionSelection(picker);
}

function limitProfessionSelection(picker) {
    const selected = picker.querySelectorAll('input:checked');
    picker.querySelectorAll('input').forEach((input) => {
        input.disabled = selected.length >= 2 && !input.checked;
    });
}

function populateMainProfessions() {
    mainProfessions.replaceChildren(createProfessionsPicker('main'));
}

function showMessage(element, message, success = false) {
    element.textContent = message;
    element.classList.toggle('forever-signup-form__message--success', success);
    element.hidden = false;
}

function clearMessage(element) {
    element.hidden = true;
    element.textContent = '';
    element.classList.remove('forever-signup-form__message--success');
}

function updateAdminUi() {
    adminStatus.textContent = isAdmin ? 'Modo administracion' : 'Modo visitante';
    adminStatus.classList.toggle('forever-roster__admin-status--active', isAdmin);
    adminAccessButton.hidden = isAdmin;
    adminLogoutButton.hidden = !isAdmin;
    adminAddButton.hidden = !isAdmin;
    renderMembers();
}

function updateStep({ focus = true } = {}) {
    formSteps.forEach((step) => {
        step.hidden = Number(step.dataset.step) !== currentStep;
    });
    previousButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === formSteps.length;
    submitButton.hidden = currentStep !== formSteps.length;
    signupProgress.textContent = `Paso ${currentStep} de ${formSteps.length}: ${STEP_TITLES[currentStep - 1]}`;
    if (currentStep === formSteps.length) renderSummary();
    if (focus) formSteps[currentStep - 1].querySelector('input, select, button')?.focus();
}

function updateFormModeUi() {
    const adminMode = formMode !== FORM_MODES.PUBLIC_CREATE;
    rankField.hidden = !adminMode;
    signupTitle.textContent = formMode === FORM_MODES.ADMIN_EDIT
        ? 'Editar miembro de Equinox Forever'
        : formMode === FORM_MODES.ADMIN_CREATE ? 'Anadir miembro de Equinox Forever' : 'Forma parte de Equinox Forever';
    submitButton.textContent = formMode === FORM_MODES.ADMIN_EDIT ? 'Guardar cambios' : 'Confirmar inscripcion';
}

function handleMainClassChange() {
    populateSpecs(mainClass.value, mainSpec);
    populateRoles('', '', mainRole);
    populateSpecs(mainClass.value, secondarySpec);
    populateRoles('', '', secondaryRole);
}

function toggleSecondary() {
    secondaryFields.hidden = !secondaryEnabled.checked;
    if (secondaryEnabled.checked) {
        populateSpecs(mainClass.value, secondarySpec);
        populateRoles('', '', secondaryRole);
        secondarySpec.focus();
    } else {
        secondarySpec.value = '';
        populateRoles('', '', secondaryRole);
    }
}

function createTechnicalId() {
    return crypto.randomUUID();
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

function createAlterCard(alter = null) {
    const alterId = alter?.id || createTechnicalId();
    const card = document.createElement('article');
    card.className = 'forever-signup-form__alter';
    card.dataset.alterId = alterId;
    const heading = document.createElement('div');
    heading.className = 'forever-signup-form__alter-heading';
    const title = document.createElement('h3');
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
    const specField = createSelectField(`${alterId}-spec`, 'Especializacion');
    const roleField = createSelectField(`${alterId}-role`, 'Rol');
    const nameInput = nameField.querySelector('input');
    const classSelect = classField.querySelector('select');
    const specSelect = specField.querySelector('select');
    const roleSelect = roleField.querySelector('select');
    populateClasses(classSelect);
    resetSelect(specSelect, 'Selecciona una especializacion', true);
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
    const professionsPicker = createProfessionsPicker(alterId);
    professionsField.append(professionsLabel, professionsHint, professionsPicker);
    grid.append(nameField, classField, specField, roleField, professionsField);
    card.append(heading, grid);
    if (alter) {
        nameInput.value = alter.characterName || '';
        classSelect.value = alter.classId || '';
        populateSpecs(classSelect.value, specSelect);
        specSelect.value = alter.specId || '';
        populateRoles(classSelect.value, specSelect.value, roleSelect);
        roleSelect.value = alter.role || '';
        setSelectedProfessions(professionsPicker, alter.primaryProfessions);
    }
    return card;
}

function updateAlterControls() {
    addAlterButton.disabled = altersContainer.children.length >= MAX_ALTERS;
    Array.from(altersContainer.children).forEach((card, index) => {
        card.querySelector('h3').textContent = `Alter ${index + 1}`;
    });
}

function readCharacter(classId, specId, role, name, professions, id) {
    const specialization = specFor(classId, specId);
    const validName = typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= MAX_NAME_LENGTH;
    const validProfessions = professions.length <= 2 && new Set(professions).size === professions.length
        && professions.every((profession) => FOREVER_CATALOG.primaryProfessions.some((entry) => entry.id === profession));
    if (!classFor(classId) || !specialization || !specialization.roles.includes(role) || !validName || !validProfessions) return null;
    return { ...(id ? { id } : {}), characterName: name.trim(), classId, specId, role, primaryProfessions: professions };
}

function readMain() {
    const main = readCharacter(mainClass.value, mainSpec.value, mainRole.value, mainName.value, selectedProfessions(mainProfessions), null);
    if (!main) return null;
    const secondary = secondaryEnabled.checked
        ? readCharacter(mainClass.value, secondarySpec.value, secondaryRole.value, 'secondary', [], null)
        : null;
    if (secondaryEnabled.checked && !secondary) return null;
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
    if (altersContainer.children.length > MAX_ALTERS) return null;
    const alters = [];
    for (const card of altersContainer.children) {
        const controls = card.querySelectorAll('input, select');
        const alter = readCharacter(controls[1].value, controls[2].value, controls[3].value, controls[0].value,
            selectedProfessions(card.querySelector('[data-professions]')), card.dataset.alterId);
        if (!alter) return null;
        alters.push(alter);
    }
    return alters;
}

function readSignup() {
    const main = readMain();
    const alts = readAlters();
    return main && alts ? { main, alts } : null;
}

function hasDuplicateMainName(name) {
    const normalized = normalizeName(name);
    return rosterMembers.some((member) => member.id !== editingMemberId && normalizeName(member.main?.characterName) === normalized);
}

function validateCurrentStep() {
    if ((currentStep === 1 || currentStep === 2) && !readMain()) {
        showMessage(signupMessage, currentStep === 1 ? 'Completa un personaje principal valido antes de continuar.' : 'Revisa la especializacion secundaria antes de continuar.');
        (currentStep === 1 ? mainName : secondarySpec).focus();
        return false;
    }
    if (currentStep === 3 && !readAlters()) {
        showMessage(signupMessage, 'Completa los datos de cada alter con una configuracion valida.');
        altersContainer.querySelector('input, select')?.focus();
        return false;
    }
    return true;
}

function renderSummary() {
    const signup = readSignup();
    summary.replaceChildren();
    if (!signup) return;
    const mainLine = document.createElement('p');
    mainLine.textContent = `Principal: ${signup.main.characterName} - ${labelFor(FOREVER_CATALOG.classes, signup.main.classId)} - ${labelFor(classFor(signup.main.classId).specializations, signup.main.primarySpecId)} - ${labelFor(FOREVER_CATALOG.roles, signup.main.primaryRole)}`;
    summary.append(mainLine);
    if (signup.main.secondary) {
        const line = document.createElement('p');
        line.textContent = `Secundaria: ${labelFor(classFor(signup.main.classId).specializations, signup.main.secondary.specId)} - ${labelFor(FOREVER_CATALOG.roles, signup.main.secondary.role)}`;
        summary.append(line);
    }
    const professionsLine = document.createElement('p');
    const professions = signup.main.primaryProfessions.map((id) => labelFor(FOREVER_CATALOG.primaryProfessions, id));
    professionsLine.textContent = `Profesiones: ${professions.length ? professions.join(', ') : 'Ninguna'}`;
    summary.append(professionsLine);
    const altersLine = document.createElement('p');
    altersLine.textContent = `Alters: ${signup.alts.length || 'Ninguno'}`;
    summary.append(altersLine);
    const rankLine = document.createElement('p');
    rankLine.textContent = `Rango inicial: ${labelFor(FOREVER_CATALOG.ranks, formMode === FORM_MODES.PUBLIC_CREATE ? 'naciente' : rankSelect.value)}`;
    summary.append(rankLine);
}

function resetSignup(mode = FORM_MODES.PUBLIC_CREATE) {
    formMode = mode;
    editingMemberId = null;
    signupForm.reset();
    populateClasses(mainClass);
    resetSelect(mainSpec, 'Selecciona una especializacion', true);
    resetSelect(mainRole, 'Selecciona un rol', true);
    populateMainProfessions();
    secondaryFields.hidden = true;
    resetSelect(secondarySpec, 'Selecciona una especializacion', true);
    resetSelect(secondaryRole, 'Selecciona un rol', true);
    populateRanks();
    rankSelect.value = 'naciente';
    altersContainer.replaceChildren();
    currentStep = 1;
    isSaving = false;
    submitButton.disabled = false;
    updateAlterControls();
    clearMessage(signupMessage);
    updateFormModeUi();
    updateStep({ focus: false });
}

function openSignup(mode) {
    resetSignup(mode);
    clearMessage(signupResult);
    signupOpenButton.hidden = true;
    signupForm.hidden = false;
    mainName.focus();
}

function closeSignup() {
    if (isSaving) return;
    signupForm.hidden = true;
    signupOpenButton.hidden = false;
    clearMessage(signupMessage);
    if (formMode !== FORM_MODES.PUBLIC_CREATE) resetSignup();
    signupOpenButton.focus();
}

function loadMemberForEdit(member) {
    resetSignup(FORM_MODES.ADMIN_EDIT);
    editingMemberId = member.id;
    mainName.value = member.main.characterName || '';
    mainClass.value = member.main.classId || '';
    populateSpecs(mainClass.value, mainSpec);
    mainSpec.value = member.main.primarySpecId || '';
    populateRoles(mainClass.value, mainSpec.value, mainRole);
    mainRole.value = member.main.primaryRole || '';
    setSelectedProfessions(mainProfessions, member.main.primaryProfessions || []);
    if (member.main.secondary) {
        secondaryEnabled.checked = true;
        secondaryFields.hidden = false;
        populateSpecs(mainClass.value, secondarySpec);
        secondarySpec.value = member.main.secondary.specId || '';
        populateRoles(mainClass.value, secondarySpec.value, secondaryRole);
        secondaryRole.value = member.main.secondary.role || '';
    }
    rankSelect.value = member.rank;
    (member.alts || []).forEach((alter) => altersContainer.append(createAlterCard(alter)));
    updateAlterControls();
    updateFormModeUi();
    signupOpenButton.hidden = true;
    signupForm.hidden = false;
    mainName.focus();
}

function closeDeleteConfirmation() {
    if (isDeleting) return;
    deletingMemberId = null;
    deleteConfirmation.hidden = true;
    clearMessage(deleteMessage);
}

function requestDelete(member) {
    deletingMemberId = member.id;
    deleteMemberName.textContent = member.main?.characterName || 'este miembro';
    clearMessage(deleteMessage);
    deleteConfirmation.hidden = false;
    deleteConfirmButton.focus();
}

function renderMembers() {
    membersList.replaceChildren();
    rosterMembers
        .slice()
        .sort((a, b) => (a.main?.characterName || '').localeCompare(b.main?.characterName || '', 'es'))
        .forEach((member) => {
            const item = document.createElement('li');
            item.className = 'forever-roster__member';
            const name = document.createElement('div');
            name.className = 'forever-roster__member-name';
            name.textContent = member.main?.characterName || 'Personaje sin nombre';
            const meta = document.createElement('div');
            meta.className = 'forever-roster__member-meta';
            meta.textContent = [
                labelFor(FOREVER_CATALOG.ranks, member.rank || ''),
                labelFor(FOREVER_CATALOG.classes, member.main?.classId || ''),
                labelFor(classFor(member.main?.classId)?.specializations || [], member.main?.primarySpecId || ''),
                labelFor(FOREVER_CATALOG.roles, member.main?.primaryRole || '')
            ].filter(Boolean).join(' - ');
            item.append(name, meta);
            if (isAdmin) {
                const actions = document.createElement('div');
                actions.className = 'forever-roster__member-actions';
                const editButton = document.createElement('button');
                editButton.className = 'forever-roster__button forever-roster__button--secondary';
                editButton.type = 'button';
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => loadMemberForEdit(member));
                const deleteButton = document.createElement('button');
                deleteButton.className = 'forever-roster__button forever-roster__button--danger';
                deleteButton.type = 'button';
                deleteButton.textContent = 'Eliminar';
                deleteButton.addEventListener('click', () => requestDelete(member));
                actions.append(editButton, deleteButton);
                item.append(actions);
            }
            membersList.append(item);
        });
}

function showRosterSnapshot(snapshot) {
    rosterMembers = snapshot.docs.map((memberSnapshot) => ({ id: memberSnapshot.id, ...memberSnapshot.data() }));
    if (!rosterMembers.length) {
        showState('empty');
        return;
    }
    renderMembers();
    showState('members');
}

async function saveSignup() {
    if (formMode !== FORM_MODES.PUBLIC_CREATE && !isAdmin) {
        showMessage(signupMessage, 'Esta accion es exclusiva de la administracion.');
        return;
    }
    const signup = readSignup();
    if (!signup) {
        showMessage(signupMessage, 'Revisa los datos antes de guardar.');
        return;
    }
    if (hasDuplicateMainName(signup.main.characterName)) {
        showMessage(signupMessage, 'Ese personaje ya esta registrado en el roster.');
        return;
    }
    const rank = formMode === FORM_MODES.PUBLIC_CREATE ? 'naciente' : rankSelect.value;
    if (!FOREVER_CATALOG.ranks.some((entry) => entry.id === rank)) {
        showMessage(signupMessage, 'Selecciona un rango valido.');
        return;
    }
    if (isSaving || !membersCollection) return;
    isSaving = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    clearMessage(signupMessage);
    try {
        if (formMode === FORM_MODES.ADMIN_EDIT) {
            await updateDoc(doc(membersCollection, editingMemberId), {
                schemaVersion: 1,
                rank,
                updatedAt: serverTimestamp(),
                ownerUid: null,
                main: signup.main,
                alts: signup.alts
            });
        } else {
            await addDoc(membersCollection, {
                schemaVersion: 1,
                rank,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                ownerUid: null,
                main: signup.main,
                alts: signup.alts
            });
        }
        const wasEdit = formMode === FORM_MODES.ADMIN_EDIT;
        resetSignup();
        signupForm.hidden = true;
        signupOpenButton.hidden = false;
        showMessage(signupResult, wasEdit ? 'Cambios guardados correctamente.' : 'Bienvenido al roster de Equinox. Tu personaje ha sido registrado como Naciente.', true);
        signupOpenButton.focus();
    } catch (error) {
        console.error('Unable to save Forever roster member:', error);
        isSaving = false;
        submitButton.disabled = false;
        updateFormModeUi();
        showMessage(signupMessage, 'No se ha podido guardar la ficha. Revisa los datos e intentalo de nuevo.');
    }
}

async function confirmDelete() {
    if (!isAdmin || !deletingMemberId || isDeleting || !membersCollection) return;
    isDeleting = true;
    deleteConfirmButton.disabled = true;
    deleteConfirmButton.textContent = 'Eliminando...';
    clearMessage(deleteMessage);
    try {
        await deleteDoc(doc(membersCollection, deletingMemberId));
        isDeleting = false;
        deleteConfirmButton.disabled = false;
        deleteConfirmButton.textContent = 'Confirmar eliminacion';
        closeDeleteConfirmation();
    } catch (error) {
        console.error('Unable to delete Forever roster member:', error);
        isDeleting = false;
        deleteConfirmButton.disabled = false;
        deleteConfirmButton.textContent = 'Confirmar eliminacion';
        showMessage(deleteMessage, 'No se ha podido eliminar el miembro. Intentalo de nuevo.');
    }
}

function openAdminLogin() {
    clearMessage(adminLoginMessage);
    adminLoginPanel.hidden = false;
    adminEmail.focus();
}

function closeAdminLogin() {
    adminLoginPanel.hidden = true;
    adminLoginForm.reset();
    clearMessage(adminLoginMessage);
    adminAccessButton.focus();
}

async function initializeFirebase() {
    showState('loading');
    try {
        const { firebaseConfig } = await import('../firebase-config.js');
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        membersCollection = collection(db, 'gameVersions', 'forever', 'members');
        onSnapshot(membersCollection, showRosterSnapshot, (error) => {
            console.error('Unable to load the Forever roster:', error);
            showState('error');
        });
        onAuthStateChanged(auth, (user) => {
            const wasAdmin = isAdmin;
            isAdmin = Boolean(user && user.uid === ADMIN_UID);
            updateAdminUi();
            if (user && !isAdmin) showMessage(adminLoginMessage, 'Esta cuenta no tiene permisos administrativos.');
            if (wasAdmin && !isAdmin) {
                closeDeleteConfirmation();
                if (formMode !== FORM_MODES.PUBLIC_CREATE) closeSignup();
            }
        });
    } catch (error) {
        console.error('Unable to initialize the Forever roster:', error);
        showState('error');
        signupOpenButton.disabled = true;
        adminAccessButton.disabled = true;
    }
}

populateClasses(mainClass);
resetSelect(mainSpec, 'Selecciona una especializacion', true);
resetSelect(mainRole, 'Selecciona un rol', true);
populateMainProfessions();
resetSelect(secondarySpec, 'Selecciona una especializacion', true);
resetSelect(secondaryRole, 'Selecciona un rol', true);
populateRanks();
mainClass.addEventListener('change', handleMainClassChange);
mainSpec.addEventListener('change', () => populateRoles(mainClass.value, mainSpec.value, mainRole));
secondaryEnabled.addEventListener('change', toggleSecondary);
secondarySpec.addEventListener('change', () => populateRoles(mainClass.value, secondarySpec.value, secondaryRole));
signupOpenButton.addEventListener('click', () => openSignup(FORM_MODES.PUBLIC_CREATE));
adminAddButton.addEventListener('click', () => openSignup(FORM_MODES.ADMIN_CREATE));
cancelButton.addEventListener('click', closeSignup);
previousButton.addEventListener('click', () => {
    clearMessage(signupMessage);
    currentStep -= 1;
    updateStep();
});
nextButton.addEventListener('click', () => {
    clearMessage(signupMessage);
    if (!validateCurrentStep()) return;
    currentStep += 1;
    updateStep();
});
addAlterButton.addEventListener('click', () => {
    if (altersContainer.children.length >= MAX_ALTERS) return;
    const alter = createAlterCard();
    altersContainer.append(alter);
    updateAlterControls();
    alter.querySelector('input').focus();
});
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (currentStep !== formSteps.length) {
        clearMessage(signupMessage);
        if (validateCurrentStep()) {
            currentStep += 1;
            updateStep();
        }
        return;
    }
    await saveSignup();
});
adminAccessButton.addEventListener('click', openAdminLogin);
adminLoginCancel.addEventListener('click', closeAdminLogin);
adminLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!auth) return;
    adminLoginSubmit.disabled = true;
    adminLoginSubmit.textContent = 'Entrando...';
    clearMessage(adminLoginMessage);
    try {
        const credential = await signInWithEmailAndPassword(auth, adminEmail.value.trim(), adminPassword.value);
        if (credential.user.uid !== ADMIN_UID) {
            await signOut(auth);
            showMessage(adminLoginMessage, 'Esta cuenta no tiene permisos administrativos.');
            return;
        }
        adminLoginPanel.hidden = true;
        adminLoginForm.reset();
    } catch (error) {
        console.error('Unable to sign in to Forever administration:', error);
        showMessage(adminLoginMessage, 'No se ha podido iniciar sesion. Revisa tus credenciales.');
    } finally {
        adminLoginSubmit.disabled = false;
        adminLoginSubmit.textContent = 'Entrar';
    }
});
adminLogoutButton.addEventListener('click', async () => {
    if (auth) await signOut(auth);
});
deleteCancelButton.addEventListener('click', closeDeleteConfirmation);
deleteConfirmButton.addEventListener('click', confirmDelete);
updateAlterControls();
updateAdminUi();
initializeFirebase();
