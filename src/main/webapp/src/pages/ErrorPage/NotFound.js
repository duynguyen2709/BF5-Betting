import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import NotFoundImage from "../../images/illustrations/404.svg";
import {Button, Col, Row} from "antd";
import "./index.scss";
import {Link} from "react-router-dom";
import {ROUTES} from "../../common/Constant";

const NotFound = () => {
  return (
    <main className={"not-found-container"}>
      <Row className="main-row">
        <Col span={12} className="text-center flex-center">
          <div>
            <img
              alt={"not-found"}
              src={NotFoundImage}
              className={"image-not-found"}
            />
            <h1 className={"title-not-found"}>Page not found</h1>
            <p>
              Oops! Looks like you followed a bad link. If you think this is a
              problem with us, please tell us.
            </p>
            <Link to={ROUTES.Base.path}>
              <Button className={"button-back-home"}>
                <FontAwesomeIcon icon={faChevronLeft} />
                <b style={{ marginLeft: 10 }}>Go back home</b>
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </main>
  );
};

export default NotFound;
