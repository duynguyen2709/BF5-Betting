const API_URL = {
  BetHistory: "/bets",
  GET_PLAYERS: "/players",
};

const ROUTES = {
  // pages
  INDEX: { path: "/index.html" },
  BASE: { path: "/" },
  ADMIN: { path: "/admin" },

  // errors
  NOT_FOUND: { path: "/404" },
};

const DEFAULT_ERROR_MESSAGE = "Hệ thống có lỗi. Vui lòng thử lại sau";

const BET_RESULT = {
  WIN: 'WIN',
  HALF_WIN: 'HALF_WIN',
  LOST: 'LOST',
  HALF_LOST: 'HALF_LOST',
  DRAW: 'DRAW',
  NOT_FINISHED: 'NOT_FINISHED',
}

export { API_URL, BET_RESULT, ROUTES, DEFAULT_ERROR_MESSAGE };
