import React from "react";
import styled from "styled-components";
import { utils} from "asc-web-components";
import isEqual from "lodash/isEqual";
import classnames from "classnames";
import {IsVisibleContextConsumer} from "asc-web-common"
const { tablet } = utils.device;

const StyledSectionHeader = styled.div`

 
  border-bottom: 1px solid #eceef1;
  height: 55px;
  margin-right: 24px;
  margin-top: -1px;

  @media ${tablet} {
    margin-right: 16px;
    border-bottom: none;
    ${(props) =>
      props.borderBottom &&
      `
      border-bottom: 1px solid #eceef1;
      padding-bottom: 16px
    `};
    height: 49px;

 
  }


  .section-header {
    width: calc(100% - 76px);

    @media ${tablet} {
      width: ${(props) =>
          props.isArticlePinned ? `calc(100% - 272px)` : "100%"};
      background-color: #fff; 
      position: fixed; 
      
      top: ${props => !props.isHeaderVisible ? "56px" : "0"} ; 
      transition: top 0.3s;
      z-index:155;
      
    padding-right: 16px;

      padding-top: 4px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      max-width: calc(100vw - 435px);

      @media ${tablet} {
        max-width: ${(props) =>
          props.isArticlePinned ? `calc(100vw - 320px)` : `calc(100vw - 96px)`};
      }
    }
  }

  .section-header--hidden {
    @media ${tablet} {
      top: -50px;
    }
  }
`;

class SectionHeader extends React.Component {
  constructor(props) {
    super(props);
    
    this.focusRef = React.createRef();
  }



  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {

    //console.log("PageLayout SectionHeader render");
    // eslint-disable-next-line react/prop-types

    const { isArticlePinned, borderBottom, isHeaderVisible, ...rest } = this.props;

    return (
      
      <StyledSectionHeader
		    isHeaderVisible={isHeaderVisible}
        isArticlePinned={isArticlePinned}
        borderBottom={borderBottom}
      >
       <IsVisibleContextConsumer>
            { value => 
              <div id="scroll"  className={classnames("section-header", {
                "section-header--hidden": !value
              })} {...rest}/>
              }
        </IsVisibleContextConsumer>
      </StyledSectionHeader>
      

    );
  }
}

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
