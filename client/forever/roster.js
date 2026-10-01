import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { collection, getDocs, getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { FOREVER_CATALOG } from './forever-catalog.js';

const membersList = document.getElementById('forever-roster-members');
const loadingState = document.getElementById('forever-roster-loading');
const emptyState = document.getElementById('forever-roster-empty');
const errorState = document.getElementById('forever-roster-error');

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
            meta.textContent = [rank, member.main?.classId, member.main?.primarySpecId, role]
                .filter(Boolean)
                .join(' · ');

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
        const snapshot = await getDocs(collection(db, 'gameVersions', 'forever', 'members'));

        if (snapshot.empty) {
            showState('empty');
            return;
        }

        renderMembers(snapshot.docs);
        showState('members');
    } catch (error) {
        console.error('Unable to load the Forever roster:', error);
        showState('error');
    }
}

loadRoster();
