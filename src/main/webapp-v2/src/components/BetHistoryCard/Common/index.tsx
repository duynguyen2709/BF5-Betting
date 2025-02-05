import { Col, Row } from 'antd'
import React from 'react'

import styles from './index.module.css'

interface BetHistoryDetailTextProps {
  text: React.ReactNode
  leftStyle?: React.CSSProperties
  rightStyle?: React.CSSProperties
  isRightColumn?: boolean
}

interface BetHistoryDetailRowProps {
  left: React.ReactNode
  right: React.ReactNode
  leftStyle?: React.CSSProperties
  rightStyle?: React.CSSProperties
}

interface BetHistoryCardTitleData {
  tournamentName: string
  matchTime: string
  firstTeam: string
  secondTeam?: string
  firstTeamLogoUrl?: string
  secondTeamLogoUrl?: string
}

interface BetHistoryCardTitleProps {
  data: BetHistoryCardTitleData
}

const BetHistoryDetailText: React.FC<BetHistoryDetailTextProps> = ({
  text,
  leftStyle,
  rightStyle,
  isRightColumn = false
}) => {
  const rightAdditionalStyle: React.CSSProperties = {
    ...rightStyle,
    float: 'right',
    textAlign: 'right',
    fontWeight: 500
  }

  return (
    <p className={styles['betHistoryDetailText']} style={isRightColumn ? rightAdditionalStyle : leftStyle}>
      {text}
    </p>
  )
}

export const BetHistoryDetailRow: React.FC<BetHistoryDetailRowProps> = ({ left, right, leftStyle, rightStyle }) => (
  <Row>
    <Col span={6}>
      <BetHistoryDetailText text={left} leftStyle={leftStyle} />
    </Col>
    <Col span={18}>
      <BetHistoryDetailText text={right} rightStyle={rightStyle} isRightColumn />
    </Col>
  </Row>
)

export const BetHistoryCardTitle: React.FC<BetHistoryCardTitleProps> = ({ data }) => (
  <>
    <Row justify='space-between'>
      <p className={styles['betHistoryTournamentName']}>{data.tournamentName}</p>
      <p className={styles['betHistoryMatchTime']}>{data.matchTime}</p>
    </Row>
    <Row justify='center' style={{ width: '100%' }}>
      <Col span={data.secondTeam ? 11 : undefined} className={styles['teamData']}>
        {data.firstTeamLogoUrl && (
          <img alt='first-team-logo' src={data.firstTeamLogoUrl} className={styles['teamLogo']} />
        )}
        <b className={styles['teamName']}>{data.firstTeam}</b>
      </Col>
      {data.secondTeam && (
        <>
          <Col span={1} className={styles['teamData']}>
            <h1 className={styles['teamDataDivider']}>:</h1>
          </Col>
          <Col offset={1} span={11} className={styles['teamData']}>
            {data.secondTeamLogoUrl && (
              <img alt='second-team-logo' src={data.secondTeamLogoUrl} className={styles['teamLogo']} />
            )}
            <b className={styles['teamName']}>{data.secondTeam}</b>
          </Col>
        </>
      )}
    </Row>
  </>
)
