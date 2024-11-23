export const API_STALE_TIME = 15 * 60 * 1000

export const API_URL = {
  BetHistory: '/bets',
  RawBet: '/bets/raw',
  Players: '/players',
  Statistics: '/statistics',
  Unlock: '/unlock'
}

export const MESSAGE = {
  DefaultErrorMessage: 'Hệ thống có lỗi. Vui lòng thử lại sau',
  TokenExpiredMessage: 'Token không hợp lệ',
  EmptyBetReturned: 'Không có cược trong thời gian trên',
  AllBetUnfinished: 'Cược chưa hoàn tất',
  EmptyBetToBeUpdated: 'Không có cược cần cập nhật',
  UpdateBetSuccess: 'Cập nhật cược thành công',
  RunStatisticSuccess: 'Chạy thống kê thành công',
  AddPaymentHistorySuccess: 'Thêm dữ liệu thanh toán thành công',
  StartDateMustBeBeforeOrEqualError: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc'
}
