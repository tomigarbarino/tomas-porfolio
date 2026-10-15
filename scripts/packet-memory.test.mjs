import assert from "node:assert/strict";
import test from "node:test";
import {
  PACKET_SIGNALS,
  createPacketGame,
  resetPacketGame,
  selectPacket,
  shufflePacketDeck,
} from "../src/lib/packet-memory.ts";

const deck = ["code", "pixel", "signal", "file", "code", "pixel", "signal", "file"];

function freezeState(state) {
  if (state.deck) Object.freeze(state.deck);
  Object.freeze(state.revealed);
  Object.freeze(state.matched);
  return Object.freeze(state);
}

function assertInvariants(state) {
  const visible = [...state.revealed, ...state.matched];
  assert.equal(new Set(visible).size, visible.length);
  assert.ok(visible.every((index) => Number.isInteger(index) && index >= 0 && index < 8));
  assert.ok(state.revealed.length <= 2);
  assert.equal(state.matched.length % 2, 0);
  for (let index = 0; index < state.matched.length; index += 2) {
    assert.equal(state.deck[state.matched[index]], state.deck[state.matched[index + 1]]);
  }
  if (state.revealed.length === 2) {
    assert.notEqual(state.deck[state.revealed[0]], state.deck[state.revealed[1]]);
  }
  assert.equal(state.status === "won", state.matched.length === 8);
  if (state.status === "sealed") {
    assert.equal(state.deck, null);
    assert.deepEqual(visible, []);
  }
}

test("initial state is deterministic and waits for an action-supplied deck", () => {
  const state = freezeState(createPacketGame());
  assert.deepEqual(state, { deck: null, revealed: [], matched: [], status: "sealed" });
  assert.deepEqual(createPacketGame(), state);
  assert.equal(selectPacket(state, 0), state);

  const playing = selectPacket(state, 0, deck);
  assert.equal(playing.status, "playing");
  assert.deepEqual(playing.revealed, [0]);
  assert.deepEqual(playing.deck, deck);
  assert.notEqual(playing.deck, deck);
  assertInvariants(playing);
});

test("matches persist; mismatches wait for a new sealed selection", () => {
  let state = freezeState(createPacketGame(deck));
  state = freezeState(selectPacket(state, 0));
  state = freezeState(selectPacket(state, 1));
  assert.deepEqual(state.revealed, [0, 1]);
  assert.deepEqual(state.matched, []);
  assert.equal(selectPacket(state, 0), state);
  assert.equal(selectPacket(state, 1), state);

  state = freezeState(selectPacket(state, 4));
  assert.deepEqual(state.revealed, [4]);
  state = freezeState(selectPacket(state, 0));
  assert.deepEqual(state.revealed, []);
  assert.deepEqual(state.matched, [4, 0]);
  assert.equal(selectPacket(state, 0), state);
  assert.equal(selectPacket(state, 4), state);

  state = freezeState(selectPacket(state, 1));
  assert.deepEqual(state.revealed, [1]);
  assert.deepEqual(state.matched, [4, 0]);
  assertInvariants(state);
});

test("all four pairs complete the game and subsequent selections are no-ops", () => {
  let state = freezeState(createPacketGame());
  for (const index of [0, 4, 1, 5, 2, 6, 3, 7]) {
    const previous = state;
    state = freezeState(selectPacket(state, index, deck));
    assert.notEqual(state, previous);
    assertInvariants(state);
  }
  assert.equal(state.status, "won");
  assert.deepEqual(state.revealed, []);
  for (let index = -1; index <= 8; index += 1) {
    assert.equal(selectPacket(state, index, [...deck].reverse()), state);
  }
});

test("invalid indices do not initialize or disturb a game", () => {
  const invalid = [-1, 8, 99, 0.5, NaN, Infinity, -Infinity, "0", null, undefined];
  const sealed = freezeState(createPacketGame());
  const mismatch = freezeState(selectPacket(selectPacket(sealed, 0, deck), 1));
  for (const index of invalid) {
    assert.equal(selectPacket(sealed, index, deck), sealed);
    assert.equal(selectPacket(mismatch, index), mismatch);
  }
  assert.deepEqual(mismatch.revealed, [0, 1]);
});

test("a later firstDeck cannot replace the active deck", () => {
  const state = freezeState(selectPacket(createPacketGame(), 0, deck));
  const next = selectPacket(state, 4, [...deck].reverse());
  assert.equal(next.deck, state.deck);
  assert.deepEqual(next.matched, [0, 4]);
});

test("reset during a mismatch clears progress and owns a fresh deck copy", () => {
  const mismatch = freezeState(selectPacket(selectPacket(createPacketGame(deck), 0), 1));
  const freshDeck = [...deck].reverse();
  const reset = resetPacketGame(freshDeck);
  assert.deepEqual(reset.revealed, []);
  assert.deepEqual(reset.matched, []);
  assert.deepEqual(reset.deck, freshDeck);
  assert.notEqual(reset.deck, freshDeck);
  freshDeck.reverse();
  assert.deepEqual(reset.deck, [...deck].reverse());
  assert.deepEqual(mismatch.revealed, [0, 1]);
  assert.deepEqual(resetPacketGame(), createPacketGame());
});

test("Fisher–Yates uses seven bounded samples and preserves two of each signal", () => {
  let calls = 0;
  const shuffled = shufflePacketDeck(() => { calls += 1; return 0; });
  assert.equal(calls, 7);
  assert.deepEqual(shuffled, ["code", "pixel", "pixel", "signal", "signal", "file", "file", "code"]);
  assert.deepEqual(shufflePacketDeck(() => 0.999999), PACKET_SIGNALS.flatMap(({ id }) => [id, id]));

  for (let seed = 1; seed <= 100; seed += 1) {
    let value = seed;
    const sample = () => {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      return value / 2 ** 32;
    };
    const result = shufflePacketDeck(sample);
    assert.equal(result.length, 8);
    for (const { id } of PACKET_SIGNALS) {
      assert.equal(result.filter((item) => item === id).length, 2);
    }
  }
});

test("malformed supplied decks and random sources fail explicitly", () => {
  for (const invalidDeck of [[], ["code"], Array(8).fill("code"), [...deck.slice(0, 7), "unknown"]]) {
    assert.throws(() => createPacketGame(invalidDeck), RangeError);
    assert.throws(() => selectPacket(createPacketGame(), 0, invalidDeck), RangeError);
  }
  for (const value of [-0.1, 1, NaN, Infinity]) {
    assert.throws(() => shufflePacketDeck(() => value), RangeError);
  }
});

test("all reachable states preserve invariants without mutating their predecessor", () => {
  const initial = createPacketGame(deck);
  const pending = [initial];
  const visited = new Set();
  while (pending.length) {
    const state = freezeState(pending.pop());
    const key = JSON.stringify([state.revealed, [...state.matched].sort((a, b) => a - b)]);
    if (visited.has(key)) continue;
    visited.add(key);
    assertInvariants(state);
    const original = JSON.stringify(state);
    for (let index = 0; index < 8; index += 1) {
      const next = selectPacket(state, index);
      assertInvariants(next);
      assert.equal(JSON.stringify(state), original);
      if (next !== state) pending.push(next);
    }
  }
  assert.ok(visited.size > 200, `Expected substantial state coverage; saw ${visited.size}`);
});
