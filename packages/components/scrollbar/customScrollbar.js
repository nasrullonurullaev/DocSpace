import React from "react";
import StyledScrollbar from "./styled-customScrollbar";
import { useTheme } from "styled-components";

const CustomScrollbars = ({ children, className, ...props }) => {
  const theme = useTheme();

  return (
    <StyledScrollbar {...props}>
      <div
        className={`container  scroll-body ${props.scrollclass} ${className}`}
        {...props}
        ref={props.ref}
        style={{ overflow: "scroll", direction: theme.interfaceDirection }}
      >
        {children}
      </div>
    </StyledScrollbar>
  );
};

export default CustomScrollbars;
