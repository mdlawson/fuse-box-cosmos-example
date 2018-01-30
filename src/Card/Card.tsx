import React, { Component } from "react";
import classNames from "classnames";

export interface Props {
  className?: string;
}

class Card extends React.Component<Props> {
  render() {
    const { children, className } = this.props;
    return <div className={className}>{children}</div>;
  }
}

export default Card;
