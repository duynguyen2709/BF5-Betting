import { STORAGE_KEYS } from '@/constants';
import { useQuickRawBetQuery, useRawBetQuery } from '@/hooks/useRawBetQuery';
import { BetHistory } from '@/types';
import type { QueryRawBetFormValues, RawBetFilterRequest } from '@/types/rawBet';
import { Col, Form, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { AddBetHistoryModal } from '../AddBetHistoryModal';
import { BatchInsertRawBetButton } from '../BatchInsertRawBetButton';
import { BatchUpdateRawBetButton } from '../BatchUpdateRawBetButton';
import { CenterLoadingSpinner } from '../CenterLoadingSpinner';
import { QueryRawBetInfoForm } from './QueryRawBetInfoForm';
import { RawBetTable } from './RawBetTable';

interface AdminRawBetManagementTabProps {
  onSuccessAction: () => void;
}

type QueryMode = 'NORMAL' | 'QUICK';

interface QueryParams {
  sessionToken?: string;
  startDate?: string;
  endDate?: string;
  mode?: QueryMode;
  timestamp?: number;
}

const DEFAULT_QUERY_PARAMS = {
  sessionToken: '',
  startDate: '',
  endDate: '',
  mode: 'NORMAL',
  timestamp: undefined,
} as QueryParams;

export function AdminRawBetManagementTab({ onSuccessAction }: AdminRawBetManagementTabProps) {
  const [modalAddSingleOpen, setModalAddSingleOpen] = useState(false);
  const [modalAddBatchOpen, setModalAddBatchOpen] = useState(false);
  const [currentAddBet, setCurrentAddBet] = useState<BetHistory>();
  const [currentBatchAddBet, setCurrentBatchAddBet] = useState<BetHistory[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>(DEFAULT_QUERY_PARAMS);

  const [form] = Form.useForm<QueryRawBetFormValues>();

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

  // Initialize form with saved values
  useEffect(() => {
    const sessionToken = localStorage.getItem(STORAGE_KEYS.RAW_BET_QUERY_TOKEN);
    if (form && sessionToken) {
      form.setFieldsValue({
        sessionToken,
      });
    }
  }, [form]);

  // Trigger queries when params change
  useEffect(() => {
    if (queryParams.mode === 'QUICK') {
      quickQueryRawBetList();
    } else if (queryParams.mode === 'NORMAL' && queryParams.startDate && queryParams.endDate) {
      queryRawBetList();
    }
  }, [queryParams]);

  const handleProcessRawBetSuccess = useCallback(() => {
    setCurrentBatchAddBet([]);
    setCurrentAddBet(undefined);
    setModalAddBatchOpen(false);
    setModalAddSingleOpen(false);
    setQueryParams((prev: any) => ({
      ...prev,
      timestamp: Date.now(),
    }));
    onSuccessAction();
  }, []);

  const handleFetchRawBetList = useCallback((values: QueryRawBetFormValues) => {
    const { sessionToken, dateRange } = values;
    const newQueryParams = {
      sessionToken,
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
      mode: 'NORMAL' as QueryMode,
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
      mode: 'QUICK' as QueryMode,
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

  const combinedLoading = isFetchingNormal || isFetchingQuick;
  const tableData = (queryParams.mode === 'NORMAL' ? rawBetList : rawBetQuickList) || [];

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: '1rem' }}>
        <Col span={16}>
          <QueryRawBetInfoForm
            form={form}
            onFinish={handleFetchRawBetList}
            onQuickFetch={handleQuickFetchRawBetList}
            loading={combinedLoading}
          />
        </Col>
        <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {currentBatchAddBet.length > 0 && (
            <BatchInsertRawBetButton data={tableData} onClickAddBatch={handleClickAddBatchBet} />
          )}
          <BatchUpdateRawBetButton data={tableData} onSuccess={handleProcessRawBetSuccess} />
        </Col>
      </Row>

      {combinedLoading && <CenterLoadingSpinner />}
      {!combinedLoading && tableData && (
        <RawBetTable
          data={tableData}
          onClickAdd={handleClickAddSingleBet}
          onSelectBatchBets={setCurrentBatchAddBet}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}

      {modalAddSingleOpen && currentAddBet && (
        <AddBetHistoryModal
          data={currentAddBet}
          isOpen={modalAddSingleOpen}
          onClose={handleCloseSingleModal}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}
      {modalAddBatchOpen && currentBatchAddBet.length > 0 && (
        <AddBetHistoryModal
          data={currentBatchAddBet}
          isOpen={modalAddBatchOpen}
          onClose={handleCloseBatchModal}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}
    </>
  );
}
