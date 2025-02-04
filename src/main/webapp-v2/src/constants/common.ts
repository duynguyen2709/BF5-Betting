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
    UPDATE: (id: string) => `/api/bets/${id}/result`
  },
  PLAYER: {
    LIST: '/api/players',
    STATISTICS: (id: string) => `/api/players/${id}/statistics`
  }
} as const

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
} as const

export const RAW_BET_STATUS = {
  NEW: 'NEW',
  INSERTED: 'INSERTED',
  RESULT_READY: 'RESULT_READY_TO_BE_UPDATED',
  SETTLED: 'SETTLED'
} as const

export const BET_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
} as const

export const BET_RESULT = {
  WIN: 'WIN',
  LOSE: 'LOSE'
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
  NOT_FOUND: 'Không tìm thấy trang yêu cầu.'
} as const

export const QUERY_KEYS = {
  BETS: 'bets',
  RECENT_BETS: 'recent-bets',
  PLAYERS: 'players',
  PLAYER_STATISTICS: 'player-statistics',
  BET_HISTORY: 'betHistory',
  STATISTICS: 'statistics'
} as const

export const API_URL = {
  BetHistory: '/bets',
  RawBet: '/bets/raw',
  Statistics: '/statistics',
  Players: '/players',
  Unlock: '/unlock'
} as const

export const STORAGE_KEYS = {
  UNLOCK_DATA: 'unlock_data',
} as const

export const ROUTES = {
  Base: {
    path: '/'
  },
  Admin: {
    path: '/admin'
  }
} as const
