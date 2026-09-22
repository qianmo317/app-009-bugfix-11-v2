export const EMPTY_CELL = 0xffff;

export function removeColorFromCells(cells: Uint16Array, removedIndex: number): Uint16Array {
  const nextCells = new Uint16Array(cells);

  for (let i = 0; i < nextCells.length; i++) {
    const index = nextCells[i];
    if (index === EMPTY_CELL) continue;
    if (index === removedIndex) {
      nextCells[i] = EMPTY_CELL;
    } else if (index > removedIndex) {
      nextCells[i] = index - 1;
    }
  }

  return nextCells;
}

export function moveColorInCells(cells: Uint16Array, fromIndex: number, toIndex: number): Uint16Array {
  const nextCells = new Uint16Array(cells);

  for (let i = 0; i < nextCells.length; i++) {
    if (nextCells[i] === fromIndex) {
      nextCells[i] = toIndex;
    } else if (nextCells[i] === toIndex) {
      nextCells[i] = fromIndex;
    }
  }

  return nextCells;
}
