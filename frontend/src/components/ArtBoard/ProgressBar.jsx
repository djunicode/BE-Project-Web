import React from "react";

import { Progress } from "reactstrap";

const ProgressBar = props => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <div className="text-left">
            <p
              className="display-5"
              style={{
                fontSize: 25,
                fontFamily: "Open Sans",
                color: "#578BD8"
              }}
            >
              Fields Completed
            </p>
          </div>
        </div>
        <div className="col-6">
          <div className="text-right">
            <p className="display-5" style={{paddingRight: 20, fontSize: 20, color: '#5C96EB', fontFamily: 'Open Sans'}}>0/8</p>
          </div>
        </div>
      </div>

      <Progress value={props.value} max="8" />
    </div>
  );
};

export default ProgressBar;
