/** Pure state for the secret 404's untimed, four-pair memory game. */
export const PACKET_SIGNALS = [
  { id: "code", label: "CODE", glyph: "<>" },
  { id: "pixel", label: "PIXEL", glyph: "::" },
  { id: "signal", label: "SIGNAL", glyph: "~~" },
  { id: "file", label: "FILE", glyph: "[]" },
] as const;

export type PacketSignalId = (typeof PACKET_SIGNALS)[number]["id"];

export type PacketGameState = {
  readonly deck: readonly PacketSignalId[] | null;
  /** Unmatched, face-up packets. A mismatch stays visible until the next move. */
  readonly revealed: readonly number[];
  readonly matched: readonly number[];
  readonly status: "sealed" | "playing" | "won";
};

const PACKET_COUNT = PACKET_SIGNALS.length * 2;

function copyValidDeck(deck: readonly PacketSignalId[]): PacketSignalId[] {
  if (
    deck.length !== PACKET_COUNT ||
    PACKET_SIGNALS.some(
      ({ id }) => deck.filter((signal) => signal === id).length !== 2,
    )
  ) {
    throw new RangeError("A packet deck must contain exactly two of each signal.");
  }
  return [...deck];
}

/** A deckless initial state makes server and client renders identical. */
export function createPacketGame(
  deck?: readonly PacketSignalId[],
): PacketGameState {
  return {
    deck: deck ? copyValidDeck(deck) : null,
    revealed: [],
    matched: [],
    status: deck ? "playing" : "sealed",
  };
}

/** Call only from user actions, never during rendering. */
export function shufflePacketDeck(
  random: () => number = Math.random,
): PacketSignalId[] {
  const deck = PACKET_SIGNALS.flatMap(({ id }) => [id, id]);

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new RangeError("The shuffle source must return a number in [0, 1).");
    }
    const other = Math.floor(sample * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }

  return deck;
}

/**
 * Reveal a sealed packet. Supply firstDeck on the first user action only.
 * Existing face-up/matched packets, invalid indices and completed games are no-ops.
 */
export function selectPacket(
  state: PacketGameState,
  index: number,
  firstDeck?: readonly PacketSignalId[],
): PacketGameState {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= PACKET_COUNT ||
    state.status === "won" ||
    state.matched.includes(index) ||
    state.revealed.includes(index)
  ) {
    return state;
  }

  const deck = state.deck ?? (firstDeck ? copyValidDeck(firstDeck) : null);
  if (!deck) return state;

  // Two unmatched packets are a visible mismatch. The next sealed selection
  // closes both and begins a new attempt, without timers or a forced delay.
  const previous = state.revealed.length === 1 ? state.revealed[0] : undefined;
  if (previous !== undefined && deck[previous] === deck[index]) {
    const matched = [...state.matched, previous, index];
    return {
      deck,
      revealed: [],
      matched,
      status: matched.length === PACKET_COUNT ? "won" : "playing",
    };
  }

  return {
    deck,
    revealed: previous === undefined ? [index] : [previous, index],
    matched: state.matched,
    status: "playing",
  };
}

/** Pass a new shuffled deck on replay; omission restores the sealed SSR state. */
export function resetPacketGame(
  deck?: readonly PacketSignalId[],
): PacketGameState {
  return createPacketGame(deck);
}
