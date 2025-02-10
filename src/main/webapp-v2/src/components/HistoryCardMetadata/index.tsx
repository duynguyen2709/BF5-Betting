import { Avatar, Card, Row, Statistic } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import type { BetHistoryFilterRequest, Player } from '@/types';

const { Meta } = Card;

interface HistoryCardMetadataProps {
  players: Record<string, Player>;
  data: BetHistoryFilterRequest;
  style?: React.CSSProperties;
}

function parseDateDescription(startDate: string | undefined, endDate: string | undefined): string {
  const start = startDate && dayjs(startDate).format('DD/MM/YYYY');
  const end = endDate && dayjs(endDate).format('DD/MM/YYYY');
  if (start && end) {
    if (start === end) {
      return start;
    }
    return `${start} - ${end}`;
  }
  return start || end || '';
}

export const HistoryCardMetadata: React.FC<HistoryCardMetadataProps> = ({
  players,
  data,
  style,
}) => {
  const { playerId, startDate, endDate } = data;
  const actualPlayer = players[playerId];
  if (!players || !playerId || !actualPlayer) {
    return null;
  }

  const { totalProfit } = actualPlayer;
  const profitStyle: React.CSSProperties = {
    fontSize: '15px',
    color: totalProfit > 0 ? 'green' : totalProfit < 0 ? 'red' : undefined,
  };

  const title = (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
      <span>{actualPlayer.playerName}</span>
      <Statistic
        value={actualPlayer.totalProfit}
        valueStyle={profitStyle}
        prefix={actualPlayer.totalProfit > 0 ? '+' : undefined}
        suffix="đ"
      />
    </div>
  );

  return (
    <Meta
      avatar={<Avatar src={actualPlayer.avatarUrl} size={48} />}
      title={title}
      description={
        <div style={{ fontWeight: 400, fontSize: 14 }}>
          {parseDateDescription(startDate, endDate)}
        </div>
      }
      style={style}
    />
  );
};
