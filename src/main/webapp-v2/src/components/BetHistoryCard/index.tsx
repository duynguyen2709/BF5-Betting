import React from 'react';

import AccumulatorBetHistoryCard from './Accumulator';
import styles from './index.module.css';
import MultiBetHistoryCard from './Multi';
import SingleBetHistoryCard from './Single';

import type { BetHistory } from '@/types';

import { BetGroupTypeKey } from '@/constants';
import { isSingleBet } from '@/utils/betHistory';

interface BetHistoryCardProps {
  data: BetHistory | BetHistory[];
  type?: BetGroupTypeKey;
  isAdminView?: boolean;
  isHistoryViewMode?: boolean;
}

const AdminBetHistoryCard = ({ data, isHistoryViewMode = true }: BetHistoryCardProps) => {
  const singleBet = isSingleBet(data);
  const card = singleBet ? (
    <SingleBetHistoryCard data={data as BetHistory} />
  ) : (
    <AccumulatorBetHistoryCard data={data as BetHistory} isHistoryViewMode={isHistoryViewMode} />
  );
  return <div className={styles['cardBetHistoryWrapper']}>{card}</div>;
};

export const BetHistoryCard: React.FC<BetHistoryCardProps> = ({
  data,
  type,
  isAdminView = false,
  isHistoryViewMode = true,
}) => {
  if (isAdminView) {
    return <AdminBetHistoryCard data={data} />;
  }

  let card: React.ReactNode;
  switch (type) {
    case BetGroupTypeKey.Single:
      card = <SingleBetHistoryCard data={data as BetHistory} />;
      break;
    case BetGroupTypeKey.Accumulator:
      card = (
        <AccumulatorBetHistoryCard
          data={data as BetHistory}
          isHistoryViewMode={isHistoryViewMode}
        />
      );
      break;
    case BetGroupTypeKey.MultiBetsSameMatch:
      card = <MultiBetHistoryCard data={data as BetHistory[]} />;
      break;
    default:
      card = null;
      break;
  }
  return <div className={styles['cardBetHistoryWrapper']}>{card}</div>;
};

export default BetHistoryCard;
