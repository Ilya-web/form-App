import React from 'react';
import classNames from "classnames";

export const Steps = ({currentStep}) => {
  return (
    <>
      <div className="steps">
        <div className={classNames('step', {'active': currentStep >= 1})}>
          <span>1</span>
        </div>
        <div className={classNames('step', {'active': currentStep >= 2})}>
          <span>2</span>
        </div>
        <div className={classNames('step', {'active': currentStep === 4})}>
          <span>3</span>
        </div>
      </div>
    </>
  );
};

