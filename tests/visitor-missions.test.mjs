import test from 'node:test';
import assert from 'node:assert/strict';
import { missions, emptyMissionState, applyDiscovery, readMissionState, completedMissions, getMissionSnapshot, recordMissionEvent, trackMission, resetMissions, subscribeMissions } from '../src/lib/visitor-missions.ts';
import { missions as spanish } from '../src/localized/es/lib/visitor-missions.ts';

test('discoveries complete missions only through their real interaction checkpoints', () => {
  let state = emptyMissionState();
  for (const mission of missions) {
    for (const checkpoint of mission.checkpoints) {
      assert.equal(completedMissions(state).includes(mission.id), false);
      state = applyDiscovery(state, checkpoint.id);
    }
    assert.equal(completedMissions(state).includes(mission.id), true);
  }
  assert.equal(completedMissions(state).length, 4);
});

test('route visits, quiz answers, tracking and out-of-order events do not award discoveries', () => {
  const state = emptyMissionState();
  for (const event of ['source', 'loop', 'paper', '/writing/jev', 'unknown', 'gate-blocked', 'gate-restored', 'packet-recovered']) assert.equal(applyDiscovery(state, event), state);
});

test('missions can be discovered without tracking, in any mission order', () => {
  let state = emptyMissionState();
  for (const mission of [...missions].reverse()) for (const checkpoint of mission.checkpoints) state = applyDiscovery(state, checkpoint.id);
  assert.equal(state.active, null);
  assert.equal(completedMissions(state).length, missions.length);
});

test('v1 quiz completion and corrupt saved data cannot count as exploration progress', () => {
  for (const raw of [null, '', 'broken', '{}', '42', '["loop","evidence","research"]', '{"version":1,"events":["menu-fold"]}']) assert.deepEqual(readMissionState(raw), emptyMissionState());
  const raw = JSON.stringify({ version: 2, active: 'retired', events: ['gate-restored', 'menu-fold', 'menu-fold', null, {}, 'retired', 'gate-blocked'] });
  assert.deepEqual(readMissionState(raw), { version: 2, active: null, events: ['menu-fold'] });
  assert.deepEqual(completedMissions(readMissionState(raw)), ['paper']);
});

test('locale presentation preserves the same discovery rules, IDs and localized destinations', () => {
  missions.forEach((mission, index) => {
    assert.equal(spanish[index].id, mission.id);
    assert.notEqual(spanish[index].title, mission.title);
    assert.deepEqual(spanish[index].checkpoints.map(item => item.id), mission.checkpoints.map(item => item.id));
    assert.match(spanish[index].href, /^\/es(?:\/|#|$)/);
  });
});

test('session progress persists, active mission is optional, duplicates are silent, reset and blocked storage work', () => {
  const events = new EventTarget();
  const stored = new Map([['tg-visitor-missions-v1', '["loop"]']]);
  const original = globalThis.window;
  globalThis.window = { sessionStorage: { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) }, addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) };
  let notifications = 0;
  const unsubscribe = subscribeMissions(() => notifications++);
  try {
    assert.deepEqual(readMissionState(getMissionSnapshot()), emptyMissionState());
    trackMission('paper');
    assert.deepEqual(completedMissions(readMissionState(getMissionSnapshot())), []);
    assert.equal(readMissionState(getMissionSnapshot()).active, 'paper');
    recordMissionEvent('menu-fold');
    recordMissionEvent('menu-fold');
    recordMissionEvent('unknown');
    assert.equal(notifications, 2);
    assert.deepEqual(completedMissions(readMissionState(stored.get('tg-visitor-missions-v2'))), ['paper']);
    trackMission(null);
    assert.deepEqual(completedMissions(readMissionState(getMissionSnapshot())), ['paper']);
    globalThis.window.sessionStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
    recordMissionEvent('sticker-note');
    assert.deepEqual(completedMissions(readMissionState(getMissionSnapshot())), ['paper', 'sticker']);
    resetMissions();
    assert.deepEqual(readMissionState(getMissionSnapshot()), emptyMissionState());
    assert.equal(notifications, 5);
    unsubscribe();
    recordMissionEvent('menu-fold');
    assert.equal(notifications, 5);
    assert.equal(stored.get('tg-visitor-missions-v1'), '["loop"]');
  } finally { unsubscribe(); globalThis.window = original; }
});
