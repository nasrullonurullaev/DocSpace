import styled, { css } from 'styled-components';
import { mobile, tablet } from '@appserver/components/utils/device';
import Base from '@appserver/components/themes/base';

const StyledTile = styled.div`
  position: relative;
  display: grid;
  //min-width: 250px;
  width: 100%;
  height: ${(props) => (props.isFolder ? '57px' : '240px')};
  border: ${(props) => props.theme.tileLoader.border};
  border-radius: 3px;

  ${(props) =>
    props.isFolder
      ? css`
          &:before {
            content: '';
            position: absolute;
            top: -5px;
            left: -1px;
            border-top: ${(props) => props.theme.tileLoader.border};
            border-top-left-radius: 3px;
            border-left: ${(props) => props.theme.tileLoader.border};
            width: 38px;
            height: 8px;
            background: ${(props) => props.theme.tileLoader.background};
            border-bottom: transparent;
          }

          &:after {
            content: '';
            position: absolute;
            top: -4px;
            left: 34px;
            border-top: ${(props) => props.theme.tileLoader.border};
            background: ${(props) => props.theme.tileLoader.background};
            width: 7px;
            height: 10px;
            transform: rotateZ(35deg);

            @media ${tablet} {
              left: 34px;
            }
          }
        `
      : null}
`;

StyledTile.defaultProps = { theme: Base };

const StyledMainContent = styled.div`
  padding: 12px 12px 4px 12px;
  height: 175px;

  clipPath > rect {
    width: calc(100% + 20px);
  }
`;

const StyledBottom = styled.div`
  display: grid;
  grid-template-columns: 24px auto;
  grid-gap: 8px;
  padding: ${(props) => (props.isFolder ? '20px 12px' : '8px 12px 12px 12px')};

  .first-content {
    display: inline-block;
    ${(props) =>
      !props.isFolder
        ? css`
            width: 24px;
            height: 30px;
          `
        : css`
            width: 16px;
            height: 16px;
          `}
  }
  .second-content {
    clipPath > rect {
      width: calc(100% + 20px);
    }
    width: 100%;
    height: ${(props) => (props.isFolder ? '16px' : '30px')};
  }
`;

export { StyledTile, StyledBottom, StyledMainContent };
