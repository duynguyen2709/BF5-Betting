import type { BetHistory } from '@/types';
import type { QueryRawBetFormValues } from '@/types/rawBet';
import type { FormInstance } from 'antd';

export type QueryMode = 'NORMAL' | 'QUICK';

export interface QueryParams {
  sessionToken?: string;
  startDate?: string;
  endDate?: string;
  mode?: QueryMode;
  timestamp?: number;
}

export interface AdminRawBetManagementTabProps {
  onSuccessAction: () => void;
}

export interface ActionBarProps {
  form: FormInstance<QueryRawBetFormValues>;
  loading: boolean;
  onFetchRawBetList: (values: QueryRawBetFormValues) => void;
  onQuickFetch: () => void;
  tableData: BetHistory[];
  currentBatchAddBet: BetHistory[];
  onClickAddBatch: (bets: BetHistory[]) => void;
  onProcessSuccess: () => void;
}

export const DEFAULT_QUERY_PARAMS: QueryParams = {
  sessionToken: '',
  startDate: '',
  endDate: '',
  mode: 'NORMAL',
  timestamp: undefined,
};
