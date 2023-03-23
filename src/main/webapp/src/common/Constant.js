const API_URL = {
  BetHistory: '/bets',
  Players: '/players',
};

const ROUTES = {
  Index: { path: '/index.html' },
  Base: { path: '/' },
  Admin: { path: '/admin' },
};

const MESSAGE = {
  DefaultErrorMessage: 'Hệ thống có lỗi. Vui lòng thử lại sau',
  EmptyBetReturned: 'Không có cược trong thời gian trên',
}

const RAW_BET_STATUS = {
  New: 'NEW',
  Inserted: 'INSERTED',
  ResultReadyToBeUpdated: 'RESULT_READY_TO_BE_UPDATED',
  Settled: 'SETTLED'
}

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

export { API_URL, BET_RESULT, ROUTES, RAW_BET_STATUS, MESSAGE };
