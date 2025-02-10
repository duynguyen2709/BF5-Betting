import { Card, Divider } from 'antd';
import React from 'react';

import { BetHistoryCardTitle, BetHistoryDetailRow } from '../Common';
import styles from './index.module.css';

import type { BetHistory } from '@/types';

import BetResultTag from '@/components/BetResultTag';
import { BET_RESULT } from '@/constants';
import { parseBetEvent } from '@/utils/betHistory';

interface MultiBetHistoryCardProps {
  data: BetHistory[];
}

const MultiBetHistoryCard: React.FC<MultiBetHistoryCardProps> = ({ data }) => {
  const firstEvent = data[0]?.events[0];
  if (!firstEvent) {
    return null;
  }

  return (
    <Card
      title={<BetHistoryCardTitle data={firstEvent} />}
      bordered
      className={styles['cardBetHistory']}
      styles={{
        body: {
          padding: '0.5rem 1rem 0.5rem',
        },
      }}
    >
      {data.map((bet, index) => {
        const event = bet.events[0]!;
        const isNotLastEle = index < data.length - 1;
        return (
          <React.Fragment key={bet.betId}>
            <BetHistoryDetailRow left="Loại Cược:" right={parseBetEvent(event)} />
            <BetHistoryDetailRow left="Tiền Cược:" right={`${bet.betAmount.toLocaleString()}đ`} />
            <BetHistoryDetailRow left="Tỉ Lệ:" right={bet.ratio} />
            {event.score && (
              <BetHistoryDetailRow
                left="Tỉ Số:"
                right={event.score}
                rightStyle={{ color: '#0c5a9d' }}
              />
            )}
            {bet.result === BET_RESULT.Unfinished.result ? (
              <BetHistoryDetailRow
                left="Tiền Lời:"
                right={`${bet.potentialProfit.toLocaleString()}đ`}
              />
            ) : null}
            <BetHistoryDetailRow left="Kết Quả:" right={<BetResultTag result={bet.result} />} />
            {bet.result === BET_RESULT.Win.result || bet.result === BET_RESULT.HalfWin.result ? (
              <BetHistoryDetailRow
                left="Tiền Lời:"
                right={`${bet.actualProfit!.toLocaleString()}đ`}
              />
            ) : null}
            {bet.result === BET_RESULT.Lost.result || bet.result === BET_RESULT.HalfLost.result ? (
              <BetHistoryDetailRow
                left="Tiền Lỗ:"
                right={`${bet.actualProfit!.toLocaleString()}đ`}
              />
            ) : null}
            {isNotLastEle && <Divider style={{ margin: '0.5rem' }} />}
          </React.Fragment>
        );
      })}
    </Card>
  );
};

export default MultiBetHistoryCard;
