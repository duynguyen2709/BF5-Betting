import { Card, Empty, Tabs } from 'antd';
import React, { useState } from 'react';

import styles from './index.module.css';

import type { BetHistory, BetHistoryFilterRequest, GroupedBetHistory, TabKeys } from '@/types';

import { BetHistoryStatistic } from '@/components/BetHistoryStatistic';
import { HistoryCardMetadata } from '@/components/HistoryCardMetadata';
import { MESSAGES } from '@/constants/common';
import { usePlayerQuery } from '@/hooks';
import { groupBetHistoriesByType } from '@/utils/betHistory';
import BetHistoryCard from '../BetHistoryCard';
import { BetGroupTypeKey } from '@/constants';

const TAB_KEYS: TabKeys = {
  History: {
    label: 'Danh Sách Cược',
    key: 'history',
  },
  Statistic: {
    label: 'Tổng Hợp',
    key: 'summary',
  },
};

interface HistoryCardWrapperProps {
  data: BetHistory[];
  historyFilterParams: BetHistoryFilterRequest;
}

export const HistoryCardWrapper: React.FC<HistoryCardWrapperProps> = ({
  data,
  historyFilterParams,
}) => {
  const [historyActiveTab, setHistoryActiveTab] = useState(TAB_KEYS.History.key);
  const { players } = usePlayerQuery();
  if (!data) {
    return null;
  }

  const isHistoryListNotEmpty = !!data?.length;
  const isHistoryFetchedButEmpty = data !== undefined && data.length === 0;
  const betHistoriesByGroup = groupBetHistoriesByType(data) || [];

  const handleChangeTab = (key: string) => {
    setHistoryActiveTab(key);
  };

  return (
    <Card className={styles['card-bet-wrapper']}>
      <HistoryCardMetadata
        players={players}
        data={historyFilterParams}
        style={{ padding: '0.5rem', paddingTop: '1rem' }}
      />
      {isHistoryFetchedButEmpty && (
        <Empty className={styles['card-bet-empty']} description={MESSAGES.EMPTY_BET} />
      )}
      {isHistoryListNotEmpty && (
        <Tabs
          activeKey={historyActiveTab}
          onChange={handleChangeTab}
          items={[
            {
              key: TAB_KEYS['History']!.key,
              label: <h4>{TAB_KEYS['History']!.label}</h4>,
              children: betHistoriesByGroup.map((ele: GroupedBetHistory, index: number) => (
                <BetHistoryCard
                  key={`${ele.type}-${index}`}
                  data={ele.data}
                  type={ele.type as BetGroupTypeKey}
                  isHistoryViewMode
                />
              )),
            },
            {
              key: TAB_KEYS['Statistic']!.key,
              label: <h4>{TAB_KEYS['Statistic']!.label}</h4>,
              children: <BetHistoryStatistic data={data} />,
            },
          ]}
        />
      )}
    </Card>
  );
};
