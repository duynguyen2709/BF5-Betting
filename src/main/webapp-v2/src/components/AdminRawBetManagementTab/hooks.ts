import { STORAGE_KEYS } from '@/constants';
import { useQuickRawBetQuery, useRawBetQuery } from '@/hooks/useRawBetQuery';
import type { BetHistory } from '@/types';
import type { QueryRawBetFormValues, RawBetFilterRequest } from '@/types/rawBet';
import type { FormInstance } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import type { QueryParams } from './types';
import { DEFAULT_QUERY_PARAMS } from './types';

interface UseRawBetManagementReturn {
  modalAddSingleOpen: boolean;
  modalAddBatchOpen: boolean;
  currentAddBet?: BetHistory;
  currentBatchAddBet: BetHistory[];
  queryParams: QueryParams;
  rawBetList: BetHistory[];
  isLoading: boolean;
  handleProcessRawBetSuccess: () => void;
  handleFetchRawBetList: (values: QueryRawBetFormValues) => void;
  handleQuickFetchRawBetList: () => void;
  handleClickAddSingleBet: (bet: BetHistory) => void;
  handleClickAddBatchBet: (bets: BetHistory[]) => void;
  handleCloseSingleModal: () => void;
  handleCloseBatchModal: () => void;
}

export function useRawBetManagement(
  form: FormInstance<QueryRawBetFormValues>,
  onSuccessAction: () => void
): UseRawBetManagementReturn {
  const [modalAddSingleOpen, setModalAddSingleOpen] = useState(false);
  const [modalAddBatchOpen, setModalAddBatchOpen] = useState(false);
  const [currentAddBet, setCurrentAddBet] = useState<BetHistory>();
  const [currentBatchAddBet, setCurrentBatchAddBet] = useState<BetHistory[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>(DEFAULT_QUERY_PARAMS);

  const {
    data: rawBetList,
    isLoading: isFetchingNormal,
    refetch: queryRawBetList,
  } = useRawBetQuery(
    queryParams.mode === 'NORMAL'
      ? ({
          sessionToken: queryParams.sessionToken,
          startDate: queryParams.startDate,
          endDate: queryParams.endDate,
        } as RawBetFilterRequest)
      : { sessionToken: '', startDate: '', endDate: '' }
  );

  const {
    data: rawBetQuickList,
    isLoading: isFetchingQuick,
    refetch: quickQueryRawBetList,
  } = useQuickRawBetQuery(queryParams.mode === 'QUICK' ? queryParams.sessionToken : undefined);

  useEffect(() => {
    const sessionToken = localStorage.getItem(STORAGE_KEYS.RAW_BET_QUERY_TOKEN);
    if (form && sessionToken) {
      form.setFieldsValue({ sessionToken });
    }
  }, [form]);

  useEffect(() => {
    if (queryParams.mode === 'QUICK') {
      quickQueryRawBetList();
    } else if (queryParams.mode === 'NORMAL' && queryParams.startDate && queryParams.endDate) {
      queryRawBetList();
    }
  }, [queryParams, quickQueryRawBetList, queryRawBetList]);

  const handleProcessRawBetSuccess = useCallback(() => {
    setCurrentBatchAddBet([]);
    setCurrentAddBet(undefined);
    setModalAddBatchOpen(false);
    setModalAddSingleOpen(false);
    setQueryParams((prev) => ({
      ...prev,
      timestamp: Date.now(),
    }));
    onSuccessAction();
  }, [onSuccessAction]);

  const handleFetchRawBetList = useCallback((values: QueryRawBetFormValues) => {
    const { sessionToken, dateRange } = values;
    const newQueryParams = {
      sessionToken,
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
      mode: 'NORMAL' as const,
      timestamp: Date.now(),
    };
    setQueryParams(newQueryParams);
    if (sessionToken) {
      localStorage.setItem(STORAGE_KEYS.RAW_BET_QUERY_TOKEN, sessionToken);
    }
  }, []);

  const handleQuickFetchRawBetList = useCallback(() => {
    const sessionToken = form.getFieldValue('sessionToken');
    const newQueryParams = {
      sessionToken,
      mode: 'QUICK' as const,
      timestamp: Date.now(),
    };
    setQueryParams(newQueryParams);
    if (sessionToken) {
      localStorage.setItem(STORAGE_KEYS.RAW_BET_QUERY_TOKEN, sessionToken);
    }
  }, [form]);

  const handleClickAddSingleBet = useCallback((bet: BetHistory) => {
    setCurrentAddBet(bet);
    setModalAddSingleOpen(true);
  }, []);

  const handleClickAddBatchBet = useCallback((bets: BetHistory[]) => {
    setCurrentBatchAddBet(bets);
    setModalAddBatchOpen(true);
  }, []);

  const handleCloseSingleModal = useCallback(() => {
    setCurrentAddBet(undefined);
    setModalAddSingleOpen(false);
  }, []);

  const handleCloseBatchModal = useCallback(() => {
    setCurrentBatchAddBet([]);
    setModalAddBatchOpen(false);
  }, []);

  return {
    modalAddSingleOpen,
    modalAddBatchOpen,
    currentAddBet,
    currentBatchAddBet,
    queryParams,
    rawBetList: (queryParams.mode === 'NORMAL' ? rawBetList : rawBetQuickList) || [],
    isLoading: isFetchingNormal || isFetchingQuick,
    handleProcessRawBetSuccess,
    handleFetchRawBetList,
    handleQuickFetchRawBetList,
    handleClickAddSingleBet,
    handleClickAddBatchBet,
    handleCloseSingleModal,
    handleCloseBatchModal,
  };
}
