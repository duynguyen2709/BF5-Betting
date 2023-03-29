const API_URL = {
  BetHistory: '/bets',
  RawBet: '/bets/raw',
  Players: '/players',
};

const ROUTES = {
  Index: { path: '/index.html' },
  Base: { path: '/' },
  Admin: { path: '/admin' },
};

const MESSAGE = {
  DefaultErrorMessage: 'Hệ thống có lỗi. Vui lòng thử lại sau',
  TokenExpiredMessage: 'Token không hợp lệ',
  EmptyBetReturned: 'Không có cược trong thời gian trên',
  EmptyBetToBeUpdated: 'Không có cược cần cập nhật',
  UpdateBetSuccess: 'Cập nhật cược thành công',
  StartDateMustBeBeforeOrEqualError: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc',
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

const BET_TYPE = {
  Single: 'SINGLE',
  Accumulator: 'ACCUMULATOR',
}

const LOCAL_STORAGE_KEY = {
  RawBetQueryParams: 'RAW-BET-QUERY-PARAMS'
}

export { API_URL, BET_RESULT, BET_TYPE, LOCAL_STORAGE_KEY, ROUTES, RAW_BET_STATUS, MESSAGE };
