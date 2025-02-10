import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BetHistoryFilterRequest } from '@/types';
import { QueryHistoryAction } from '@/constants';

interface UrlState {
  queryParams: BetHistoryFilterRequest;
  queryMode?: QueryHistoryAction;
}

const QUERY_PARAM = {
  PLAYER_ID: 'playerId',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  QUERY_MODE: 'queryMode',
} as const;

export function useHistoryPageUrl(): [UrlState, (newState: UrlState) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState = useMemo<UrlState>(() => ({
    queryParams: {
      playerId: searchParams.get(QUERY_PARAM.PLAYER_ID) || '',
      startDate: searchParams.get(QUERY_PARAM.START_DATE) || undefined,
      endDate: searchParams.get(QUERY_PARAM.END_DATE) || undefined,
    },
    queryMode: searchParams.get(QUERY_PARAM.QUERY_MODE) as QueryHistoryAction | undefined,
  }), [searchParams]);

  const setUrlState = (newState: UrlState) => {
    const params = new URLSearchParams();
    Object.entries(newState.queryParams).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });
    if (newState.queryMode) {
      params.set(QUERY_PARAM.QUERY_MODE, newState.queryMode);
    }

    setSearchParams(params);
  };

  return [urlState, setUrlState];
}
