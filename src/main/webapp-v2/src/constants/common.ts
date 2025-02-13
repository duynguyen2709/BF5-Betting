export const PAGE_SIZES = [5, 10, 20, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const MOBILE_PAGE_SIZE = 5

export const BREAKPOINTS = {
  MOBILE: '428px',
  TABLET: '768px',
  DESKTOP: '1024px',
  WIDE: '1440px'
} as const

export const DATE_FORMATS = {
  FULL: 'dd/MM/yyyy HH:mm:ss',
  SHORT: 'dd/MM/yyyy',
  TIME: 'HH:mm',
  MOBILE: 'dd/MM HH:mm'
} as const

export const API_ENDPOINTS = {
  AUTH: {
    UNLOCK: '/api/unlock'
  },
  BET: {
    LIST: '/api/bets',
    RECENT: '/api/bets/recent',
    RAW: '/api/bets/raw',
    RAW_QUICK: '/api/bets/raw/quick',
    UPDATE: (id: string) => `/api/bets/${id}/result`,
    INSERT: '/api/bets/insert',
    INSERT_BATCH: '/api/bets/insert/batch',
    UPDATE_RAW: '/api/bets/raw/update',
    UPDATE_RAW_BATCH: '/api/bets/raw/update/batch'
  },
  PLAYER: {
    LIST: '/api/players',
    DETAIL: (id: string) => `/api/players/${id}`,
    STATISTICS: '/api/players/statistics'
  },
  STATISTICS: {
    DETAIL: '/api/statistics',
    ASSET: '/api/statistics/asset'
  }
} as const

export const MESSAGES = {
  LOGIN_FAILED: 'Đăng nhập thất bại',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  DEFAULT_ERROR: 'Hệ thống có lỗi. Vui lòng thử lại sau',
  TOKEN_EXPIRED: 'Token không hợp lệ',
  EMPTY_BET: 'Không có cược trong thời gian trên',
  ALL_BET_UNFINISHED: 'Cược chưa hoàn tất',
  EMPTY_BET_TO_UPDATE: 'Không có cược cần cập nhật',
  UPDATE_BET_SUCCESS: 'Cập nhật cược thành công',
  RUN_STATISTIC_SUCCESS: 'Chạy thống kê thành công',
  ADD_PAYMENT_SUCCESS: 'Thêm dữ liệu thanh toán thành công',
  DATE_RANGE_ERROR: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc',
  UNAUTHORIZED: 'Bạn không có quyền truy cập. Vui lòng đăng nhập.',
  NOT_FOUND: 'Không tìm thấy trang yêu cầu.',
  START_DATE_MUST_BE_BEFORE_OR_EQUAL_ERROR: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc',
  SELECT_ALL_MATCH_RESULTS: '"Vui lòng chọn kết quả cho tất cả trận đấu"'
} as const

export const QUERY_KEYS = {
  PLAYERS: 'players',
  PLAYER_STATISTICS: 'player-statistics',
  BET_HISTORIES: 'bet-histories',
  ASSET_HISTORIES: 'asset-histories'
} as const

export const API_URL = {
  BET_HISTORY: '/bets',
  RAW_BET: '/bets/raw',
  STATISTICS: '/statistics',
  PLAYERS: '/players',
  UNLOCK: '/unlock'
} as const

export const STORAGE_KEYS = {
  UNLOCK_DATA: 'unlock_data',
  IS_ADMIN: 'is_admin',
  RAW_BET_QUERY_TOKEN: 'raw_bet_query_token'
} as const

export const ROUTES = {
  Base: {
    path: '/'
  },
  Admin: {
    path: '/admin'
  }
} as const

export const ADMIN_USER_ID = '100002362515754'

export const BET_RESULT = {
  Win: {
    result: 'WIN',
    text: 'Thắng'
  },
  HalfWin: {
    result: 'HALF_WIN',
    text: 'Thắng Nửa Tiền'
  },
  Lost: {
    result: 'LOST',
    text: 'Thua'
  },
  HalfLost: {
    result: 'HALF_LOST',
    text: 'Thua Nửa Tiền'
  },
  Draw: {
    result: 'DRAW',
    text: 'Hoà'
  },
  Unfinished: {
    result: 'NOT_FINISHED',
    text: 'Chưa Hoàn Tất'
  }
} as const

export const RAW_BET_STATUS = {
  New: 'NEW',
  Inserted: 'INSERTED',
  ResultReadyToBeUpdated: 'RESULT_READY_TO_BE_UPDATED',
  Settled: 'SETTLED'
}
