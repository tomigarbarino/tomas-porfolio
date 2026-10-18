import test from 'node:test';
import assert from 'node:assert/strict';
import { missions, answerMission, readCompleted, getMissionSnapshot, saveMissionCompletion, resetMissions, subscribeMissions } from '../src/lib/visitor-missions.ts';
import { missions as spanish } from '../src/localized/es/lib/visitor-missions.ts';

test('every visitor mission requires all its decisions, with wrong choices staying on the current step', () => {
  for (const mission of missions) {
    let step = 0;
    for (const question of mission.steps) {
      for (const option of question.options.filter(item => item.id !== question.answer)) {
        assert.deepEqual(answerMission(mission.id, step, option.id), { accepted: false, step, complete: false });
      }
      const result = answerMission(mission.id, step, question.answer);
      step += 1;
      assert.deepEqual(result, { accepted: true, step, complete: step === mission.steps.length });
    }
    assert.equal(answerMission(mission.id, step, mission.steps.at(-1).answer).complete, false);
  }
});

test('unknown missions, missing choices and out-of-range steps cannot complete a mission', () => {
  for (const [id, step, choice] of [['unknown', 0, 'source'], ['loop', -1, 'source'], ['loop', 0.5, 'source'], ['loop', 99, 'source'], ['loop', 0, 'missing']]) {
    const result = answerMission(id, step, choice);
    assert.equal(result.accepted, false);
    assert.equal(result.complete, false);
    assert.equal(result.step, step);
  }
});

test('stored progress rejects corrupt data and unknown IDs, and deduplicates completed missions', () => {
  for (const raw of [null, '', 'broken', '{}', '42', '"loop"', '[null,{}]']) assert.deepEqual(readCompleted(raw), []);
  assert.deepEqual(readCompleted('["research","loop","loop","retired"]'), ['loop', 'research']);
});

test('English and Spanish missions share decision rules and progress IDs, with localized destinations', () => {
  assert.equal(missions.length, 3);
  missions.forEach((mission, index) => {
    const translated = spanish[index];
    assert.equal(translated.id, mission.id);
    assert.notEqual(translated.title, mission.title);
    assert.deepEqual(translated.steps.map(step => [step.answer, step.options.map(option => option.id)]), mission.steps.map(step => [step.answer, step.options.map(option => option.id)]));
    assert.match(translated.href, /^\/es\//);
  });
});

test('completion persists once per mission, reset notifies subscribers, and blocked storage retains in-memory progress', () => {
  const events = new EventTarget();
  const stored = new Map();
  const storage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
  const original = globalThis.window;
  globalThis.window = { sessionStorage: storage, addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) };
  let notifications = 0;
  const unsubscribe = subscribeMissions(() => notifications++);
  try {
    resetMissions();
    saveMissionCompletion('loop');
    saveMissionCompletion('loop');
    saveMissionCompletion('unknown');
    assert.deepEqual(readCompleted(getMissionSnapshot()), ['loop']);
    assert.equal([...stored.values()][0], '["loop"]');
    globalThis.window.sessionStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
    saveMissionCompletion('evidence');
    assert.deepEqual(readCompleted(getMissionSnapshot()), ['loop', 'evidence']);
    resetMissions();
    assert.deepEqual(readCompleted(getMissionSnapshot()), []);
    assert.equal(notifications, 6);
    unsubscribe();
    saveMissionCompletion('research');
    assert.equal(notifications, 6);
  } finally { unsubscribe(); globalThis.window = original; }
});
