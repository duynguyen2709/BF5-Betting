import { Avatar, Col, Row } from 'antd'

import { MoneyTextCell } from '../MoneyTextCell'
import { VerticalCenterRowCellWithDivider } from './VerticalCenterRowCellWithDivider'
import BetResultTag from '../BetResultTag'

import type { BetHistory } from '@/types'
import type { TableProps } from 'antd'

import { BET_RESULT, BetType } from '@/constants'
import { isAccumulatorBet, parseBetEvent } from '@/utils/betHistory'

export function buildCommonTableColumn(players: Record<string, any>): TableProps<BetHistory>['columns'] {
  return [
    {
      title: 'Mã Cược',
      key: 'betId',
      dataIndex: 'betId',
      width: 120
    },
    {
      title: 'Người Cược',
      key: 'player',
      width: 150,
      render: (_, record) => {
        const betOwner = players[record.playerId]
        if (!betOwner) {
          return null
        }

        return (
          <Row style={{ alignItems: 'center' }}>
            <Avatar size={32} src={betOwner.avatarUrl} style={{ marginRight: 8, marginLeft: 8 }} />
            <p style={{ marginBottom: 0 }}>{betOwner.playerName}</p>
          </Row>
        )
      },
      filters: Object.values(players).map((player) => ({
        key: player.playerId,
        text: player.playerName,
        value: player.playerId
      })),
      onFilter: (value, record) => record.playerId === value
    },
    {
      title: 'Trận Đấu',
      key: 'match',
      render: (_, record) => (
        <>
          {record.events.map((event, index) => (
            <>
              <VerticalCenterRowCellWithDivider
                key={`${event.id}-${index}`}
                arrayLength={record.events.length}
                index={index}
              >
                <Col span={event.secondTeam ? 11 : undefined} className='team-data'>
                  {event.firstTeamLogoUrl && (
                    <Avatar size={24} alt='first-team-logo' src={event.firstTeamLogoUrl} className='team-logo' />
                  )}
                  <b className='team-name'>{event.firstTeam}</b>
                </Col>
                {event.secondTeam && (
                  <>
                    <Col span={1} className='team-data'>
                      <h1 className='team-data-divider'>:</h1>
                    </Col>
                    <Col span={11} className='team-data'>
                      {event.secondTeamLogoUrl && (
                        <Avatar size={24} alt='second-team-logo' src={event.secondTeamLogoUrl} className='team-logo' />
                      )}
                      <b className='team-name'>{event.secondTeam}</b>
                    </Col>
                  </>
                )}
              </VerticalCenterRowCellWithDivider>
            </>
          ))}
        </>
      )
    },
    {
      title: 'Lựa Chọn',
      key: 'event',
      width: 200,
      render: (_, record) =>
        record.events.map((event, index) => (
          <VerticalCenterRowCellWithDivider key={event.id} arrayLength={record.events.length} index={index}>
            {parseBetEvent(event)}
          </VerticalCenterRowCellWithDivider>
        ))
    },
    {
      title: 'Kết Quả',
      children: [
        {
          title: 'Trận Đấu',
          key: 'matchResult',
          width: 80,
          render: (_, record) => (
            <>
              {isAccumulatorBet(record) &&
                record.events.map((event, index) => (
                  <VerticalCenterRowCellWithDivider key={event.id} index={index} arrayLength={record.events.length}>
                    <BetResultTag result={event.result} />
                  </VerticalCenterRowCellWithDivider>
                ))}
            </>
          )
        },
        {
          title: 'Cược',
          key: 'result',
          width: 150,
          render: (_, record) => <BetResultTag result={record.result} />,
          filters: Object.values(BET_RESULT).map((ele) => ({
            key: ele.result,
            text: ele.text,
            value: ele.text
          })),
          onFilter: (value, record) => {
            const currentBetResult = Object.values(BET_RESULT).find((ele) => ele.result === record.result)
            return currentBetResult?.text === value
          }
        }
      ]
    },
    {
      title: 'Tiền Cược',
      children: [
        {
          title: 'Tiền Gốc',
          key: 'betAmount',
          width: 100,
          render: (_, record) => <MoneyTextCell value={record.betAmount} />
        },
        {
          title: 'Tỉ Lệ',
          children: [
            {
              title: 'Trận Đấu',
              key: 'matchRatio',
              width: 80,
              render: (_, record) => (
                <>
                  {isAccumulatorBet(record) &&
                    record.events.map((event, index) => (
                      <VerticalCenterRowCellWithDivider key={event.id} index={index} arrayLength={record.events.length}>
                        {event.ratio}
                      </VerticalCenterRowCellWithDivider>
                    ))}
                </>
              )
            },
            {
              title: 'Cược',
              key: 'ratio',
              dataIndex: 'ratio',
              width: 60
            }
          ]
        },
        {
          title: 'Lợi Nhuận',
          key: 'actualProfit',
          width: 100,
          render: (_, record) => <MoneyTextCell value={record.actualProfit} />
        }
      ]
    },
    {
      title: 'Loại Cược',
      key: 'betType',
      width: 130,
      render: (_, record) => {
        switch (record.betType) {
          case BetType.SINGLE:
            return <b>Cược Đơn</b>
          case BetType.ACCUMULATOR:
            return <b>Cược Xiên</b>
          case BetType.LUCKY:
            return <b>Cược May Mắn</b>
          case BetType.SYSTEM:
            return <b>{`Cược Hệ Thống (${(record.metadata as any).combination})`}</b>
          default:
            return null
        }
      }
    },
    {
      title: 'Thời Gian',
      key: 'betTime',
      dataIndex: 'betTime',
      width: 160
    }
  ]
}
