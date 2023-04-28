import React, { useCallback, useRef } from "react";
import { Button, Card, Col, Row } from "antd";
import { exportComponentAsJPEG } from "react-component-export-image";
import PlayerCard from "../PlayerCard";

import "./index.scss";

const AdminPlayerStatisticCard = ({ players }) => {
  const statisticCardRef = useRef();

  const handleClickExport = useCallback(() => {
    exportComponentAsJPEG(statisticCardRef);
  }, [statisticCardRef]);

  const numberOfPlayers = Object.keys(players).length;

  return (
    <Card className={"card-player-list-wrapper"}>
      <Row justify={"space-between"}>
        <Col span={18}>
          <Row ref={statisticCardRef}>
            {Object.values(players).map((player) => (
              <Col
                span={Math.round(24 / numberOfPlayers)}
                key={player.playerId}
              >
                <PlayerCard key={player.playerId} data={player} />
              </Col>
            ))}
          </Row>
        </Col>
        <Button type={"primary"} onClick={handleClickExport}>
          Xuất Thống Kê
        </Button>
      </Row>
    </Card>
  );
};

export default AdminPlayerStatisticCard;
