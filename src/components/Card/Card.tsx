import React, { Component } from "react";
import classNames from "classnames";

import { styles } from "./";

export interface Props {
  className?: string;
}

export class Card extends React.Component<Props> {
  render() {
    const { children, className } = this.props;
    return <div className={classNames(styles.card, className)}>{children}</div>;
  }
}

export default Card;
