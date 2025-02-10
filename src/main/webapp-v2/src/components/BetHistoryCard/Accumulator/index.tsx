import { Card, Divider } from 'antd';
import React from 'react';

import { BetHistoryCardTitle, BetHistoryDetailRow } from '../Common';
import styles from './index.module.css';

import type { BetHistory, BetMatchDetail } from '@/types';

import BetResultTag from '@/components/BetResultTag';
import { BET_RESULT, BetType } from '@/constants';
import { parseBetEvent } from '@/utils/betHistory';

interface AccumulatorBetHistoryCardProps {
  event: BetMatchDetail;
  index: number;
  dataLength: number;
  isHistoryViewMode: boolean;
}

interface AccumulatorBetHistoryCardWrapperProps {
  data: BetHistory;
  isHistoryViewMode: boolean;
}

const AccumulatorBetHistoryCard: React.FC<AccumulatorBetHistoryCardProps> = ({
  event,
  index,
  dataLength,
  isHistoryViewMode,
}) => {
  if (!event) {
    return null;
  }
  const isNotFirstElement = index > 0;
  const isNotLastElement = index < dataLength - 1;
  let style: React.CSSProperties = {
    borderBottom: 'none',
  };

  if (isNotFirstElement) {
    style = {
      ...style,
      borderTop: 'none',
      marginTop: '-0.5rem',
      borderRadius: '0',
    };
  } else {
    style = {
      ...style,
      borderRadius: '0.5rem 0.5rem 0 0',
      marginTop: '0.5rem',
    };
  }

  return (
    <Card
      title={<BetHistoryCardTitle data={event} />}
      bordered
      className={styles['cardBetHistoryAccumulator']}
      bodyStyle={{ padding: '0.5rem 1rem 0.5rem', fontSize: '13px' }}
      style={style}
    >
      <BetHistoryDetailRow left="Loại Cược:" right={parseBetEvent(event)} />
      {isHistoryViewMode && (
        <>
          <BetHistoryDetailRow left="Tỉ Lệ:" right={event.ratio} />
          {event.score && (
            <BetHistoryDetailRow
              left="Tỉ Số:"
              right={event.score}
              rightStyle={{ color: '#0c5a9d' }}
            />
          )}
          <BetHistoryDetailRow left="Kết Quả:" right={<BetResultTag result={event.result} />} />
        </>
      )}
      {isNotLastElement && (
        <Divider style={{ margin: '0.25rem', borderTop: '1px solid #0000001a' }} />
      )}
    </Card>
  );
};

const AccumulatorBetHistoryCardWrapper: React.FC<AccumulatorBetHistoryCardWrapperProps> = ({
  data,
  isHistoryViewMode,
}) => {
  const betTypeText = () => {
    switch (data.betType) {
      case BetType.ACCUMULATOR:
        return 'Cược Xiên';
      case BetType.LUCKY:
        return 'Cược May Mắn';
      case BetType.SYSTEM:
        return `Cược Hệ Thống (${(data.metadata as any).combination})`;
      default:
        return null;
    }
  };

  return (
    <>
      {data.events.map((event, index) => (
        <AccumulatorBetHistoryCard
          key={event.id}
          event={event}
          index={index}
          dataLength={data.events.length}
          isHistoryViewMode={isHistoryViewMode}
        />
      ))}
      <Card
        bordered
        className={styles['cardBetHistoryAccumulator']}
        styles={{
          body: {
            padding: '0.5rem 1rem 0.5rem',
          },
        }}
        style={{
          borderRadius: '0 0 0.25rem 0.25rem',
          borderTop: '1px solid #00b96b',
          marginBottom: '0.5rem',
        }}
      >
        <BetHistoryDetailRow left="Loại Cược:" right={betTypeText()} />
        {isHistoryViewMode && (
          <>
            <BetHistoryDetailRow left="Tiền Cược:" right={`${data.betAmount.toLocaleString()}đ`} />
            <BetHistoryDetailRow left="Tỉ Lệ:" right={data.ratio} />
            {data.result === BET_RESULT.Unfinished.result ? (
              <BetHistoryDetailRow
                left="Tiền Lời:"
                right={`${data.potentialProfit.toLocaleString()}đ`}
              />
            ) : null}
            <BetHistoryDetailRow left="Kết Quả:" right={<BetResultTag result={data.result} />} />
            {data.result === BET_RESULT.Win.result || data.result === BET_RESULT.HalfWin.result ? (
              <BetHistoryDetailRow
                left="Tiền Lời:"
                right={`${data.actualProfit!.toLocaleString()}đ`}
              />
            ) : null}
            {data.result === BET_RESULT.Lost.result ||
            data.result === BET_RESULT.HalfLost.result ? (
              <BetHistoryDetailRow
                left="Tiền Lỗ:"
                right={`${data.actualProfit!.toLocaleString()}đ`}
              />
            ) : null}
          </>
        )}
      </Card>
    </>
  );
};

export default AccumulatorBetHistoryCardWrapper;
