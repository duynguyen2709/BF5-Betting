import { Col, Row } from "antd";

const BetHistoryDetailText = ({
  text,
  leftStyle,
  rightStyle,
  isRightColumn = false,
}) => {
  const rightAdditionalStyle = {
    ...rightStyle,
    float: "right",
    textAlign: "right",
    fontWeight: 500,
  };
  return (
    <p
      className={"bet-history-detail-text"}
      style={isRightColumn ? rightAdditionalStyle : leftStyle}
    >
      {text}
    </p>
  );
};

export const BetHistoryDetailRow = ({ left, right, leftStyle, rightStyle }) => {
  return (
    <Row>
      <Col span={6}>
        <BetHistoryDetailText text={left} leftStyle={leftStyle} />
      </Col>
      <Col span={18}>
        <BetHistoryDetailText
          text={right}
          rightStyle={rightStyle}
          isRightColumn
        />
      </Col>
    </Row>
  );
};

export const BetHistoryCardTitle = ({ data }) => {
  return (
    <>
      <Row justify={"space-between"}>
        <p className={"bet-history-tournament-name"}>{data.tournamentName}</p>
        <p className={"bet-history-match-time"}>{data.matchTime}</p>
      </Row>
      <Row justify="center" style={{ width: "100%" }}>
        <Col span={data.secondTeam ? 11 : undefined} className={"team-data"}>
          {data.firstTeamLogoUrl && (
            <img
              alt={"first-team-logo"}
              src={data.firstTeamLogoUrl}
              className={"team-logo"}
            />
          )}
          <b className={"team-name"}>{data.firstTeam}</b>
        </Col>
        {data.secondTeam && (
          <>
            <Col span={1} className={"team-data"}>
              <h1 className={"team-data-divider"}>:</h1>
            </Col>
            <Col offset={1} span={11} className={"team-data"}>
              {data.secondTeamLogoUrl && (
                <img
                  alt={"second-team-logo"}
                  src={data.secondTeamLogoUrl}
                  className={"team-logo"}
                />
              )}
              <b className={"team-name"}>{data.secondTeam}</b>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};
