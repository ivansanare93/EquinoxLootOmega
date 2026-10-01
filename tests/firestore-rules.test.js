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
  serverTimestamp,
  Timestamp,
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

function validForeverMember(overrides = {}) {
  const now = Timestamp.fromDate(new Date('2026-10-01T12:00:00.000Z'));

  return {
    schemaVersion: 1,
    rank: 'naciente',
    createdAt: now,
    updatedAt: now,
    ownerUid: null,
    main: {
      characterName: 'Aeloria',
      classId: 'mage',
      primarySpecId: 'arcane',
      primaryRole: 'dps',
      secondary: null,
      primaryProfessions: []
    },
    alts: [],
    ...overrides
  };
}

function validPublicForeverMember(overrides = {}) {
  return validForeverMember({
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides
  });
}

function validForeverAlter(id = 'alter-one') {
  return {
    id,
    characterName: 'Veloria',
    classId: 'priest',
    specId: 'holy',
    role: 'healer',
    primaryProfessions: ['tailoring']
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

test('public can read and create a valid Naciente Forever member but cannot modify it', async () => {
  await seed(['gameVersions', 'forever', 'members', 'member-one'], validForeverMember());
  const memberRef = doc(publicDb(), 'gameVersions', 'forever', 'members', 'member-one');
  const publicMemberRef = doc(publicDb(), 'gameVersions', 'forever', 'members', 'generated-id-123');

  await assertSucceeds(getDoc(memberRef));
  await assertSucceeds(getDocs(collection(publicDb(), 'gameVersions', 'forever', 'members')));
  await assertSucceeds(setDoc(publicMemberRef, validPublicForeverMember()));
  await assertFails(setDoc(publicMemberRef, validPublicForeverMember()));
  await assertFails(updateDoc(publicMemberRef, { rank: 'alba' }));
  await assertFails(deleteDoc(publicMemberRef));
  await assertFails(updateDoc(memberRef, { rank: 'alba' }));
  await assertFails(deleteDoc(memberRef));
});

test('an authenticated non-admin cannot manage Forever members', async () => {
  const memberRef = doc(
    testEnv.authenticatedContext('regular-member').firestore(),
    'gameVersions', 'forever', 'members', 'member-one'
  );

  await assertFails(setDoc(memberRef, validForeverMember()));
  await seed(['gameVersions', 'forever', 'members', 'member-one'], validForeverMember());
  await assertFails(updateDoc(memberRef, { rank: 'centinela' }));
  await assertFails(deleteDoc(memberRef));
});

test('admin can manage valid Forever members', async () => {
  const memberRef = doc(adminDb(), 'gameVersions', 'forever', 'members', 'member-one');
  await assertSucceeds(setDoc(memberRef, validForeverMember({ rank: 'eclipse' })));
  await assertSucceeds(updateDoc(memberRef, { rank: 'centinela' }));
  await assertSucceeds(updateDoc(memberRef, {
    main: { ...validForeverMember().main, primaryProfessions: ['alchemy'] },
    alts: [validForeverAlter('admin-alter')]
  }));
  await assertSucceeds(deleteDoc(memberRef));
});

test('Forever member validation rejects invalid rank, role, alters, and ownerUid', async () => {
  const db = adminDb();

  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'invalid-rank'),
    validForeverMember({ rank: 'celeste' })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'invalid-role'),
    validForeverMember({ main: { ...validForeverMember().main, primaryRole: 'support' } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'too-many-alters'),
    validForeverMember({ alts: Array.from({ length: 11 }, (_, index) => validForeverAlter(`alter-${index}`)) })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'owned-member'),
    validForeverMember({ ownerUid: 'future-owner' })
  ));
});

test('Forever member validation checks every embedded alter', async () => {
  const db = adminDb();
  const alts = [validForeverAlter('alter-one'), { id: 'alter-two', characterName: 'Broken' }];

  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'invalid-alter'),
    validForeverMember({ alts })
  ));
});

test('public Forever creation rejects administrative ranks and ownerUid', async () => {
  const db = publicDb();

  for (const rank of ['eclipse', 'alba', 'centinela', 'nova']) {
    await assertFails(setDoc(
      doc(db, 'gameVersions', 'forever', 'members', `public-${rank}`),
      validPublicForeverMember({ rank })
    ));
  }

  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-owner'),
    validPublicForeverMember({ ownerUid: 'future-owner' })
  ));
});

