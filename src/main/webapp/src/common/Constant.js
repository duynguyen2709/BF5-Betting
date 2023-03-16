const API_URL = {
  GET_BET_HISTORY: "/bets",
};

const ROUTES = {
  // pages
  INDEX: { path: "/index.html" },
  BASE: { path: "/" },
  DASHBOARD: { path: "/dashboard" },

  // errors
  NOT_FOUND: { path: "/404" },
};

const DEFAULT_ERROR_MESSAGE = "An error occurred. Try again later";

export { API_URL, ROUTES, DEFAULT_ERROR_MESSAGE };
