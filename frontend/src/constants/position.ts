export type Position = {
  deposited: number;
  borrowed: number;
};

export const DEFAULT_POSITION: Position = {
  deposited: 0,
  borrowed: 0,
};