test('public Forever creation rejects malformed data and manipulated timestamps', async () => {
  const db = publicDb();
  const mainWithoutProfessions = { ...validForeverMember().main };
  delete mainWithoutProfessions.primaryProfessions;

  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-extra-field'),
    validPublicForeverMember({ unexpected: true })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-missing-field'),
    validPublicForeverMember({ main: mainWithoutProfessions })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-invalid-class'),
    validPublicForeverMember({ main: { ...validForeverMember().main, classId: 'monk' } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-invalid-spec'),
    validPublicForeverMember({ main: { ...validForeverMember().main, primarySpecId: 'feral' } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-invalid-role'),
    validPublicForeverMember({ main: { ...validForeverMember().main, primaryRole: 'tank' } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-invalid-profession'),
    validPublicForeverMember({ main: { ...validForeverMember().main, primaryProfessions: ['cooking'] } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-too-many-professions'),
    validPublicForeverMember({ main: { ...validForeverMember().main, primaryProfessions: ['alchemy', 'mining', 'tailoring'] } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-duplicate-professions'),
    validPublicForeverMember({ main: { ...validForeverMember().main, primaryProfessions: ['mining', 'mining'] } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-too-many-alters'),
    validPublicForeverMember({ alts: Array.from({ length: 11 }, (_, index) => validForeverAlter(`alter-${index}`)) })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-invalid-alter'),
    validPublicForeverMember({ alts: [{ id: 'bad-alter', characterName: 'Broken' }] })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'public-manipulated-timestamps'),
    validForeverMember()
  ));
});

test('Forever accepts zero, one, and two primary professions and multirole specs', async () => {
  const db = adminDb();
  const zeroProfessions = validForeverMember();
  const oneProfession = validForeverMember({
    main: { ...validForeverMember().main, primaryProfessions: ['mining'] }
  });
  const twoProfessions = validForeverMember({
    main: { ...validForeverMember().main, primaryProfessions: ['blacksmithing', 'mining'] }
  });
  const feralTank = validForeverMember({
    main: {
      ...validForeverMember().main,
      classId: 'druid',
      primarySpecId: 'feral',
      primaryRole: 'tank'
    }
  });
  const enhancementTank = validForeverMember({
    main: {
      ...validForeverMember().main,
      classId: 'shaman',
      primarySpecId: 'enhancement',
      primaryRole: 'tank'
    }
  });

  await assertSucceeds(setDoc(doc(db, 'gameVersions', 'forever', 'members', 'zero-professions'), zeroProfessions));
  await assertSucceeds(setDoc(doc(db, 'gameVersions', 'forever', 'members', 'one-profession'), oneProfession));
  await assertSucceeds(setDoc(doc(db, 'gameVersions', 'forever', 'members', 'two-professions'), twoProfessions));
  await assertSucceeds(setDoc(doc(db, 'gameVersions', 'forever', 'members', 'feral-tank'), feralTank));
  await assertSucceeds(setDoc(doc(db, 'gameVersions', 'forever', 'members', 'enhancement-tank'), enhancementTank));
});

test('Forever rejects invalid professions and class, spec, and role combinations', async () => {
  const db = adminDb();

  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'three-professions'),
    validForeverMember({ main: { ...validForeverMember().main, primaryProfessions: ['alchemy', 'mining', 'tailoring'] } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'duplicate-professions'),
    validForeverMember({ main: { ...validForeverMember().main, primaryProfessions: ['mining', 'mining'] } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'unknown-profession'),
    validForeverMember({ main: { ...validForeverMember().main, primaryProfessions: ['cooking'] } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'unknown-class'),
    validForeverMember({ main: { ...validForeverMember().main, classId: 'monk' } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'wrong-spec'),
    validForeverMember({ main: { ...validForeverMember().main, classId: 'mage', primarySpecId: 'feral' } })
  ));
  await assertFails(setDoc(
    doc(db, 'gameVersions', 'forever', 'members', 'wrong-role'),
    validForeverMember({ main: { ...validForeverMember().main, primaryRole: 'tank' } })
  ));
});
