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
  Win: {
    result: 'WIN',
    text: 'Thắng',
  },
  HalfWin: {
    result: 'HALF_WIN',
    text: 'Thắng Nửa Tiền',
  },
  Lost: {
    result: 'LOST',
    text: 'Thua',
  },
  HalfLost: {
    result: 'HALF_LOST',
    text: 'Thua Nửa Tiền',
  },
  Draw: {
    result: 'DRAW',
    text: 'Hoà',
  },
  Unfinished: {
    result: 'NOT_FINISHED',
    text: 'Chưa Hoàn Tất',
  },
}

export { API_URL, BET_RESULT, ROUTES, DEFAULT_ERROR_MESSAGE };
