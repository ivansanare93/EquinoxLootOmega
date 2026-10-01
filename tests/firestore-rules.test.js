const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} = require('@firebase/rules-unit-testing');
const {
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  collection,
  setDoc,
  updateDoc
} = require('firebase/firestore');

const ADMIN_UID = 'be0rjT0v6dPllWpjKNPcgqsxfTS2';
const PROJECT_ID = 'equinox-firestore-rules-test';
const rules = fs.readFileSync(path.join(__dirname, '..', 'firestore.rules'), 'utf8');

let testEnv;

function publicDb() {
  return testEnv.unauthenticatedContext().firestore();
}

function adminDb() {
  return testEnv.authenticatedContext(ADMIN_UID).firestore();
}

function validSignup(overrides = {}) {
  return {
    name: 'Aeloria',
    class: 'Mago',
    specialization: 'Arcano',
    roles: ['DPS'],
    notes: '',
    rosterStatus: 'activo',
    timestamp: '2026-10-01T12:00:00.000Z',
    ...overrides
  };
}

async function seed(pathSegments, data) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), ...pathSegments), data);
  });
}

test.before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules }
  });
});

test.afterEach(async () => {
  await testEnv.clearFirestore();
});

test.after(async () => {
  await testEnv.cleanup();
});

test('public can read roster entries and create a valid signup', async () => {
  await seed(['rosterSignupsEntries', 'existing'], validSignup());
  await assertSucceeds(getDoc(doc(publicDb(), 'rosterSignupsEntries', 'existing')));
  await assertSucceeds(getDocs(collection(publicDb(), 'rosterSignupsEntries')));
  await assertSucceeds(setDoc(doc(publicDb(), 'rosterSignupsEntries', 'new'), validSignup()));
});

test('public roster creation rejects extra fields and administrative status', async () => {
  await assertFails(setDoc(doc(publicDb(), 'rosterSignupsEntries', 'extra'), validSignup({ unexpected: true })));
  await assertFails(setDoc(doc(publicDb(), 'rosterSignupsEntries', 'status'), validSignup({ rosterStatus: 'inactivo' })));
});

test('public cannot update or delete roster entries', async () => {
  await seed(['rosterSignupsEntries', 'existing'], validSignup());
  await assertFails(updateDoc(doc(publicDb(), 'rosterSignupsEntries', 'existing'), { notes: 'Cambio' }));
  await assertFails(deleteDoc(doc(publicDb(), 'rosterSignupsEntries', 'existing')));
});

test('public cannot access private Firestore data', async () => {
  await seed(['appData', 'characters'], { data: [] });
  await seed(['appData', 'assignments'], { data: [] });
  await seed(['rosterSignups', 'expansion'], { signups: [] });
  await seed(['equinoxSeasons', 'season'], { name: 'S1' });
  await seed(['equinoxRaids', 'raid'], { name: 'Raid' });
  await assertFails(getDoc(doc(publicDb(), 'appData', 'characters')));
  await assertFails(setDoc(doc(publicDb(), 'appData', 'assignments'), { data: [] }));
  await assertFails(getDoc(doc(publicDb(), 'rosterSignups', 'expansion')));
  await assertFails(getDoc(doc(publicDb(), 'equinoxSeasons', 'season')));
  await assertFails(getDoc(doc(publicDb(), 'equinoxRaids', 'raid')));
});

test('public can read, create, and update Mythic+ but cannot delete it', async () => {
  const mythicRef = doc(publicDb(), 'mythicPlusGroups', 'current');
  await assertSucceeds(setDoc(mythicRef, { players: [], groups: [] }));
  await assertSucceeds(getDoc(mythicRef));
  await assertSucceeds(updateDoc(mythicRef, { nextPlayerId: 1 }));
  await assertFails(deleteDoc(mythicRef));
});

test('admin can manage Loot Manager, roster, migration, seasons, raids, and Mythic+', async () => {
  const db = adminDb();
  await assertSucceeds(setDoc(doc(db, 'appData', 'characters'), { data: [] }));
  await assertSucceeds(setDoc(doc(db, 'appData', 'assignments'), { data: [] }));
  await assertSucceeds(getDoc(doc(db, 'appData', 'characters')));

  const rosterRef = doc(db, 'rosterSignupsEntries', 'admin-entry');
  await assertSucceeds(setDoc(rosterRef, validSignup({ rosterStatus: 'inactivo' })));
  await assertSucceeds(updateDoc(rosterRef, { notes: 'Gestionado' }));
  await assertSucceeds(deleteDoc(rosterRef));

  await assertSucceeds(setDoc(doc(db, 'rosterSignupsMeta', 'migration'), { completed: true }));
  await assertSucceeds(getDoc(doc(db, 'rosterSignupsMeta', 'migration')));
  await seed(['rosterSignups', 'expansion'], { signups: [] });
  await assertSucceeds(getDoc(doc(db, 'rosterSignups', 'expansion')));
  await assertFails(setDoc(doc(db, 'rosterSignups', 'expansion'), { signups: [] }));
  await assertSucceeds(setDoc(doc(db, 'equinoxSeasons', 'season'), { name: 'S1' }));
  await assertSucceeds(getDoc(doc(db, 'equinoxSeasons', 'season')));
  await assertSucceeds(deleteDoc(doc(db, 'equinoxSeasons', 'season')));
  await assertSucceeds(setDoc(doc(db, 'equinoxRaids', 'raid'), { name: 'Raid' }));
  await assertSucceeds(getDoc(doc(db, 'equinoxRaids', 'raid')));
  await assertSucceeds(deleteDoc(doc(db, 'equinoxRaids', 'raid')));
  await assertSucceeds(setDoc(doc(db, 'mythicPlusGroups', 'current'), { players: [] }));
  await assertSucceeds(deleteDoc(doc(db, 'mythicPlusGroups', 'current')));
});

test('only the configured UID is administrative', async () => {
  const otherUserDb = testEnv.authenticatedContext('different-user').firestore();
  await assertFails(getDoc(doc(otherUserDb, 'appData', 'characters')));
  await assertFails(setDoc(doc(otherUserDb, 'equinoxSeasons', 'season'), { name: 'S1' }));
  assert.notEqual(ADMIN_UID, 'different-user');
});
