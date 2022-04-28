import React from "react";

import Heading from "@appserver/components/heading";
import IconButton from "@appserver/components/icon-button";

const Header = ({ headerLabel, onArrowClickAction }) => {
  return (
    <div className="header">
      <IconButton
        iconName="/static/images/arrow.path.react.svg"
        size="17"
        isFill={true}
        className="arrow-button"
        onClick={onArrowClickAction}
      />
      <Heading size="medium" truncate={true}>
        {headerLabel.replace("()", "")}
      </Heading>
    </div>
  );
};

export default React.memo(Header);
