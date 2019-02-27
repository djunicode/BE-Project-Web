import React from "react";
import { Jumbotron, Button } from "reactstrap";


const JumboTron = () => {
  return (
    <Jumbotron className="w-100 h-50 j-container">
      <p className="jumbotron-text mx-auto align-middle">
        Upload in-house as well as out-house projects
      </p>
      <br />
      <div className="row justify-content-center">
        <div className="col-3">
          <Button
            color="primary"
            size="lg"
            style={{ borderRadius: 20 }}
            className="in-house-button text-center w-50"
          >
            In-house
          </Button>
        </div>
        <div className="col-2">
          <Button
            color="primary"
            size="lg"
            style={{ borderRadius: 20 }}
            className="out-house-button w-75"
          >
            Out-house
          </Button>
        </div>
      </div>
    </Jumbotron>
  );
};

export default JumboTron;
