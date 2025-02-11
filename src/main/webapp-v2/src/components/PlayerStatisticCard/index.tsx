import { Card, Divider, Empty, Tabs } from 'antd';
import React from 'react';

import { HistoryCardMetadata } from '../HistoryCardMetadata';
import {
  ChartCombinedStats,
  ChartTitle,
  ChartTopWinRateByTeam,
  ChartTopWinRateByTournament,
  ChartWinRateByTeam,
} from '../PlayerBetStatisticChart';
import { BetStatisticGroup } from './BetStatisticGroup';
import styles from './index.module.css';

import { MESSAGES } from '@/constants';
import { usePlayerQuery } from '@/hooks';
import { isAllUnfinishedBets } from '@/utils/betHistory';
import { PlayerBetStatistics } from '@/types';

export const PlayerStatisticCard: React.FC<{
  data: PlayerBetStatistics;
  historyFilterParams: any;
}> = ({ data, historyFilterParams }) => {
  const { assetByDateList, betHistoryList } = data;
  const { players } = usePlayerQuery();

  const isBetHistoryEmpty = betHistoryList && betHistoryList.length === 0;
  const allUnfinishedBets = isAllUnfinishedBets(betHistoryList);

  function CardStatisticContent() {
    if (isBetHistoryEmpty) {
      return <Empty className={styles['card-bet-empty']} description={MESSAGES.EMPTY_BET} />;
    } else if (allUnfinishedBets) {
      return (
        <Empty className={styles['card-bet-empty']} description={MESSAGES.ALL_BET_UNFINISHED} />
      );
    }

    return (
      <>
        <Divider className={styles['divider']} />
        <div className={styles['statistic-group-container']}>
          <BetStatisticGroup title="Thống Kê Cược" data={betHistoryList} />
        </div>
        <div className={styles['chart-container']}>
          <ChartCombinedStats
            title="Thống Kê Tài Sản và Tỉ Lệ Thắng Theo Ngày"
            assetData={assetByDateList}
            betData={betHistoryList}
          />
        </div>
        <div className={styles['chart-container']}>
          <div className={styles['chart-title-container']}>
            <ChartTitle text={'Thống Kê Chi Tiết'} />
          </div>
          <Tabs
            animated={false}
            defaultActiveKey="tournament"
            type="card"
            items={[
              {
                key: 'tournament',
                label: 'Top 5 Giải',
                children: <ChartTopWinRateByTournament data={betHistoryList} />,
              },
              {
                key: 'topTeams',
                label: 'Top 5 Đội',
                forceRender: true,
                children: <ChartTopWinRateByTeam data={betHistoryList} />,
              },
              {
                key: 'allTeams',
                label: 'Xem Theo Đội',
                forceRender: true,
                children: <ChartWinRateByTeam data={betHistoryList} />,
              },
            ]}
            className={styles['tab-bar']}
            tabBarStyle={{
              padding: '0 1rem',
            }}
          />
        </div>
      </>
    );
  }

  return (
    <Card className={styles['card-player-statistic']}>
      <HistoryCardMetadata
        players={players}
        data={historyFilterParams}
        style={{ padding: '1rem 1rem 0' }}
      />
      <CardStatisticContent />
    </Card>
  );
};

export default PlayerStatisticCard;
